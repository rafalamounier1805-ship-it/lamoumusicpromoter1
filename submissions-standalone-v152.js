(() => {
'use strict';

const VERSION='15.2.1';
const PENDING_KEY='lamou_submission_pending';
let cache=null;
let verifying=false;
let profileCache=null;
let currentUser=null;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=()=>document.getElementById('appRoot');
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
function savePending(ctx){try{sessionStorage.setItem(PENDING_KEY,JSON.stringify(ctx))}catch(_){}}
function readPending(){try{return JSON.parse(sessionStorage.getItem(PENDING_KEY)||'null')}catch(_){return null}}
function clearPending(){try{sessionStorage.removeItem(PENDING_KEY)}catch(_){}}

async function ensureSession(){
  let me=await api('/api/auth/me');
  if(me.ok){currentUser=me.data?.user||null;return true}
  let dv=localStorage.getItem('lamou_device_id');
  if(!dv){dv=(crypto.randomUUID?crypto.randomUUID():'dev-'+Date.now())+'-'+Date.now();localStorage.setItem('lamou_device_id',dv)}
  const made=await api('/api/session/device',{method:'POST',body:JSON.stringify({deviceId:dv})});
  if(!made.ok)return false;
  me=await api('/api/auth/me');
  currentUser=me.ok?(me.data?.user||null):null;
  return true;
}

function stageButton(track,p,s,key,stage,title,url){
  const status=s[key]||'red';
  const canOpen=status==='red'||status==='blue';
  return `<button class="sub-stage ${color(status)}" ${canOpen?`onclick="LamouSub.openStage('${esc(track.id)}','${esc(p.id)}','${esc(stage)}','${esc(url)}')"`:''}><span class="sub-dot"></span><b>${esc(title)}</b><small>${esc(label(status))}</small></button>`;
}
function platformRow(track,s){
  const p=s.platform;
  return `<div class="sub-platform-row"><div class="sub-platform-name"><b>${esc(p.name)}</b><small>${esc(s.note||'')}</small></div><div class="sub-stages">${stageButton(track,p,s,'registration_status','registration','Registro',p.registerUrl)}${stageButton(track,p,s,'form_status','form','Formulário',p.formUrl)}${stageButton(track,p,s,'ranking_status','ranking','Final Ranking',p.rankingUrl)}</div><div class="sub-check"><small>${s.last_checked_at?'Verificado '+new Date(s.last_checked_at).toLocaleString('pt-BR'):'Ainda não verificado'}</small><button class="ghost-button" onclick="LamouSub.verify('${esc(track.id)}')">↻</button></div></div>`;
}
function trackCard(t){
  const green=t.platforms?.filter(s=>s.ranking_status==='green').length||0;
  const blue=t.platforms?.filter(s=>s.form_status==='blue'||s.ranking_status==='blue').length||0;
  return `<button class="sub-track-card" onclick="LamouSub.openTrack('${esc(t.id)}')"><div class="sub-cover">${t.cover?`<img src="${esc(t.cover)}" alt="">`:'♫'}</div><div><b>${esc(t.title)}</b><small>${esc(t.artist||'LAMOU')}${t.album?` · ${esc(t.album)}`:''}</small></div><div class="sub-track-meta"><span class="status ${green?'green':blue?'blue':'red'}">${green?`${green} ranking`:blue?'Em andamento':'Pendente'}</span></div></button>`;
}
function metric(v,name,sub=''){return `<div class="sub-metric"><b>${v??'—'}</b><small>${esc(name)}</small>${sub?`<em>${esc(sub)}</em>`:''}</div>`}

async function loadProfile(){
  try{
    const r=await api('/api/profile/summary?artist=LAMOU');
    if(r.ok)profileCache=r.data?.artist||null;
  }catch(_){}
  return profileCache;
}
function setHeader(){
  const name=currentUser?.displayName||currentUser?.username||'LAMOU';
  const el=document.getElementById('headerUser');if(el)el.textContent=name==='LAMOU'?'LAMOU':name;
}

async function render(){
  const r=root();if(!r)return;
  r.innerHTML='<section class="sub-page"><div class="sub-head"><div><div class="eyebrow">LAMOU · SUBMISSÕES</div><h1>Ranking automático</h1><p>Carregando dados reais…</p></div></div></section>';
  const ok=await ensureSession();setHeader();
  if(!ok){r.innerHTML='<section class="card"><h2>Não foi possível iniciar a sessão</h2><p class="sub">Atualize a página e tente novamente.</p></section>';return}
  const res=await api('/api/submissions/dashboard');
  if(!res.ok){r.innerHTML=`<section class="card"><h2>Submissões</h2><p class="sub">${esc(res.data?.error||'Não foi possível carregar o painel.')}</p><button class="primary-button" onclick="LamouSub.render()">Tentar novamente</button></section>`;return}
  cache=res.data;await loadProfile();
  const st=profileCache?.stats||{};
  const tracks=cache.tracks||[];
  const albums=st.albums??'—';
  const songs=st.tracks??'—';
  const views=st.views??st.streams??'—';
  const monthly=st.monthlyViews??st.monthlyListeners??'—';
  r.innerHTML=`<section class="sub-page"><div class="sub-head"><div><div class="eyebrow">LAMOU · SUBMISSÕES</div><h1>Ranking automático</h1><p>Somente submissão. O app verifica as plataformas e atualiza as etapas.</p></div><button class="primary-button" onclick="LamouSub.verify()" ${verifying?'disabled':''}>${verifying?'Verificando…':'↻ Verificar agora'}</button></div><div class="sub-metrics">${metric(albums,'Álbuns',albums==='—'?'aguardando fonte oficial':'Spotify')}${metric(songs,'Músicas',songs==='—'?'aguardando fonte oficial':'Spotify')}${metric(views,'Visualizações gerais',views==='—'?'não disponível publicamente':'fonte oficial')}${metric(monthly,'Visualizações mensais',monthly==='—'?'não disponível publicamente':'fonte oficial')}</div><div class="sub-section-head"><div><h2>Faixas submetidas</h2><p class="sub">Toque na faixa para ver as plataformas e as etapas.</p></div></div><div class="sub-track-grid">${tracks.map(trackCard).join('')}<button class="sub-track-card new" onclick="LamouSub.newTrack()"><div class="sub-cover">＋</div><div><b>Nova faixa para submeter</b><small>Adicionar pelo link do Spotify</small></div></button></div></section>`;
}

function openTrack(id){
  const t=cache?.tracks?.find(x=>x.id===id);if(!t)return;
  modal(`<div class="modal-head"><div><div class="eyebrow">FAIXA SUBMETIDA</div><h2>${esc(t.title)}</h2><p class="sub">${esc(t.artist||'LAMOU')}${t.album?` · ${esc(t.album)}`:''}</p></div><button class="icon-button" onclick="LamouSub.close()">×</button></div><div class="sub-platform-list">${(t.platforms||[]).map(s=>platformRow(t,s)).join('')}</div>${t.spotify_url?`<div class="row" style="margin-top:14px"><a class="ghost-button" href="${esc(t.spotify_url)}" target="_blank" rel="noopener">Spotify ↗</a></div>`:''}`);
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
  const ctx={trackId,platformId,stage,openedAt:Date.now()};
  savePending(ctx);
  const marked=await api('/api/submissions/opened',{method:'POST',body:JSON.stringify({trackId,platformId,stage})});
  if(!marked.ok){clearPending();toast(marked.data?.error||'Não foi possível registrar a etapa.');return}
  window.location.assign(url);
}

async function resumePending(){
  const ctx=readPending();
  if(!ctx?.trackId)return;
  if(Date.now()-Number(ctx.openedAt||0)>21600000){clearPending();return}
  clearPending();
  setTimeout(()=>verify(ctx.trackId),650);
}

function newTrack(){
  modal(`<div class="modal-head"><div><div class="eyebrow">NOVA FAIXA</div><h2>Adicionar para submissão</h2></div><button class="icon-button" onclick="LamouSub.close()">×</button></div><div class="field"><label>Link da faixa no Spotify</label><input id="subSpotifyUrl" type="url" placeholder="https://open.spotify.com/track/..."></div><div class="row"><button class="primary-button" onclick="LamouSub.importSpotify()">Buscar e adicionar</button><a class="ghost-button" href="/api/oauth/spotify/start">Conectar Spotify</a></div><div id="subImportNote" class="mini" style="margin-top:10px"></div>`);
}

async function importSpotify(){
  const u=document.getElementById('subSpotifyUrl')?.value.trim();if(!u)return toast('Cole o link do Spotify.');
  const note=document.getElementById('subImportNote');if(note)note.textContent='Buscando metadados oficiais…';
  const sr=await api('/api/spotify/track?url='+encodeURIComponent(u));
  if(!sr.ok){if(note)note.innerHTML=`${esc(sr.data?.error||'Não foi possível buscar a faixa.')} ${sr.status===409||sr.status===401?'<br><a class="ghost-button" style="display:inline-block;margin-top:10px" href="/api/oauth/spotify/start">Conectar Spotify</a>':''}`;return}
  const t=sr.data.track;
  const res=await api('/api/submissions/tracks',{method:'POST',body:JSON.stringify({title:t.title,artist:t.artist||'LAMOU',spotifyUrl:t.url||u,spotifyId:t.id,album:t.album,cover:t.cover})});
  if(!res.ok){if(note)note.textContent=res.data?.error||'Falha ao adicionar.';return}
  close();toast('Faixa adicionada.');await render();
}

function bind(){
  document.getElementById('lamouMenuBtn')?.addEventListener('click',()=>verify());
  document.querySelector('.brand-button')?.addEventListener('click',()=>render());
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resumePending()});
  window.addEventListener('pageshow',()=>resumePending());
}

window.LamouSub={render,openTrack,verify,openStage,newTrack,importSpotify,close,version:VERSION};
bind();
render().then(()=>resumePending());
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
