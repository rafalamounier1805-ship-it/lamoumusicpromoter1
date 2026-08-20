(() => {
'use strict';

const VERSION='16.0.0';
let dashboard=null;
let profile=null;
let verifying=false;
let lastRefresh=null;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=()=>document.getElementById('appRoot');

async function api(path,options={}){
  try{
    const r=await fetch(path,{credentials:'include',cache:'no-store',...options,headers:{...(options.body?{'content-type':'application/json'}:{}),...(options.headers||{})}});
    let data={};try{data=await r.json()}catch(_){}
    return {ok:r.ok,status:r.status,data};
  }catch(_){return {ok:false,status:0,data:{error:'Sem resposta do servidor.'}}}
}

async function ensureSession(){
  let me=await api('/api/auth/me');
  if(me.ok)return true;
  let id=localStorage.getItem('lamou_device_id');
  if(!id){id=(crypto.randomUUID?crypto.randomUUID():'dev-'+Date.now())+'-'+Date.now();localStorage.setItem('lamou_device_id',id)}
  const r=await api('/api/session/device',{method:'POST',body:JSON.stringify({deviceId:id})});
  return r.ok;
}

const fmt=n=>Number.isFinite(Number(n))?new Intl.NumberFormat('pt-BR').format(Number(n)):'—';
const time=iso=>{try{return new Date(iso).toLocaleString('pt-BR',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})}catch(_){return '—'}};

function metric(value,label){return `<div class="dash-metric"><b>${fmt(value)}</b><small>${esc(label)}</small></div>`}

function statusFor(s){
  if(s.result_status==='rejected')return {label:'Reprovada',tone:'red'};
  if(s.ranking_status==='green')return {label:s.rank_value?`#${s.rank_value}`:'Ranqueada',tone:'green'};
  if(s.result_status==='under_review'||s.form_status==='blue'||s.form_status==='green'||s.ranking_status==='blue')return {label:'Em análise',tone:'blue'};
  if(s.registration_status==='green')return {label:'Não encontrada publicamente',tone:'gray'};
  return {label:'Sem status público',tone:'gray'};
}

function platformPill(s){
  const st=statusFor(s);
  const checked=s.last_checked_at?` · ${time(s.last_checked_at)}`:'';
  return `<div class="rank-pill ${st.tone}"><span><b>${esc(s.platform?.name||s.platform_id)}</b><small>${esc(st.label)}${esc(checked)}</small></span></div>`;
}

function trackCard(t){
  const relevant=(t.platforms||[]).filter(s=>s.registration_status!=='red'||s.form_status!=='red'||s.ranking_status!=='red'||s.result_status!=='pending');
  const rows=relevant.length?relevant.map(platformPill).join(''):'<div class="rank-empty">Nenhum status público encontrado ainda.</div>';
  return `<article class="rank-track"><div class="rank-track-head"><div class="rank-cover">${t.cover?`<img src="${esc(t.cover)}" alt="">`:'♫'}</div><div><h3>${esc(t.title)}</h3><p>${esc(t.album||t.artist||'LAMOU')}</p></div></div><div class="rank-platforms">${rows}</div></article>`;
}

function renderLoading(){
  root().innerHTML='<main class="dash"><section class="dash-hero"><div><span class="eyebrow">LAMOU</span><h1>Spotify + Rankings</h1><p>Carregando seus dados e verificando os rankings…</p></div><div class="sync-badge blue">Atualizando</div></section></main>';
}

function render(){
  const artist=profile?.artist||{};
  const stats=artist.stats||{};
  const tracks=dashboard?.tracks||[];
  const spotifyReady=!!(artist.url&&artist.stats);
  const lastChecks=tracks.flatMap(t=>t.platforms||[]).map(s=>s.last_checked_at).filter(Boolean).sort();
  const checkedAt=lastChecks.at(-1)||lastRefresh;

  root().innerHTML=`<main class="dash">
    <section class="dash-hero">
      <div class="artist-summary">
        <div class="artist-photo">${artist.image?`<img src="${esc(artist.image)}" alt="">`:'♫'}</div>
        <div><span class="eyebrow">PAINEL LAMOU</span><h1>${esc(artist.name||'LAMOU')}</h1><p>${spotifyReady?'Dados oficiais do catálogo Spotify.':'Conecte o Spotify uma vez; depois o painel atualiza sozinho.'}</p></div>
      </div>
      <div class="sync-badge ${verifying?'blue':'green'}">${verifying?'Atualizando…':checkedAt?`Atualizado ${time(checkedAt)}`:'Automático'}</div>
    </section>

    ${spotifyReady?`<section class="dash-metrics">${metric(stats.albums,'Álbuns')}${metric(stats.tracks,'Músicas')}${metric(stats.followers,'Seguidores')}${metric(stats.releases,'Lançamentos')}</section>`:`<section class="spotify-connect"><div><b>Spotify ainda não conectado</b><p>Essa é a única conexão necessária para os números do catálogo.</p></div><a class="primary-button" href="/api/oauth/spotify/start">Conectar Spotify</a></section>`}

    <p class="api-note">O Spotify não fornece streams totais nem ouvintes mensais pela Web API pública; por isso o app não inventa esses números.</p>

    <section class="ranking-head"><div><span class="eyebrow">RANKINGS</span><h2>Suas músicas</h2><p>O servidor verifica as plataformas automaticamente ao abrir o app e também de hora em hora.</p></div></section>

    <section class="ranking-list">${tracks.length?tracks.map(trackCard).join(''):'<div class="rank-empty large">Ainda não há faixas acompanhadas no banco de submissões.</div>'}</section>
  </main>`;
}

async function load({verify=true}={}){
  renderLoading();
  if(!await ensureSession()){
    root().innerHTML='<main class="dash"><div class="rank-empty large">Não foi possível iniciar a sessão do aplicativo.</div></main>';return;
  }
  const [p,d]=await Promise.all([api('/api/profile/summary?artist=LAMOU'),api('/api/submissions/dashboard')]);
  if(p.ok)profile=p.data;
  if(d.ok)dashboard=d.data;
  lastRefresh=new Date().toISOString();
  render();
  if(verify)verifyInBackground();
}

async function verifyInBackground(){
  if(verifying)return;
  verifying=true;render();
  const r=await api('/api/submissions/verify',{method:'POST',body:'{}'});
  verifying=false;
  if(r.ok){
    const d=await api('/api/submissions/dashboard');
    if(d.ok)dashboard=d.data;
    lastRefresh=new Date().toISOString();
  }
  render();
}

document.querySelector('.brand-button')?.addEventListener('click',()=>load({verify:true}));
window.addEventListener('focus',()=>{if(document.visibilityState==='visible'&&Date.now()-new Date(lastRefresh||0).getTime()>120000)load({verify:true})});
setInterval(()=>verifyInBackground(),5*60*1000);
load({verify:true});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
