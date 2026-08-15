import app from './worker-v10.js';
import { ensureSchema } from './schema-v10.js';

const enc=new TextEncoder();
const now=()=>new Date().toISOString();
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
function b64(bytes){return btoa(String.fromCharCode(...bytes))}
function b64url(bytes){return b64(bytes).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function shaBytes(value){const d=await crypto.subtle.digest('SHA-256',enc.encode(String(value||'')));return new Uint8Array(d)}
async function sha(value){return b64(await shaBytes(value))}
async function body(req){try{return await req.json()}catch(_){return {}}}
function sessionCookie(token,maxAge=60*60*24*90){return `lamou_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}
async function createDeviceSession(req,env){
  if(!env.DB)return json({error:'Banco D1 não conectado.'},503);
  await ensureSchema(env.DB);
  const x=await body(req),deviceId=String(x.deviceId||'').trim();
  if(deviceId.length<8)return json({error:'Dispositivo inválido.'},400);
  const digest=await shaBytes(deviceId),key=Array.from(digest).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,24);
  const username='device_'+key,email=`${username}@device.lamou.invalid`;
  let user=await env.DB.prepare('SELECT id,username,email,display_name FROM users WHERE username=? LIMIT 1').bind(username).first();
  if(!user){
    const id=crypto.randomUUID(),t=now();
    await env.DB.prepare('INSERT INTO users(id,username,email,display_name,password_hash,password_salt,email_verified,created_at,updated_at) VALUES(?,?,?,?,?,?,1,?,?)').bind(id,username,email,'LAMOU','device-session','device-session',t,t).run();
    await env.DB.prepare('INSERT INTO artist_profiles(id,user_id,artist_name,artist_url,ad_code,artist_image,metadata_json,updated_at) VALUES(?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,'','','','',JSON.stringify({}),t).run();
    user={id,username,email,display_name:'LAMOU'};
  }
  const token=b64url(crypto.getRandomValues(new Uint8Array(32))),tokenHash=await sha(token),expires=new Date(Date.now()+90*86400000).toISOString();
  await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(user.id).run().catch(()=>{});
  await env.DB.prepare('INSERT INTO sessions(id,user_id,token_hash,expires_at,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),user.id,tokenHash,expires,now()).run();
  return json({ok:true,user:{id:user.id,displayName:user.display_name},spotifyOnly:true},200,{'set-cookie':sessionCookie(token)});
}

export default {
  async fetch(req,env,ctx){
    const path=new URL(req.url).pathname;
    if(path==='/api/session/device'&&req.method==='POST')return createDeviceSession(req,env);
    if(path==='/api/publish')return json({error:'Publicação em redes sociais foi removida. Use os canais profissionais de submissão do LAMOU.'},410);
    if(path.startsWith('/api/oauth/')&&!path.startsWith('/api/oauth/spotify/'))return json({error:'Somente Spotify é suportado.'},404);
    return app.fetch(req,env,ctx);
  }
};