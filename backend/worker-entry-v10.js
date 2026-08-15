import app from './worker-v10.js';

const BUILD='12.0.0-stability';
const enc=new TextEncoder();
const now=()=>new Date().toISOString();
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});

function cookie(req,name){
  const raw=req.headers.get('cookie')||'';
  const hit=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='));
  return hit?decodeURIComponent(hit.slice(name.length+1)):'';
}
function b64(bytes){return btoa(String.fromCharCode(...bytes))}
async function sha256(value){
  const digest=await crypto.subtle.digest('SHA-256',enc.encode(String(value||'')));
  return b64(new Uint8Array(digest));
}
async function body(req){try{return await req.json()}catch(_){return {}}}
async function currentUser(req,env){
  if(!env.DB)return null;
  const token=cookie(req,'lamou_session');
  if(!token)return null;
  const tokenHash=await sha256(token);
  return env.DB.prepare(`SELECT u.id,u.username,u.email,u.display_name,u.email_verified
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>? LIMIT 1`).bind(tokenHash,now()).first();
}

async function ensureAppState(env){
  if(!env.DB)return false;
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS app_state (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    state_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
  return true;
}
function cleanObject(value){return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}
function isFinalHistory(item){
  const status=String(item?.status||'').toLowerCase();
  return ['published','completed','concluded','sent'].includes(status);
}
function sanitizeDraft(input){
  if(!input||typeof input!=='object'||Array.isArray(input))return null;
  const draft={...input};
  if(String(draft.creativePreview||'').startsWith('blob:')){
    draft.creativePreview='';
    draft.mediaNeedsReupload=true;
  }
  return draft;
}
function sanitizeState(input){
  const value=cleanObject(input);
  return {
    profile:cleanObject(value.profile),
    history:Array.isArray(value.history)?value.history.filter(isFinalHistory).slice(0,500):[],
    draft:sanitizeDraft(value.draft),
    radar:Array.isArray(value.radar)?value.radar.slice(0,500):[],
    webChannels:Array.isArray(value.webChannels)?value.webChannels.slice(0,1000):[],
    ai:cleanObject(value.ai)
  };
}
async function syncProfileFromState(env,user,state){
  const p=cleanObject(state?.profile);
  if(!Object.keys(p).length)return;
  const current=await env.DB.prepare('SELECT * FROM artist_profiles WHERE user_id=? LIMIT 1').bind(user.id).first();
  let metadata={};
  try{metadata=JSON.parse(current?.metadata_json||'{}')||{}}catch(_){}
  if(p.socials&&typeof p.socials==='object')metadata.socials={...(metadata.socials||{}),...p.socials};
  const artistName=String(p.artistName??current?.artist_name??'').trim();
  const artistUrl=String(p.artistUrl??current?.artist_url??'').trim();
  const adCode=String(p.adCode??current?.ad_code??'').trim();
  const artistImage=String(p.artistImage??current?.artist_image??'').trim();
  const t=now();
  await env.DB.prepare(`INSERT INTO artist_profiles(id,user_id,artist_name,artist_url,ad_code,artist_image,metadata_json,updated_at)
    VALUES(?,?,?,?,?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET artist_name=excluded.artist_name,artist_url=excluded.artist_url,
      ad_code=excluded.ad_code,artist_image=excluded.artist_image,metadata_json=excluded.metadata_json,updated_at=excluded.updated_at`)
    .bind(crypto.randomUUID(),user.id,artistName,artistUrl,adCode,artistImage,JSON.stringify(metadata),t).run();
}
async function appState(req,env,user){
  await ensureAppState(env);
  if(req.method==='GET'){
    const row=await env.DB.prepare('SELECT state_json,updated_at FROM app_state WHERE user_id=? LIMIT 1').bind(user.id).first();
    if(!row)return json({ok:true,state:null,updatedAt:null,build:BUILD});
    let state=null;
    try{state=JSON.parse(row.state_json)}catch(_){}
    return json({ok:true,state:sanitizeState(state),updatedAt:row.updated_at||null,build:BUILD});
  }
  if(req.method==='PUT'){
    const x=await body(req),state=sanitizeState(x.state);
    const serialized=JSON.stringify(state);
    if(serialized.length>750000)return json({error:'Estado do aplicativo excede o limite permitido.'},413);
    const t=now();
    await env.DB.prepare(`INSERT INTO app_state(user_id,state_json,updated_at) VALUES(?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET state_json=excluded.state_json,updated_at=excluded.updated_at`)
      .bind(user.id,serialized,t).run();
    await syncProfileFromState(env,user,state).catch(()=>{});
    return json({ok:true,updatedAt:t,build:BUILD});
  }
  return json({error:'Método não permitido.'},405);
}

async function patchProfile(req,env,user){
  const x=await body(req);
  const current=await env.DB.prepare('SELECT * FROM artist_profiles WHERE user_id=? LIMIT 1').bind(user.id).first();
  let metadata={};
  try{metadata=JSON.parse(current?.metadata_json||'{}')||{}}catch(_){}
  if(x.socials&&typeof x.socials==='object')metadata.socials={...(metadata.socials||{}),...x.socials};
  const displayName=String(x.displayName??user.display_name??'').trim();
  const artistName=String(x.artistName??current?.artist_name??'').trim();
  const artistUrl=String(x.artistUrl??current?.artist_url??'').trim();
  const adCode=String(x.adCode??current?.ad_code??'').trim();
  const artistImage=String(x.artistImage??current?.artist_image??'').trim();
  const t=now();
  if(displayName)await env.DB.prepare('UPDATE users SET display_name=?,updated_at=? WHERE id=?').bind(displayName,t,user.id).run();
  await env.DB.prepare(`INSERT INTO artist_profiles(id,user_id,artist_name,artist_url,ad_code,artist_image,metadata_json,updated_at)
    VALUES(?,?,?,?,?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET artist_name=excluded.artist_name,artist_url=excluded.artist_url,
      ad_code=excluded.ad_code,artist_image=excluded.artist_image,metadata_json=excluded.metadata_json,updated_at=excluded.updated_at`)
    .bind(crypto.randomUUID(),user.id,artistName,artistUrl,adCode,artistImage,JSON.stringify(metadata),t).run();
  return json({ok:true,profile:{displayName:displayName||user.display_name,artistName,artistUrl,adCode,artistImage,socials:metadata.socials||{}},build:BUILD});
}

function stripFence(text){
  return String(text||'').replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
}
function parseStrategyArray(text){
  const raw=stripFence(text);
  const start=raw.indexOf('['),end=raw.lastIndexOf(']');
  if(start<0||end<=start)return null;
  try{return JSON.parse(raw.slice(start,end+1))}catch(_){return null}
}
function normalizeStrategies(items){
  if(!Array.isArray(items))return null;
  const allowed=['Instagram','TikTok','YouTube Shorts','Facebook','Threads'];
  const out=items.slice(0,3).map((s,i)=>{
    const days=Math.max(3,Math.min(45,Number(s?.days)||[7,14,30][i]));
    const channels=Array.isArray(s?.channels)?s.channels.map(x=>String(x)).map(x=>x==='YouTube'?'YouTube Shorts':x).filter(x=>allowed.includes(x)):[];
    return {
      id:i+1,
      name:String(s?.name||`Campanha ${i+1}`).slice(0,90),
      why:String(s?.why||s?.objective||'Estratégia adaptada à faixa.').slice(0,260),
      days,
      intensity:String(s?.intensity||['Alta','Normal','Leve'][i]).slice(0,40),
      channels:[...new Set(channels.length?channels:[allowed[i],allowed[(i+1)%allowed.length]])]
    };
  });
  return out.length===3?out:null;
}
async function strategyAI(req,env,user){
  if(!env.AI)return json({error:'AI binding indisponível',provider:'nenhuma'},503);
  const x=await body(req),context=x.context||{};
  const prompt=`Crie exatamente 3 estratégias DISTINTAS de campanha para a música abaixo. Retorne SOMENTE JSON válido, sem markdown, no formato [{"name":"...","why":"...","days":7,"intensity":"Alta","channels":["Instagram","TikTok"]}]. Canais permitidos: Instagram, TikTok, YouTube Shorts, Facebook, Threads. Não invente métricas. Varie objetivo, duração, intensidade e canais. Contexto: ${JSON.stringify(context)}`;
  try{
    const result=await env.AI.run('@cf/meta/llama-3.1-8b-instruct',{
      messages:[{role:'system',content:'Retorne somente JSON válido. Nunca invente fatos ou métricas.'},{role:'user',content:prompt}],
      max_tokens:900
    });
    const raw=result?.response||result?.result||'';
    const strategies=normalizeStrategies(parseStrategyArray(raw));
    if(!strategies)return json({error:'A IA respondeu em formato inválido; use o fallback local.',provider:'Cloudflare Workers AI'},502);
    await env.DB.prepare('INSERT INTO ai_usage(id,user_id,provider,operation,units,success,created_at) VALUES(?,?,?,?,?,?,?)')
      .bind(crypto.randomUUID(),user.id,'cloudflare-workers-ai','strategy',null,1,now()).run().catch(()=>{});
    // text intentionally carries the array for compatibility with the existing frontend.
    return json({text:strategies,strategies,provider:'Cloudflare Workers AI',quota:'free-tier-first',build:BUILD});
  }catch(err){
    await env.DB.prepare('INSERT INTO ai_usage(id,user_id,provider,operation,units,success,created_at) VALUES(?,?,?,?,?,?,?)')
      .bind(crypto.randomUUID(),user.id,'cloudflare-workers-ai','strategy',null,0,now()).run().catch(()=>{});
    const msg=String(err?.message||err);
    if(/quota|limit|429|neurons/i.test(msg))return json({error:'Limite gratuito de IA atingido',quota_exhausted:true},429);
    return json({error:'IA temporariamente indisponível'},503);
  }
}

function normalizeSpotifyCallback(response){
  if(!response||response.status<300||response.status>=400)return response;
  const location=response.headers.get('location');
  if(!location)return response;
  try{
    const url=new URL(location);
    if(url.searchParams.get('oauth')==='spotify'&&url.searchParams.get('status')==='connected'){
      url.searchParams.set('status','success');
      return Response.redirect(url.toString(),response.status);
    }
  }catch(_){}
  return response;
}

export default {
  async fetch(req,env,ctx){
    const url=new URL(req.url),path=url.pathname;

    if(path==='/api/version')return json({ok:true,version:BUILD,time:now()});

    if(path==='/api/oauth/diagnostic'){
      return json({
        ok:true,build:BUILD,
        spotify_client_id:!!env.SPOTIFY_CLIENT_ID,
        token_encryption_key:!!env.TOKEN_ENCRYPTION_KEY,
        spotify_oauth:!!(env.SPOTIFY_CLIENT_ID&&env.TOKEN_ENCRYPTION_KEY),
        db:!!env.DB,
        ai:!!env.AI
      });
    }

    if(path==='/api/app-state'||(path==='/api/profile'&&req.method==='PATCH')||(path==='/api/ai'&&req.method==='POST')){
      if(!env.DB)return json({error:'Banco D1 não conectado.'},503);
      const user=await currentUser(req,env);
      if(!user)return json({error:'Não autenticado.'},401);
      if(path==='/api/app-state')return appState(req,env,user);
      if(path==='/api/profile')return patchProfile(req,env,user);
      const clone=req.clone();
      const x=await body(clone);
      if(String(x.kind||'')==='strategy')return strategyAI(req,env,user);
    }

    const response=await app.fetch(req,env,ctx);
    if(path==='/api/oauth/spotify/callback')return normalizeSpotifyCallback(response);
    return response;
  }
};
