import reach from './worker-entry-reach.js';

const enc=new TextEncoder();
const dec=new TextDecoder();
const now=()=>new Date().toISOString();
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});

function cookie(req,name){const raw=req.headers.get('cookie')||'';const hit=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='));return hit?decodeURIComponent(hit.slice(name.length+1)):''}
function b64(bytes){return btoa(String.fromCharCode(...bytes))}
function unb64(v){return Uint8Array.from(atob(v),c=>c.charCodeAt(0))}
async function sha(v){const d=await crypto.subtle.digest('SHA-256',enc.encode(String(v||'')));return b64(new Uint8Array(d))}
async function body(req){try{return await req.json()}catch(_){return {}}}
async function currentUser(req,env){if(!env.DB)return null;const token=cookie(req,'lamou_session');if(!token)return null;const h=await sha(token);return env.DB.prepare(`SELECT u.id,u.username,u.email,u.display_name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? LIMIT 1`).bind(h,now()).first()}
async function tokenKey(env){const secret=String(env.TOKEN_ENCRYPTION_KEY||'');if(secret.length<24)throw new Error('TOKEN_ENCRYPTION_KEY ausente');const raw=await crypto.subtle.digest('SHA-256',enc.encode(secret));return crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['decrypt'])}
async function decryptToken(value,env){if(!value)return'';const [v,iv,cipher]=String(value).split('.');if(v!=='v1'||!iv||!cipher)throw new Error('token');const key=await tokenKey(env);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(iv)},key,unb64(cipher));return dec.decode(plain)}
function artistIdFromUrl(u){const m=String(u||'').match(/open\.spotify\.com\/artist\/([A-Za-z0-9]+)/);return m?.[1]||''}
async function spotifyGet(path,token){const r=await fetch('https://api.spotify.com/v1'+path,{headers:{authorization:`Bearer ${token}`}});if(!r.ok)throw new Error(`spotify_${r.status}`);return r.json()}
function normalizeName(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

async function enrichedProfile(req,env,ctx){
  const baseResponse=await reach.fetch(req,env,ctx);
  if(!baseResponse.ok)return baseResponse;
  let base={};try{base=await baseResponse.clone().json()}catch(_){return baseResponse}
  const user=await currentUser(req,env);if(!user)return baseResponse;
  const p=await env.DB.prepare('SELECT * FROM artist_profiles WHERE user_id=? LIMIT 1').bind(user.id).first();
  const c=await env.DB.prepare(`SELECT * FROM connections WHERE user_id=? AND provider='spotify' LIMIT 1`).bind(user.id).first();
  if(!c?.access_token_enc||c.status!=='connected')return json(base);
  try{
    const token=await decryptToken(c.access_token_enc,env);
    const url=new URL(req.url),wantedUrl=String(url.searchParams.get('artistUrl')||p?.artist_url||''),wantedName=String(url.searchParams.get('artist')||p?.artist_name||base?.artist?.name||'LAMOU').trim();
    let artistId=artistIdFromUrl(wantedUrl),artist=null;
    if(!artistId&&wantedName){
      const s=await spotifyGet(`/search?type=artist&limit=10&q=${encodeURIComponent(wantedName)}`,token);
      const items=s?.artists?.items||[], exact=items.find(x=>normalizeName(x.name)===normalizeName(wantedName));
      artist=exact||items[0]||null;artistId=artist?.id||'';
    }
    if(!artistId)return json(base);
    if(!artist)artist=await spotifyGet(`/artists/${artistId}`,token);
    const albums=await spotifyGet(`/artists/${artistId}/albums?include_groups=album,single&limit=50`,token);
    const seen=new Set(),releases=[];
    for(const r of albums?.items||[]){if(!r?.id||seen.has(r.id))continue;seen.add(r.id);releases.push({id:r.id,name:r.name||'',type:r.album_type||r.album_group||'',releaseDate:r.release_date||'',tracks:Number(r.total_tracks||0),image:r.images?.[0]?.url||'',url:r.external_urls?.spotify||''})}
    releases.sort((a,b)=>String(b.releaseDate).localeCompare(String(a.releaseDate)));
    const stats={albums:releases.filter(x=>x.type==='album').length,singles:releases.filter(x=>x.type!=='album').length,releases:releases.length,tracks:releases.reduce((s,x)=>s+(x.tracks||0),0),followers:Number(artist?.followers?.total||0)||null};
    const enriched={...base,artist:{...(base.artist||{}),name:artist.name||wantedName,image:artist.images?.[0]?.url||'',url:artist.external_urls?.spotify||wantedUrl||'',stats,releases}};
    let meta={};try{meta=JSON.parse(p?.metadata_json||'{}')||{}}catch(_){}
    meta.stats=stats;meta.releases=releases;
    await env.DB.prepare(`INSERT INTO artist_profiles(id,user_id,artist_name,artist_url,ad_code,artist_image,metadata_json,updated_at)
      VALUES(?,?,?,?,?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET artist_name=excluded.artist_name,artist_url=excluded.artist_url,artist_image=excluded.artist_image,metadata_json=excluded.metadata_json,updated_at=excluded.updated_at`)
      .bind(p?.id||crypto.randomUUID(),user.id,enriched.artist.name,enriched.artist.url,p?.ad_code||'',enriched.artist.image,JSON.stringify(meta),now()).run().catch(()=>{});
    return json(enriched);
  }catch(err){return json({...base,spotifyCatalogError:String(err?.message||err)})}
}
async function patchProfile(req,env){
  const user=await currentUser(req,env);if(!user)return json({error:'Não autenticado.'},401);
  const x=await body(req),p=await env.DB.prepare('SELECT * FROM artist_profiles WHERE user_id=? LIMIT 1').bind(user.id).first(),t=now();
  const display=String(x.displayName||user.display_name||'').trim(),name=String(x.artistName||p?.artist_name||'').trim(),url=String(x.artistUrl||p?.artist_url||'').trim();
  if(display)await env.DB.prepare('UPDATE users SET display_name=?,updated_at=? WHERE id=?').bind(display,t,user.id).run();
  await env.DB.prepare(`INSERT INTO artist_profiles(id,user_id,artist_name,artist_url,ad_code,artist_image,metadata_json,updated_at)
    VALUES(?,?,?,?,?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET artist_name=excluded.artist_name,artist_url=excluded.artist_url,updated_at=excluded.updated_at`)
    .bind(p?.id||crypto.randomUUID(),user.id,name,url,p?.ad_code||'',p?.artist_image||'',p?.metadata_json||'{}',t).run();
  return json({ok:true});
}
async function ensureRank(env){
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS ai_rank_reference(
    id TEXT PRIMARY KEY,user_id TEXT,track_hash TEXT NOT NULL UNIQUE,genre TEXT NOT NULL,score REAL NOT NULL,
    fingerprint_json TEXT,ai_generated INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL
  )`).run();
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_ai_rank_genre_score ON ai_rank_reference(genre,score DESC)').run().catch(()=>{});
}
async function contribute(req,env){
  const user=await currentUser(req,env);if(!user)return json({error:'Não autenticado.'},401);
  const x=await body(req);if(x.aiGenerated!==true)return json({error:'A faixa precisa ser declarada como gerada/produzida com IA.'},400);
  const score=Number(x.score),genre=String(x.genre||'Outros').slice(0,80);if(!Number.isFinite(score)||score<0||score>100)return json({error:'Score inválido.'},400);
  await ensureRank(env);const trackHash=await sha(`${user.id}:${String(x.trackKey||'')}`);
  await env.DB.prepare(`INSERT INTO ai_rank_reference(id,user_id,track_hash,genre,score,fingerprint_json,ai_generated,created_at)
    VALUES(?,?,?,?,?,?,1,?)
    ON CONFLICT(track_hash) DO UPDATE SET genre=excluded.genre,score=excluded.score,fingerprint_json=excluded.fingerprint_json,created_at=excluded.created_at`)
    .bind(crypto.randomUUID(),user.id,trackHash,genre,score,JSON.stringify(x.fingerprint||{}),now()).run();
  return json({ok:true});
}
async function position(req,env){
  const x=await body(req),score=Number(x.score),genre=String(x.genre||'Outros').slice(0,80);if(!Number.isFinite(score))return json({error:'Score inválido.'},400);
  await ensureRank(env);
  const g=await env.DB.prepare('SELECT COUNT(*) n,SUM(CASE WHEN score>? THEN 1 ELSE 0 END) higher FROM ai_rank_reference WHERE ai_generated=1').bind(score).first();
  const s=await env.DB.prepare('SELECT COUNT(*) n,SUM(CASE WHEN score>? THEN 1 ELSE 0 END) higher FROM ai_rank_reference WHERE ai_generated=1 AND genre=?').bind(score,genre).first();
  const global={total:Number(g?.n||0),rank:Number(g?.higher||0)+1};global.eligible=global.total>=100;
  const style={total:Number(s?.n||0),rank:Number(s?.higher||0)+1};style.eligible=style.total>=30;
  return json({ok:true,global,style,criteria:'technical-only',popularity:false});
}

export default{
 async fetch(req,env,ctx){
   const p=new URL(req.url).pathname;
   if(p==='/api/profile/summary'&&req.method==='GET')return enrichedProfile(req,env,ctx);
   if(p==='/api/profile'&&req.method==='PATCH')return patchProfile(req,env);
   if(p==='/api/ranking/contribute'&&req.method==='POST')return contribute(req,env);
   if(p==='/api/ranking/position'&&req.method==='POST')return position(req,env);
   return reach.fetch(req,env,ctx);
 }
};