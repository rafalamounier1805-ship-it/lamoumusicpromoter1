(() => {
'use strict';
const STORE='lamou_v10_db';
const DEVICE='lamou_device_id';
const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};
const write=d=>localStorage.setItem(STORE,JSON.stringify(d));
const toast=m=>{const e=document.getElementById('toast');if(!e)return;e.textContent=m;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),3200)};
function deviceId(){let v=localStorage.getItem(DEVICE);if(!v){v=crypto.randomUUID?crypto.randomUUID():'dev-'+Date.now()+'-'+Math.random().toString(36).slice(2);localStorage.setItem(DEVICE,v)}return v}
async function api(path,options={}){try{const r=await fetch(path,{credentials:'include',cache:'no-store',...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});let data={};try{data=await r.json()}catch(_){}return {ok:r.ok,status:r.status,data}}catch(_){return {ok:false,status:0,data:{error:'Sem resposta do servidor.'}}}}
async function ensureSession(){return api('/api/session/device',{method:'POST',body:JSON.stringify({deviceId:deviceId()})})}
function persist(remote){const d=read();d.profile=d.profile||{};d.connections={spotify:d.connections?.spotify||'red'};if(remote?.artist){d.profile.artistName=remote.artist.name||d.profile.artistName||'';d.profile.artistImage=remote.artist.image||d.profile.artistImage||'';d.profile.artistUrl=remote.artist.url||d.profile.artistUrl||'';d.profile.artistStats=remote.artist.stats||d.profile.artistStats||null}if(remote?.connections?.spotify)d.connections.spotify=remote.connections.spotify;write(d)}
async function remoteProfile(){await ensureSession();const r=await api('/api/profile/summary',{method:'GET',headers:{}});if(r.ok)persist(r.data);return r}
async function connect(provider='spotify'){if(provider!=='spotify'){toast('O LAMOU conecta somente ao Spotify.');return false}const session=await ensureSession();if(!session.ok){toast('Não foi possível preparar a sessão do Spotify.');return false}const r=await api('/api/oauth/spotify/start',{method:'GET',headers:{}});if(r.ok&&r.data?.url){location.href=r.data.url;return true}toast(r.data?.error||'Não foi possível iniciar o Spotify.');return false}
async function sync(reload=false){const r=await remoteProfile();if(r.ok){if(reload)location.reload();else window.Lamou?.go?.('home')}return r}
if(window.Lamou){window.Lamou.connect=connect;window.Lamou.connectAll=()=>connect('spotify')}
window.LamouIntegration={api,connect,remoteProfile,sync,supported:['spotify']};
const q=new URLSearchParams(location.search);if(q.get('oauth')==='spotify'){const status=q.get('status');history.replaceState({},document.title,location.pathname+location.hash);if(status==='success'||status==='connected'){remoteProfile().then(r=>{toast(r.ok?'Spotify conectado com sucesso.':'Spotify autorizou, mas o perfil não atualizou.');if(r.ok)setTimeout(()=>location.reload(),300)})}else toast('Spotify não conectou.')}else remoteProfile().then(()=>window.Lamou?.go?.('home')).catch(()=>{});
})();