import app from './worker-entry-app.js';

const enc = new TextEncoder();
const dec = new TextDecoder();
const now = () => new Date().toISOString();
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store', ...headers}
});

function cookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  const hit = raw.split(';').map(x => x.trim()).find(x => x.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : '';
}
function b64(bytes) { return btoa(String.fromCharCode(...bytes)); }
function unb64(v) { return Uint8Array.from(atob(v), c => c.charCodeAt(0)); }
async function sha(value) {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(String(value || '')));
  return b64(new Uint8Array(d));
}
async function currentUser(req, env) {
  if (!env.DB) return null;
  const token = cookie(req, 'lamou_session');
  if (!token) return null;
  const hash = await sha(token);
  return env.DB.prepare(`SELECT u.id,u.username,u.email,u.display_name,u.email_verified
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>? LIMIT 1`).bind(hash, now()).first();
}
async function tokenKey(env) {
  const secret = String(env.TOKEN_ENCRYPTION_KEY || '');
  if (secret.length < 24) throw new Error('TOKEN_ENCRYPTION_KEY ausente ou curta');
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  return crypto.subtle.importKey('raw', raw, {name:'AES-GCM'}, false, ['decrypt']);
}
async function decryptToken(value, env) {
  if (!value) return '';
  const [version, ivB64, cipherB64] = String(value).split('.');
  if (version !== 'v1' || !ivB64 || !cipherB64) throw new Error('Token criptografado inválido');
  const key = await tokenKey(env);
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv:unb64(ivB64)}, key, unb64(cipherB64));
  return dec.decode(plain);
}
function trackId(input) {
  const m = String(input || '').match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
  return m?.[1] || (/^[A-Za-z0-9]{15,30}$/.test(String(input || '')) ? String(input) : '');
}
async function spotifyTrack(req, env, user) {
  const url = new URL(req.url);
  const id = trackId(url.searchParams.get('url') || url.searchParams.get('id'));
  if (!id) return json({error:'Link de faixa do Spotify inválido.'}, 400);
  const c = await env.DB.prepare(`SELECT access_token_enc,status,expires_at FROM connections
    WHERE user_id=? AND provider='spotify' LIMIT 1`).bind(user.id).first();
  if (!c?.access_token_enc || c.status !== 'connected') return json({error:'Spotify não conectado.'}, 409);
  try {
    const token = await decryptToken(c.access_token_enc, env);
    const r = await fetch(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`, {
      headers: {authorization:`Bearer ${token}`}
    });
    if (!r.ok) return json({error:r.status === 401 ? 'Sessão Spotify expirada. Atualize a conexão.' : `Spotify respondeu ${r.status}.`}, r.status === 401 ? 401 : 502);
    const x = await r.json();
    return json({ok:true, track:{
      id:x.id || id,
      title:x.name || '',
      artists:(x.artists || []).map(a => a?.name).filter(Boolean),
      artist:(x.artists || []).map(a => a?.name).filter(Boolean).join(', '),
      album:x.album?.name || '',
      albumType:x.album?.album_type || '',
      releaseDate:x.album?.release_date || '',
      cover:x.album?.images?.[0]?.url || '',
      url:x.external_urls?.spotify || '',
      durationMs:Number(x.duration_ms || 0),
      explicit:!!x.explicit,
      trackNumber:Number(x.track_number || 0),
      discNumber:Number(x.disc_number || 0),
      isrc:x.external_ids?.isrc || ''
    }});
  } catch (err) {
    return json({error:'Não foi possível consultar os metadados do Spotify.', detail:String(err?.message || err)}, 502);
  }
}
async function ensureStateTable(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS app_state(
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    state_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
}
function safeState(input) {
  const x = input && typeof input === 'object' ? input : {};
  return {
    history:Array.isArray(x.history) ? x.history.slice(0, 500) : [],
    suppressed:Array.isArray(x.suppressed) ? x.suppressed.slice(0, 2000) : [],
    rankings:Array.isArray(x.rankings) ? x.rankings.slice(0, 500) : []
  };
}
async function getState(env, user) {
  await ensureStateTable(env);
  const row = await env.DB.prepare('SELECT state_json,updated_at FROM app_state WHERE user_id=? LIMIT 1').bind(user.id).first();
  if (!row) return json({ok:true,state:safeState({}),updatedAt:null});
  let state = {};
  try { state = JSON.parse(row.state_json || '{}') || {}; } catch (_) {}
  return json({ok:true,state:safeState(state),updatedAt:row.updated_at || null});
}
async function putState(req, env, user) {
  await ensureStateTable(env);
  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  const state = safeState(payload?.state || payload);
  const encoded = JSON.stringify(state);
  if (encoded.length > 2_000_000) return json({error:'Estado local grande demais para sincronizar.'}, 413);
  const t = now();
  await env.DB.prepare(`INSERT INTO app_state(user_id,state_json,updated_at) VALUES(?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET state_json=excluded.state_json,updated_at=excluded.updated_at`)
    .bind(user.id, encoded, t).run();
  return json({ok:true,updatedAt:t});
}
async function diagnostics(req, env) {
  const user = await currentUser(req, env);
  let dbReady = false, tables = 0, spotify = 'not_connected';
  try {
    const row = await env.DB.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").first();
    tables = Number(row?.n || 0); dbReady = true;
    if (user) {
      const c = await env.DB.prepare("SELECT status FROM connections WHERE user_id=? AND provider='spotify' LIMIT 1").bind(user.id).first();
      spotify = c?.status || 'not_connected';
    }
  } catch (_) {}
  return json({
    ok:dbReady,
    version:'13.0.0',
    db:{bound:!!env.DB,ready:dbReady,tables},
    ai:{bound:!!env.AI},
    tokenEncryptionKeyConfigured:String(env.TOKEN_ENCRYPTION_KEY || '').length >= 24,
    spotifyClientIdConfigured:!!env.SPOTIFY_CLIENT_ID,
    session:user ? {authenticated:true,localDevice:String(user.username || '').startsWith('device_'),displayName:user.display_name || '',username:user.username || ''} : {authenticated:false},
    spotify
  }, dbReady ? 200 : 503);
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), path = url.pathname;

    // Never replace a valid account cookie with a device pseudo-user.
    if (path === '/api/session/device' && req.method === 'POST') {
      const existing = await currentUser(req, env);
      if (existing) return json({ok:true,preserved:true,user:{id:existing.id,displayName:existing.display_name,username:existing.username},localDevice:String(existing.username || '').startsWith('device_')});
      return app.fetch(req, env, ctx);
    }

    if (path === '/api/diagnostics' && req.method === 'GET') return diagnostics(req, env);

    const user = await currentUser(req, env);
    if (path === '/api/auth/me' && req.method === 'GET') {
      if (!user) return json({error:'Não autenticado.'}, 401);
      return json({ok:true,user:{id:user.id,username:user.username,email:user.email,displayName:user.display_name,emailVerified:!!user.email_verified,localDevice:String(user.username || '').startsWith('device_')}});
    }
    if (path === '/api/spotify/track' && req.method === 'GET') {
      if (!user) return json({error:'Não autenticado.'}, 401);
      return spotifyTrack(req, env, user);
    }
    if (path === '/api/state' && req.method === 'GET') {
      if (!user) return json({error:'Não autenticado.'}, 401);
      return getState(env, user);
    }
    if (path === '/api/state' && req.method === 'PUT') {
      if (!user) return json({error:'Não autenticado.'}, 401);
      return putState(req, env, user);
    }

    return app.fetch(req, env, ctx);
  }
};
