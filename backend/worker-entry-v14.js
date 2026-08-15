import app from './worker-entry-v13.js';

const enc = new TextEncoder();
const now = () => new Date().toISOString();
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store', ...headers}
});

const CHANNELS = Object.freeze({
  'sun7': {
    name:'Sun7 Label', email:'contato@sun7label.com', autoEmail:true,
    source:'https://www.sun7label.com/contato', rule:'Aceita links de demo pelo contato oficial.'
  },
  'progressive': {
    name:'Progressive Generation', email:'contato@progressivegeneration.com.br', autoEmail:true,
    source:'https://progressivegeneration.com.br/label/demo/', rule:'Exige link privado do SoundCloud com download habilitado.', requiresSoundCloud:true
  },
  'paulinas': {
    name:'Paulinas-COMEP', email:'comep@paulinas.com.br', autoEmail:true,
    source:'https://universo.paulinas.com.br/conteudo/envie-seu-projeto-paulinas-comep/61', rule:'Gravadora recebe apresentação de projeto e material por internet.'
  },
  'boxradio': {
    name:'Box Radio', email:'hello@boxradio.net', autoEmail:false,
    source:'https://boxradio.net/pt/submitmusic', rule:'Exige apoio prévio e confirmação no e-mail.', manualReason:'support_confirmation_required'
  },
  'yourjazz': {
    name:'Your Jazz Radio', email:'artist@yourjazzradio.com', autoEmail:false,
    source:'https://yourjazzradio.com/submit-music/', rule:'Artistas independentes devem usar o formulário; e-mail é orientado a gravadoras.', manualReason:'independent_artist_form_required'
  },
  'belem': {
    name:'Gravadora Belém', email:'contato@gravadorabelem.com.br', autoEmail:false,
    source:'https://gravadorabelem.com.br/', rule:'O site direciona “Envie sua música” para fluxo próprio.', manualReason:'official_submission_flow_required'
  },
  'dailyplaylists': {
    name:'DailyPlaylists', email:'info@dailyplaylists.com', autoEmail:false,
    source:'https://dailyplaylists.com/pt/', rule:'O e-mail é suporte; submissões musicais são feitas pela plataforma.', manualReason:'platform_submission_only'
  }
});

function cookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  const hit = raw.split(';').map(x => x.trim()).find(x => x.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : '';
}
function b64(bytes) { return btoa(String.fromCharCode(...bytes)); }
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
async function requestBody(req) { try { return await req.json(); } catch (_) { return {}; } }
function html(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function safeText(v, max = 5000) { return String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max); }

