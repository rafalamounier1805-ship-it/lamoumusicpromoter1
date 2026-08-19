(() => {
'use strict';

const VERSION='15.1.0';
let cache=null;
let verifying=false;
let openedContext=null;
let profileCache=null;
let renderTimer=null;
let rendering=false;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=()=>document.getElementById('appRoot');
const shell=()=>document.getElementById('appShell');
const toast=m=>{const e=document.getElementById('toast');if(!e)return;e.textContent=m;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),3600)};

async function api(path,options={}){
  try{
    const r=await fetch(path,{credentials:'include',cache:'no-store',...options,headers:{...(options.body?{'content-type':'application/json'}:{}),...(options.headers||{})}});
    let d={};try{d=await r.json()}catch(_){}
    return {ok:r.ok,status:r.status,data:d};
  }catch(_){return {ok:false,status:0,data:{error:'Sem resposta do servidor.'}}}
}

function modal(h){document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)LamouSub.close()"><section class="modal">${h}</section></div>`}
function close(){document.getElementById('modalRoot').innerHTML=''}
function color(s){return s==='green'?'green':s==='blue'?'blue':'red'}
function label(s){return s==='green'?'Concluído':s==='blue'?'Em andamento':'Pendente'}
function reveal(){const r=root();if(r)r.style.visibility='visible';document.getElementById('bottomNav')?.classList.add('hidden');document.body.dataset.lamouMode='submissions-only'}

function stageButton(track,p,s,key,title,url){
  const status=s[key]||'red';
  const canOpen=status==='red'||status==='blue';
  return `<button class="sub-stage ${color(status)}" ${canOpen?`onclick="LamouSub.openStage('${esc(track.id)}','${esc(p.id)}','${esc(key)}','${esc(url)}')"`:''} title="${esc(title)}"><span class="sub-dot"></span><b>${esc(title)}</b><small>${esc(label(status))}</small></button>`;
}

function platformRow(track,s){
  const p=s.platform;
  return `<div class="sub-platform-row"><div class="sub-platform-name"><b>${esc(p.name)}</b><small>${esc(s.note||'')}</small></div><div class="sub-stages">${stageButton(track,p,s,'registration_status','Registro',p.registerUrl)}${stageButton(track,p,s,'form_status','Formulário',p.formUrl)}${stageButton(track,p,s,'ranking_status','Final Ranking',p.rankingUrl)}</div><div class="sub-check"><small>${s.last_checked_at?'Verificado '+new Date(s.last_checked_at).toLocaleString('pt-BR'):'Ainda não verificado'}</small><button class="ghost-button" onclick="LamouSub.verify('${esc(track.id)}')">↻</button></div></div>`;
}

function trackCard(t){
  const active=t.platforms?.some(s=>s.form_status!=='red'||s.ranking_status!=='red');
  const green=t.platforms?.filter(s=>s.ranking_status==='green').length||0;
  const blue=t.platforms?.filter(s=>s.form_status==='blue'||s.ranking_status==='blue').length||0;
  return `<button class="sub-track-card" onclick="LamouSub.openTrack('${esc(t.id)}')"><div class="sub-cover">${t.cover?`<img src="${esc(t.cover)}" alt="">`:'♫'}</div><div><b>${esc(t.title)}</b><small>${esc(t.artist||'LAMOU')}${t.album?` · ${esc(t.album)}`:''}</small></div><div class="sub-track-meta"><span class="status ${green?'green':blue?'blue':active?'blue':'red'}">${green?`${green} ranking`:blue?'Em andamento':'Pendente'}</span></div></button>`;
}

async function loadProfile(){
  try{
    const r=await fetch('/api/profile/summary?artist=LAMOU',{credentials:'include',cache:'no-store'});
    if(r.ok){const x=await r.json();profileCache=x.artist||null}
  }catch(_){}
  return profileCache;
}

function metric(v,name,sub=''){return `<div class="sub-metric"><b>${v??'—'}</b><small>${esc(name)}</small>${sub?`<em>${esc(sub)}</em>`:''}</div>`}

async function render(){
  if(rendering)return;
  const r=root();if(!r)return;
  rendering=true;
  r.style.visibility='hidden';
  document.getElementById('bottomNav')?.classList.add('hidden');
  try{
    const res=await api('/api/submissions/dashboard');
    if(!res.ok){
      r.innerHTML=`<section class="card sub-page"><div class="eyebrow">LAMOU · SUBMISSÕES</div><h2>Submissões</h2><p class="sub">${esc(res.data?.error||'Não foi possível carregar o painel.')}</p><button class="primary-button" onclick="LamouSub.render()">Tentar novamente</button></section>`;
      reveal();return;
    }
    cache=res.data;
    await loadProfile();
    const st=profileCache?.stats||{};
    const tracks=cache.tracks||[];
    const albums=st.albums??'—';
    const songs=st.tracks??'—';
    const views=st.views??st.streams??'—';
    const monthly=st.monthlyViews??st.monthlyListeners??'—';
    r.innerHTML=`<section class="sub-page"><div class="sub-head"><div><div class="eyebrow">LAMOU · SUBMISSÕES</div><h1>Ranking automático</h1><p>Somente submissão. Sem campanha, divulgação ou criativos.</p></div><button class="primary-button" onclick="LamouSub.verify()" ${verifying?'disabled':''}>${verifying?'Verificando…':'↻ Verificar agora'}</button></div><div class="sub-metrics">${metric(albums,'Álbuns',albums==='—'?'aguardando fonte oficial':'Spotify')}${metric(songs,'Músicas publicadas',songs==='—'?'aguardando fonte oficial':'Spotify')}${metric(views,'Visualizações gerais',views==='—'?'não disponível publicamente':'fonte oficial')}${metric(monthly,'Visualizações mensais',monthly==='—'?'não disponível publicamente':'fonte oficial')}</div><div class="sub-section-head"><div><h2>Faixas submetidas</h2><p class="sub">Clique na faixa para ver plataforma, Registro, Formulário e Final Ranking.</p></div></div><div class="sub-track-grid">${tracks.map(trackCard).join('')}<button class="sub-track-card new" onclick="LamouSub.newTrack()"><div class="sub-cover">＋</div><div><b>Nova faixa para submeter</b><small>Adicionar pelo link do Spotify</small></div></button></div></section>`;
    reveal();
  }finally{rendering=false}
}

