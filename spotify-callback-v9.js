/* LAMOU v9 — Spotify PKCE callback completion */
(() => {
'use strict';
const CLIENT_ID='8a9c328f33b14bad9b48473d238925fc';
const TOKEN_KEY='lamou_spotify_pkce_v2';
const VERIFIER_KEY='lamou_spotify_verifier';
const STATE_KEY='lamou_spotify_state';
const PROFILE_KEY='lamou_artist_profile_v5';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load=(k,f)=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):f}catch(_){return f}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
function toast(m){if(typeof window.toast==='function')window.toast(m);else alert(m)}
async function exchange(code){
 const verifier=sessionStorage.getItem(VERIFIER_KEY);
 if(!verifier)throw new Error('missing_verifier');
 const redirect=location.origin+'/callback';
 const body=new URLSearchParams({client_id:CLIENT_ID,grant_type:'authorization_code',code,redirect_uri:redirect,code_verifier:verifier});
 const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
 if(!r.ok){const t=await r.text();throw new Error('token_exchange_'+r.status+'_'+t.slice(0,120))}
 const d=await r.json();
 save(TOKEN_KEY,{...d,obtained_at:Date.now(),expires_at:Date.now()+((d.expires_in||3600)*1000)});
 return d;
}
async function me(token){
 const r=await fetch('https://api.spotify.com/v1/me',{headers:{Authorization:'Bearer '+token}});
 if(!r.ok)throw new Error('me_'+r.status);
 return r.json();
}
async function handle(){
 if(location.pathname!=='/callback')return;
 const q=new URLSearchParams(location.search),err=q.get('error'),code=q.get('code'),state=q.get('state'),expected=sessionStorage.getItem(STATE_KEY);
 if(err){toast('Spotify não autorizou a conexão: '+err);history.replaceState({},'',location.origin+'/');return}
 if(!code){history.replaceState({},'',location.origin+'/');return}
 if(!state||!expected||state!==expected){toast('Falha de segurança na autorização do Spotify. Tente conectar novamente.');history.replaceState({},'',location.origin+'/');return}
 try{
  const token=await exchange(code);const who=await me(token.access_token);
  const p=load(PROFILE_KEY,{});p.spotifyStatus='Conectado';p.spotifyAccountName=who.display_name||who.id||'';p.spotifyAccountId=who.id||'';p.spotifyConnectedAt=new Date().toISOString();save(PROFILE_KEY,p);
  sessionStorage.removeItem(VERIFIER_KEY);sessionStorage.removeItem(STATE_KEY);
  history.replaceState({},'',location.origin+'/?spotify=connected');
  toast('Spotify conectado com sucesso.');
  setTimeout(()=>location.reload(),350);
 }catch(e){console.error('[LAMOU Spotify OAuth]',e);toast('Não foi possível concluir a conexão com o Spotify. Tente novamente.');history.replaceState({},'',location.origin+'/?spotify=error')}
}
window.addEventListener('DOMContentLoaded',handle);
})();