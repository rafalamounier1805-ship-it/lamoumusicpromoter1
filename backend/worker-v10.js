import { ensureSchema } from './schema-v10.js';

const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
const now=()=>new Date().toISOString();
const uid=()=>crypto.randomUUID();
const enc=new TextEncoder();

function b64(bytes){return btoa(String.fromCharCode(...bytes))}
function unb64(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0))}
async function sha256(value){const d=await crypto.subtle.digest('SHA-256',enc.encode(value));return b64(new Uint8Array(d))}
async function passwordHash(password,saltB64){const salt=saltB64?unb64(saltB64):crypto.getRandomValues(new Uint8Array(16));const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:210000},key,256);return {salt:b64(salt),hash:b64(new Uint8Array(bits))}}
function cookie(req,name){const raw=req.headers.get('cookie')||'';const hit=raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='));return hit?decodeURIComponent(hit.slice(name.length+1)):''}
function sessionCookie(token,maxAge=60*60*24*30){return `lamou_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}
async function body(req){try{return await req.json()}catch(_){return {}}}
async function currentUser(req,env){const token=cookie(req,'lamou_session');if(!token)return null;const hash=await sha256(token);return env.DB.prepare(`SELECT u.id,u.username,u.email,u.display_name,u.email_verified FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? LIMIT 1`).bind(hash,now()).first()}
async function createSession(userId,env){const token=b64(crypto.getRandomValues(new Uint8Array(32)));const hash=await sha256(token);const expires=new Date(Date.now()+30*86400000).toISOString();await env.DB.prepare('INSERT INTO sessions(id,user_id,token_hash,expires_at,created_at) VALUES(?,?,?,?,?)').bind(uid(),userId,hash,expires,now()).run();return token}
function nextUtcReset(){const d=new Date();d.setUTCDate(d.getUTCDate()+1);d.setUTCHours(0,0,0,0);return d.toISOString()}

async function register(req,env){const x=await body(req);const username=String(x.username||'').trim(),email=String(x.email||'').trim().toLowerCase(),display=String(x.displayName||x.name||'').trim(),password=String(x.password||'');if(!username||!email||!display||password.length<8)return json({error:'Dados inválidos.'},400);const exists=await env.DB.prepare('SELECT id FROM users WHERE username=? OR email=? LIMIT 1').bind(username,email).first();if(exists)return json({error:'Usuário ou e-mail já cadastrado.'},409);const h=await passwordHash(password),userId=uid(),t=now();await env.DB.prepare('INSERT INTO users(id,username,email,display_name,password_hash,password_salt,email_verified,created_at,updated_at) VALUES(?,?,?,?,?,?,0,?,?)').bind(userId,username,email,display,h.hash,h.salt,t,t).run();await env.DB.prepare('INSERT INTO artist_profiles(id,user_id,artist_name,artist_url,ad_code,artist_image,metadata_json,updated_at) VALUES(?,?,?,?,?,?,?,?)').bind(uid(),userId,'','','','',JSON.stringify({}),t).run();const token=await createSession(userId,env);return json({ok:true,user:{id:userId,username,email,displayName:display},emailVerification:'pending'},201,{'set-cookie':sessionCookie(token)})}

async function login(req,env){const x=await body(req),identity=String(x.identity||x.username||x.email||'').trim(),password=String(x.password||'');const user=await env.DB.prepare('SELECT * FROM users WHERE lower(username)=lower(?) OR lower(email)=lower(?) LIMIT 1').bind(identity,identity).first();if(!user)return json({error:'Credenciais inválidas.'},401);const h=await passwordHash(password,user.password_salt);if(h.hash!==user.password_hash)return json({error:'Credenciais inválidas.'},401);const token=await createSession(user.id,env);return json({ok:true,user:{id:user.id,username:user.username,email:user.email,displayName:user.display_name,emailVerified:!!user.email_verified}},200,{'set-cookie':sessionCookie(token)})}

async function logout(req,env){const token=cookie(req,'lamou_session');if(token){const hash=await sha256(token);await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(hash).run()}return json({ok:true},200,{'set-cookie':sessionCookie('',0)})}

async function changePassword(req,env,user){const x=await body(req),oldPass=String(x.currentPassword||''),newPass=String(x.newPassword||'');if(newPass.length<8)return json({error:'Nova senha inválida.'},400);const row=await env.DB.prepare('SELECT password_hash,password_salt FROM users WHERE id=?').bind(user.id).first();const old=await passwordHash(oldPass,row.password_salt);if(old.hash!==row.password_hash)return json({error:'Senha atual incorreta.'},403);const h=await passwordHash(newPass);await env.DB.prepare('UPDATE users SET password_hash=?,password_salt=?,updated_at=? WHERE id=?').bind(h.hash,h.salt,now(),user.id).run();await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(user.id).run();const token=await createSession(user.id,env);return json({ok:true},200,{'set-cookie':sessionCookie(token)})}

async function forgot(req,env){const x=await body(req),email=String(x.email||'').trim().toLowerCase();const user=await env.DB.prepare('SELECT id,email,display_name FROM users WHERE email=? LIMIT 1').bind(email).first();if(user){const token=b64(crypto.getRandomValues(new Uint8Array(32))),hash=await sha256(token),expires=new Date(Date.now()+30*60000).toISOString();await env.DB.prepare('INSERT INTO password_resets(id,user_id,token_hash,expires_at,created_at) VALUES(?,?,?,?,?)').bind(uid(),user.id,hash,expires,now()).run();if(env.RECOVERY_API_URL&&env.RECOVERY_API_TOKEN){await fetch(env.RECOVERY_API_URL,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${env.RECOVERY_API_TOKEN}`},body:JSON.stringify({to:user.email,name:user.display_name,token})}).catch(()=>{})}}
return json({ok:true,message:'Se o e-mail estiver cadastrado, a recuperação será enviada.'})}