async function ensureTables(env) {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS email_outbox(
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      history_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_id TEXT,
      status TEXT NOT NULL,
      last_event TEXT,
      error TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id,history_id,channel_id)
    )`),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_email_outbox_user_date ON email_outbox(user_id,created_at DESC)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_email_outbox_provider_id ON email_outbox(provider_id)')
  ]);
}
async function loadHistory(env, userId, historyId) {
  const row = await env.DB.prepare('SELECT state_json FROM app_state WHERE user_id=? LIMIT 1').bind(userId).first();
  let state = {};
  try { state = JSON.parse(row?.state_json || '{}') || {}; } catch (_) {}
  const history = Array.isArray(state.history) ? state.history : [];
  return history.find(x => String(x?.id || '') === String(historyId || '')) || null;
}
function canUseAccount(user) {
  return !!user && !String(user.username || '').startsWith('device_');
}
function materialLinkFor(history, extra) {
  return safeText(extra?.materialUrl || history?.materialUrl || history?.url || '', 2000);
}
function validatePolicy(policy, history, extra) {
  if (!policy) return {ok:false, status:404, error:'Canal não reconhecido pela base verificada.'};
  if (!policy.autoEmail) return {ok:false, status:409, error:'Este canal não permite envio automático pelo LAMOU.', reason:policy.manualReason, source:policy.source, rule:policy.rule};
  const link = materialLinkFor(history, extra);
  if (!link) return {ok:false, status:422, error:'Este envio precisa de um link para a música/material.'};
  if (policy.requiresSoundCloud && !/^https:\/\/(?:www\.)?soundcloud\.com\//i.test(link)) {
    return {ok:false, status:422, error:'A Progressive Generation exige link privado do SoundCloud com download habilitado.', reason:'soundcloud_required', source:policy.source};
  }
  return {ok:true, materialUrl:link};
}
function buildMessage(history, policy, materialUrl, user) {
  const title = safeText(history?.title || 'Faixa', 180);
  const artist = safeText(history?.artist || 'LAMOU', 180);
  const project = safeText(history?.project || '', 240);
  const description = safeText(history?.description || '', 5000);
  const hashtags = safeText(history?.hashtags || '', 1200);
  const subject = `Apresentação musical — ${title} — ${artist}`.slice(0, 240);
  const parts = [
    `Olá, equipe ${policy.name},`,
    '',
    description || `${artist} apresenta “${title}”.`,
    project ? `Projeto/álbum: ${project}` : '',
    `Link do material: ${materialUrl}`,
    hashtags,
    '',
    `Contato: ${safeText(user.display_name || user.username || 'LAMOU', 180)}${user.email ? ` <${safeText(user.email, 254)}>` : ''}`,
    '',
    'Este contato foi selecionado a partir de uma página pública de submissão/contato musical. Se este endereço não deve receber novas apresentações, basta responder solicitando remoção.'
  ].filter(v => v !== '');
  const text = parts.join('\n');
  const rendered = `<p>Olá, equipe ${html(policy.name)},</p><p>${html(description || `${artist} apresenta “${title}”.`).replace(/\n/g,'<br>')}</p>${project ? `<p><strong>Projeto/álbum:</strong> ${html(project)}</p>` : ''}<p><strong>Link do material:</strong> <a href="${html(materialUrl)}">${html(materialUrl)}</a></p>${hashtags ? `<p>${html(hashtags)}</p>` : ''}<p>Contato: ${html(user.display_name || user.username || 'LAMOU')}${user.email ? ` &lt;${html(user.email)}&gt;` : ''}</p><hr><p style="font-size:12px;color:#666">Este contato foi selecionado a partir de uma página pública de submissão/contato musical. Se este endereço não deve receber novas apresentações, basta responder solicitando remoção.</p>`;
  return {subject, text, html:rendered};
}
async function dailyCount(env, userId) {
  const since = new Date(Date.now() - 86400000).toISOString();
  const row = await env.DB.prepare(`SELECT COUNT(*) n FROM email_outbox
    WHERE user_id=? AND created_at>=? AND status IN ('accepted','sent','delivered','opened','clicked')`).bind(userId, since).first();
  return Number(row?.n || 0);
}
function mapResendEvent(event) {
  const e = String(event || '').replace(/^email\./, '');
  if (['delivered','opened','clicked','sent','delivery_delayed','failed','bounced','complained'].includes(e)) return e;
  return e || 'accepted';
}
async function resendSend(env, payload, idempotencyKey) {
  if (!env.RESEND_API_KEY) return {ok:false, status:503, error:'RESEND_API_KEY não configurada no Worker.'};
  if (!env.EMAIL_FROM) return {ok:false, status:503, error:'EMAIL_FROM não configurado com um domínio remetente verificado.'};
  const r = await fetch('https://api.resend.com/emails', {
    method:'POST',
    headers:{
      'authorization':`Bearer ${env.RESEND_API_KEY}`,
      'content-type':'application/json',
      'idempotency-key':idempotencyKey
    },
    body:JSON.stringify(payload)
  });
  let data = {};
  try { data = await r.json(); } catch (_) {}
  if (!r.ok) return {ok:false, status:r.status, error:safeText(data?.message || data?.error?.message || data?.name || `Resend respondeu ${r.status}`, 1000), providerData:data};
  return {ok:true, id:data?.id || '', providerData:data};
}
async function resendStatus(env, id) {
  if (!env.RESEND_API_KEY) return {ok:false, status:503, error:'RESEND_API_KEY não configurada.'};
  const r = await fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}`, {headers:{authorization:`Bearer ${env.RESEND_API_KEY}`}});
  let data = {};
  try { data = await r.json(); } catch (_) {}
  if (!r.ok) return {ok:false, status:r.status, error:safeText(data?.message || `Resend respondeu ${r.status}`, 1000)};
  return {ok:true, data};
}
async function sendOne(env, user, history, channelId, extra = {}) {
  await ensureTables(env);
  const policy = CHANNELS[channelId];
  const valid = validatePolicy(policy, history, extra);
  if (!valid.ok) return valid;
  if (!Array.isArray(history?.channels) || !history.channels.includes(channelId)) {
    return {ok:false, status:409, error:'Este canal não foi selecionado na aprovação desta divulgação.'};
  }
  const existing = await env.DB.prepare('SELECT * FROM email_outbox WHERE user_id=? AND history_id=? AND channel_id=? LIMIT 1').bind(user.id, history.id, channelId).first();
  if (existing && ['accepted','sent','delivered','opened','clicked'].includes(String(existing.status))) {
    return {ok:true, duplicate:true, status:200, channelId, providerId:existing.provider_id, deliveryStatus:existing.status, recipient:existing.recipient};
  }
  const limit = Math.max(1, Math.min(100, Number(env.EMAIL_DAILY_LIMIT || 20)));
  const count = await dailyCount(env, user.id);
  if (count >= limit) return {ok:false, status:429, error:`Limite diário de segurança atingido (${limit} e-mails).`};

  const message = buildMessage(history, policy, valid.materialUrl, user);
  const attempt = Number(existing?.attempts || 0) + 1;
  const keySeed = await sha(`${user.id}:${history.id}:${channelId}:${attempt}`);
  const idem = `lamou-outreach-${keySeed.replace(/[^A-Za-z0-9_-]/g,'').slice(0,120)}`;
  const payload = {
    from:String(env.EMAIL_FROM),
    to:[policy.email],
    subject:message.subject,
    text:message.text,
    html:message.html,
    reply_to:String(env.EMAIL_REPLY_TO || user.email || '').trim() || undefined,
    tags:[{name:'channel',value:String(channelId).replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,256)}]
  };
  if (!payload.reply_to) delete payload.reply_to;

  const sent = await resendSend(env, payload, idem);
  const t = now();
  const rowId = existing?.id || crypto.randomUUID();
  if (!sent.ok) {
    await env.DB.prepare(`INSERT INTO email_outbox(id,user_id,history_id,channel_id,recipient,subject,provider,provider_id,status,last_event,error,attempts,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(user_id,history_id,channel_id) DO UPDATE SET status=excluded.status,error=excluded.error,attempts=excluded.attempts,updated_at=excluded.updated_at`)
      .bind(rowId,user.id,history.id,channelId,policy.email,message.subject,'resend',existing?.provider_id || null,'failed','failed',sent.error,attempt,existing?.created_at || t,t).run();
    return {ok:false, status:sent.status || 502, error:sent.error, channelId, recipient:policy.email};
  }
  await env.DB.prepare(`INSERT INTO email_outbox(id,user_id,history_id,channel_id,recipient,subject,provider,provider_id,status,last_event,error,attempts,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(user_id,history_id,channel_id) DO UPDATE SET provider_id=excluded.provider_id,status=excluded.status,last_event=excluded.last_event,error=NULL,attempts=excluded.attempts,updated_at=excluded.updated_at`)
    .bind(rowId,user.id,history.id,channelId,policy.email,message.subject,'resend',sent.id,'accepted','sent',null,attempt,existing?.created_at || t,t).run();
  return {ok:true, status:200, channelId, recipient:policy.email, providerId:sent.id, deliveryStatus:'accepted'};
}
async function sendEmail(req, env, user) {
  if (!canUseAccount(user)) return json({error:'Entre em uma conta LAMOU real antes de enviar e-mails.'}, 403);
  const x = await requestBody(req);
  const historyId = safeText(x.historyId, 120), channelId = safeText(x.channelId, 80);
  const history = await loadHistory(env, user.id, historyId);
  if (!history || !['approved','sent'].includes(String(history.status || ''))) return json({error:'Material aprovado não encontrado no histórico sincronizado.'}, 404);
  const result = await sendOne(env, user, history, channelId, x);
  return json(result.ok ? result : {error:result.error,reason:result.reason,source:result.source,rule:result.rule,channelId,recipient:result.recipient}, result.status || (result.ok ? 200 : 400));
}
async function sendBatch(req, env, user) {
  if (!canUseAccount(user)) return json({error:'Entre em uma conta LAMOU real antes de enviar e-mails.'}, 403);
  const x = await requestBody(req);
  const historyId = safeText(x.historyId, 120);
  const history = await loadHistory(env, user.id, historyId);
  if (!history || !['approved','sent'].includes(String(history.status || ''))) return json({error:'Material aprovado não encontrado no histórico sincronizado.'}, 404);
  const requested = Array.isArray(x.channelIds) ? x.channelIds.map(v => safeText(v,80)) : (Array.isArray(history.channels) ? history.channels : []);
  const ids = [...new Set(requested)].filter(id => CHANNELS[id]?.autoEmail).slice(0, 8);
  const results = [];
  for (const channelId of ids) results.push(await sendOne(env, user, history, channelId, x.materialUrls?.[channelId] ? {materialUrl:x.materialUrls[channelId]} : {}));
  return json({ok:results.some(r => r.ok), total:results.length, sent:results.filter(r => r.ok).length, failed:results.filter(r => !r.ok).length, results});
}
async function emailStatus(req, env, user) {
  await ensureTables(env);
  const u = new URL(req.url), providerId = safeText(u.searchParams.get('providerId'), 160);
  if (!providerId) return json({error:'providerId obrigatório.'}, 400);
  const row = await env.DB.prepare('SELECT * FROM email_outbox WHERE user_id=? AND provider_id=? LIMIT 1').bind(user.id, providerId).first();
  if (!row) return json({error:'Envio não encontrado.'}, 404);
  const remote = await resendStatus(env, providerId);
  if (!remote.ok) return json({error:remote.error,current:row.status}, remote.status || 502);
  const lastEvent = mapResendEvent(remote.data?.last_event);
  const status = ['delivered','opened','clicked'].includes(lastEvent) ? lastEvent : ['failed','bounced','complained'].includes(lastEvent) ? lastEvent : lastEvent === 'sent' ? 'sent' : row.status;
  await env.DB.prepare('UPDATE email_outbox SET status=?,last_event=?,updated_at=? WHERE id=?').bind(status,lastEvent,now(),row.id).run();
  return json({ok:true,providerId,status,lastEvent,to:remote.data?.to || [row.recipient],createdAt:remote.data?.created_at || row.created_at});
}
async function listEmails(req, env, user) {
  await ensureTables(env);
  const historyId = safeText(new URL(req.url).searchParams.get('historyId'), 120);
  const rows = historyId
    ? await env.DB.prepare('SELECT history_id,channel_id,recipient,provider_id,status,last_event,error,attempts,created_at,updated_at FROM email_outbox WHERE user_id=? AND history_id=? ORDER BY created_at DESC').bind(user.id, historyId).all()
    : await env.DB.prepare('SELECT history_id,channel_id,recipient,provider_id,status,last_event,error,attempts,created_at,updated_at FROM email_outbox WHERE user_id=? ORDER BY created_at DESC LIMIT 100').bind(user.id).all();
  return json({ok:true,emails:rows.results || []});
}
async function config(env) {
  return json({
    ok:true,
    version:'14.0.0',
    provider:'resend',
    configured:!!(env.RESEND_API_KEY && env.EMAIL_FROM),
    apiKeyConfigured:!!env.RESEND_API_KEY,
    fromConfigured:!!env.EMAIL_FROM,
    from:env.EMAIL_FROM ? String(env.EMAIL_FROM).replace(/<[^>]+>/,'<configurado>') : null,
    dailyLimit:Math.max(1,Math.min(100,Number(env.EMAIL_DAILY_LIMIT || 20))),
    channels:Object.fromEntries(Object.entries(CHANNELS).map(([id,c]) => [id,{name:c.name,autoEmail:c.autoEmail,email:c.autoEmail ? c.email : null,source:c.source,rule:c.rule,manualReason:c.manualReason || null}]))
  });
}
async function augmentDiagnostics(req, env, ctx) {
  const base = await app.fetch(req, env, ctx);
  let data = {};
  try { data = await base.clone().json(); } catch (_) { return base; }
  return json({...data,email:{provider:'resend',configured:!!(env.RESEND_API_KEY && env.EMAIL_FROM),apiKeyConfigured:!!env.RESEND_API_KEY,fromConfigured:!!env.EMAIL_FROM}}, base.status);
}

export default {
  async fetch(req, env, ctx) {
    const path = new URL(req.url).pathname;
    if (path === '/api/diagnostics' && req.method === 'GET') return augmentDiagnostics(req, env, ctx);
    if (path === '/api/outreach/email/config' && req.method === 'GET') return config(env);
    const user = await currentUser(req, env);
    if (path.startsWith('/api/outreach/email/') && !user) return json({error:'Não autenticado.'}, 401);
    if (path === '/api/outreach/email/send' && req.method === 'POST') return sendEmail(req, env, user);
    if (path === '/api/outreach/email/send-batch' && req.method === 'POST') return sendBatch(req, env, user);
    if (path === '/api/outreach/email/status' && req.method === 'GET') return emailStatus(req, env, user);
    if (path === '/api/outreach/email/list' && req.method === 'GET') return listEmails(req, env, user);
    return app.fetch(req, env, ctx);
  }
};