function openTrack(id){
  const t=cache?.tracks?.find(x=>x.id===id);if(!t)return;
  modal(`<div class="modal-head"><div><div class="eyebrow">FAIXA SUBMETIDA</div><h2>${esc(t.title)}</h2><p class="sub">${esc(t.artist||'LAMOU')}${t.album?` · ${esc(t.album)}`:''}</p></div><button class="icon-button" onclick="LamouSub.close()">×</button></div><div class="sub-platform-list">${(t.platforms||[]).map(s=>platformRow(t,s)).join('')}</div><div class="row" style="margin-top:14px"><button class="primary-button" onclick="LamouSub.verify('${esc(t.id)}')">↻ Verificar esta faixa</button>${t.spotify_url?`<a class="ghost-button" href="${esc(t.spotify_url)}" target="_blank" rel="noopener">Spotify ↗</a>`:''}</div>`);
}

async function verify(trackId=''){
  if(verifying)return;
  verifying=true;toast('Verificando plataformas…');
  const res=await api('/api/submissions/verify',{method:'POST',body:JSON.stringify(trackId?{trackId}:{})});
  verifying=false;
  if(!res.ok){toast(res.data?.error||'Falha na verificação.');return}
  toast(`✓ ${res.data.checked||0} verificações concluídas`);
  await render();if(trackId)openTrack(trackId);
}

async function openStage(trackId,platformId,stage,url){
  openedContext={trackId,platformId,stage,openedAt:Date.now()};
  await api('/api/submissions/opened',{method:'POST',body:JSON.stringify({trackId,platformId,stage})});
  window.open(url,'_blank','noopener');
}

function newTrack(){
  modal(`<div class="modal-head"><div><div class="eyebrow">NOVA FAIXA</div><h2>Adicionar para submissão</h2></div><button class="icon-button" onclick="LamouSub.close()">×</button></div><div class="field"><label>Link da faixa no Spotify</label><input id="subSpotifyUrl" type="url" placeholder="https://open.spotify.com/track/..."></div><div class="row"><button class="primary-button" onclick="LamouSub.importSpotify()">Buscar e adicionar</button></div><div id="subImportNote" class="mini" style="margin-top:10px"></div>`);
}

async function importSpotify(){
  const u=document.getElementById('subSpotifyUrl')?.value.trim();if(!u)return toast('Cole o link do Spotify.');
  const note=document.getElementById('subImportNote');if(note)note.textContent='Buscando metadados oficiais…';
  const sr=await api('/api/spotify/track?url='+encodeURIComponent(u));
  if(!sr.ok){if(note)note.textContent=sr.data?.error||'Não foi possível buscar a faixa.';return}
  const t=sr.data.track;
  const res=await api('/api/submissions/tracks',{method:'POST',body:JSON.stringify({title:t.title,artist:t.artist||'LAMOU',spotifyUrl:t.url||u,spotifyId:t.id,album:t.album,cover:t.cover})});
  if(!res.ok){if(note)note.textContent=res.data?.error||'Falha ao adicionar.';return}
  close();toast('Faixa adicionada.');await render();
}

function scheduleRender(){
  clearTimeout(renderTimer);
  renderTimer=setTimeout(()=>{
    const r=root(),s=shell();
    if(!r||!s||s.classList.contains('hidden'))return;
    if(!r.querySelector('.sub-page'))render();
  },35);
}

function patchLegacy(){
  if(!window.Lamou||!root())return false;
  window.Lamou.go=()=>render();
  if(window.Lamou.startMode)window.Lamou.startMode=()=>render();
  document.getElementById('bottomNav')?.classList.add('hidden');
  const menu=document.getElementById('lamouMenuBtn');if(menu)menu.textContent='Verificar';
  return true;
}

function bootPatch(){
  if(!patchLegacy())return setTimeout(bootPatch,60);
  [20,180,650,1500,3000].forEach(ms=>setTimeout(()=>render(),ms));
}

document.addEventListener('click',e=>{
  const menu=e.target.closest('#lamouMenuBtn');
  if(menu){e.preventDefault();e.stopImmediatePropagation();verify();return}
  const brand=e.target.closest('.brand-button');
  if(brand){e.preventDefault();e.stopImmediatePropagation();render();return}
  const nav=e.target.closest('#bottomNav button');
  if(nav){e.preventDefault();e.stopImmediatePropagation();render()}
},true);

const observer=new MutationObserver(()=>{
  const r=root();if(!r)return;
  if(r.querySelector('.sub-page'))return;
  if(shell()&&!shell().classList.contains('hidden')){
    r.style.visibility='hidden';
    scheduleRender();
  }
});
observer.observe(document.documentElement,{subtree:true,childList:true});

document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'&&openedContext){const ctx=openedContext;openedContext=null;setTimeout(()=>verify(ctx.trackId),450)}
});
window.addEventListener('focus',()=>{
  if(openedContext){const ctx=openedContext;openedContext=null;setTimeout(()=>verify(ctx.trackId),450)}
});

window.LamouSub={render,openTrack,verify,openStage,newTrack,importSpotify,close,version:VERSION};
bootPatch();
})();