async function profile(req,env,user){const p=await env.DB.prepare('SELECT * FROM artist_profiles WHERE user_id=?').bind(user.id).first();const connections=await env.DB.prepare('SELECT provider,status,expires_at FROM connections WHERE user_id=?').bind(user.id).all();const conn={};for(const c of connections.results||[]){conn[c.provider]=c.status==='connected'&&(!c.expires_at||c.expires_at>now())?'green':c.status==='connected'?'yellow':'red'}let meta={};try{meta=JSON.parse(p?.metadata_json||'{}')}catch(_){}return json({user,artist:{name:p?.artist_name||'',image:p?.artist_image||'',url:p?.artist_url||'',stats:meta.stats||null},connections:conn})}

async function ai(req,env,user){if(!env.AI)return json({error:'AI binding indisponível',provider:'nenhuma'},503);const x=await body(req),kind=String(x.kind||'copy'),context=x.context||{};let prompt='';if(kind==='copy')prompt=`Você é o LAMOU AI Engine. Crie em português uma legenda curta de divulgação musical e uma linha separada com hashtags. Não invente fatos. Contexto: ${JSON.stringify(context)}`;else if(kind==='classify-style')prompt=`Classifique tecnicamente o estilo musical mais provável usando somente estas pistas. Se não houver base suficiente, responda Não classificado. Retorne apenas o estilo. Pistas: ${JSON.stringify(context)}`;else prompt=`Crie três estratégias distintas de campanha musical com objetivo, dias, intensidade e canais. Não invente métricas. Contexto: ${JSON.stringify(context)}`;try{const result=await env.AI.run('@cf/meta/llama-3.1-8b-instruct',{messages:[{role:'system',content:'Seja objetivo, confiável e nunca invente dados não verificados.'},{role:'user',content:prompt}],max_tokens:700});const text=result?.response||result?.result||'';await env.DB.prepare('INSERT INTO ai_usage(id,user_id,provider,operation,units,success,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid(),user?.id||null,'cloudflare-workers-ai',kind,null,1,now()).run().catch(()=>{});if(kind==='classify-style')return json({style:String(text).trim(),provider:'Cloudflare Workers AI'});return json({text,provider:'Cloudflare Workers AI',quota:'free-tier-first'})}catch(err){await env.DB.prepare('INSERT INTO ai_usage(id,user_id,provider,operation,units,success,created_at) VALUES(?,?,?,?,?,?,?)').bind(uid(),user?.id||null,'cloudflare-workers-ai',kind,null,0,now()).run().catch(()=>{});const msg=String(err?.message||err);if(/quota|limit|429|neurons/i.test(msg))return json({error:'Limite gratuito de IA atingido',quota_exhausted:true,resetAt:nextUtcReset(),fallback:'device-ai-when-authorized'},429);return json({error:'IA temporariamente indisponível',fallback:'device-ai-when-authorized'},503)}}

async function oauthStart(req,env,user,provider){const p=provider.toLowerCase();if(p==='spotify'&&env.SPOTIFY_CLIENT_ID){const redirect=`${new URL(req.url).origin}/api/oauth/spotify/callback`;const state=uid();await env.DB.prepare('INSERT OR REPLACE INTO connections(id,user_id,provider,status,updated_at) VALUES(COALESCE((SELECT id FROM connections WHERE user_id=? AND provider=?),?),?,?,?,?)').bind(user.id,p,uid(),user.id,p,'pending',now()).run();const q=new URLSearchParams({client_id:env.SPOTIFY_CLIENT_ID,response_type:'code',redirect_uri:redirect,scope:'user-read-email user-read-private',state});return json({url:'https://accounts.spotify.com/authorize?'+q.toString()})}return json({error:`OAuth de ${provider} ainda não configurado no backend.`},501)}

async function publish(req,env,user){const x=await body(req);return json({ok:false,error:'Publicadores oficiais ainda não configurados. O LAMOU não registra como publicado sem confirmação real.',mode:x.mode||null},501)}

export default {
  async fetch(req,env){
    const url=new URL(req.url),path=url.pathname;
    let schema=null;
    if(env.DB&&(path==='/api/health'||path.startsWith('/api/auth/')))schema=await ensureSchema(env.DB);
    if(path==='/api/health')return json({ok:true,service:'lamou-v10',time:now(),db:!!env.DB,db_ready:!!schema?.ready,db_tables:schema?.tables||0,db_error:schema?.error||null,ai:!!env.AI,vector:!!env.MUSIC_VECTOR});
    if(path==='/api/ai/health')return json({ok:!!env.AI,provider:env.AI?'Cloudflare Workers AI':'not-bound'});
    if(path.startsWith('/api/auth/')&&env.DB&&!schema?.ready)return json({error:'Banco D1 conectado, mas o esquema ainda não ficou pronto.',detail:schema?.error||null},503);
    if(path==='/api/auth/register'&&req.method==='POST')return register(req,env);
    if(path==='/api/auth/login'&&req.method==='POST')return login(req,env);
    if(path==='/api/auth/forgot'&&req.method==='POST')return forgot(req,env);
    if(path.startsWith('/api/')&&!env.DB&&path!=='/api/health'&&path!=='/api/ai/health')return json({error:'Banco D1 não conectado.'},503);
    const user=await currentUser(req,env);
    if(path.startsWith('/api/')&&!user&&path!=='/api/health'&&path!=='/api/ai/health')return json({error:'Não autenticado.'},401);
    if(path==='/api/auth/logout'&&req.method==='POST')return logout(req,env);
    if(path==='/api/auth/change-password'&&req.method==='POST')return changePassword(req,env,user);
    if(path==='/api/profile/summary'&&req.method==='GET')return profile(req,env,user);
    if(path==='/api/ai'&&req.method==='POST')return ai(req,env,user);
    if(path==='/api/publish'&&req.method==='POST')return publish(req,env,user);
    const m=path.match(/^\/api\/oauth\/([^/]+)\/start$/);if(m&&req.method==='GET')return oauthStart(req,env,user,m[1]);
    if(path.startsWith('/api/'))return json({error:'Rota não encontrada.'},404);
    return env.ASSETS?env.ASSETS.fetch(req):new Response('LAMOU backend ativo; assets não vinculados.',{status:503});
  }
};
