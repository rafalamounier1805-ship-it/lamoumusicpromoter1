/* LAMOU Music Promoter — UX v6.3
   Simplicity-first shell:
   User -> New music -> History -> Test -> Logout.
   Results are contextual to the selected project/campaign.
   Hosting is infrastructure and stays out of the daily-use navigation.
*/
(() => {
  'use strict';

  const VERSION = '6.3.0';
  const USERS_KEY = 'lamou_users_v6';
  const ACTIVE_USER_KEY = 'lamou_active_user_v6';
  const ACTIVE_PROJECT_KEY = 'lamou_active_project_v6';
  const PROJECT_PREFIX = 'lamou_project_v6_';
  const TEST_HISTORY_KEY = 'lamou_test_history_v63';
  const REMEMBER_KEY = 'lamou_access_remember';
  const ACCESS_KEY = 'lamou_access';
  const CLIENT_KEY = 'lamou_spotify_client_id';
  const SPOTIFY_CLIENT_ID = '8a9c328f33b14bad9b48473d238925fc';
  const AI_ENDPOINT = '/api/ai';
  const LAMOU_ID = '31i5b3kg7i6mlhfgbvsc53ab6rlm';
  const LAMOU_PROFILE = 'https://open.spotify.com/user/31i5b3kg7i6mlhfgbvsc53ab6rlm';

  const load = (k,f) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):f; } catch(_) { return f; } };
  const save = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch(_) {} };
  const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const projectKey = (uid,pid) => `${PROJECT_PREFIX}${uid}_${pid}`;
  const freshState = () => ({url:'',title:'',cover:'',hooks:[],hook:null,duration:0,audioUrl:'',creativeMode:'image',creativeFormat:'1:1',creativeImageUrl:'',creativeVideoUrl:'',creativeImageSource:'',creativeVideoName:'',syncHook:true,quick:['Instagram','TikTok','YouTube Shorts'],camp:['Instagram','TikTok'],langs:['Português'],markets:['Brasil'],selected:[],history:[]});

  function users(){ return load(USERS_KEY,[]); }
  function activeUser(){ const id=localStorage.getItem(ACTIVE_USER_KEY)||''; return users().find(u=>u.id===id)||null; }

  function ensureLamou(){
    let list=users();
    let u=list.find(x=>String(x.name||'').trim().toUpperCase()==='LAMOU');
    if(!u){u={id:'user_lamou_primary',name:'LAMOU',spotifyUserId:LAMOU_ID,spotifyProfile:LAMOU_PROFILE,createdAt:new Date().toISOString(),projects:[]};list.unshift(u)}
    u.spotifyUserId=LAMOU_ID;u.spotifyProfile=LAMOU_PROFILE;save(USERS_KEY,list);
    if(!localStorage.getItem(ACTIVE_USER_KEY)) localStorage.setItem(ACTIVE_USER_KEY,u.id);
    return u;
  }

  function ensureActiveProject(){
    const u=activeUser()||ensureLamou();
    let pid=localStorage.getItem(ACTIVE_PROJECT_KEY)||'';
    if(pid && (u.projects||[]).some(p=>p.id===pid)) return pid;
    if((u.projects||[]).length){pid=u.projects[0].id;localStorage.setItem(ACTIVE_PROJECT_KEY,pid);return pid}
    return createBlankProject(false);
  }

  function createBlankProject(showToast=true){
    const u=activeUser()||ensureLamou();
    const list=users(),i=list.findIndex(x=>x.id===u.id);
    const p={id:'project_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,6),name:'Nova música',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    list[i].projects=[...(list[i].projects||[]),p];save(USERS_KEY,list);localStorage.setItem(ACTIVE_PROJECT_KEY,p.id);
    save(projectKey(u.id,p.id),freshState());save('lamou',freshState());
    if(typeof window.S==='object') Object.assign(window.S||{},freshState());
    if(showToast) toast('Nova música criada.');
    setTimeout(()=>location.reload(),80);
    return p.id;
  }

  function hideLegacyClutter(){
    const oldManager=document.getElementById('lamouManager'); if(oldManager) oldManager.style.display='none';
    const hosting=document.getElementById('hosting'); if(hosting) hosting.style.display='none';
    const analytics=document.getElementById('analytics'); if(analytics) analytics.style.display='none';
    const autoCards=[...document.querySelectorAll('section.card')].filter(x=>x.textContent.includes('O que é automático hoje?'));
    autoCards.forEach(x=>x.style.display='none');
  }

  function buildHeader(){
    const top=document.querySelector('.top'); if(!top) return;
    let row=top.querySelector('.row'); if(!row){row=document.createElement('div');row.className='row';top.appendChild(row)}
    row.innerHTML='';
    const u=activeUser()||ensureLamou();
    const user=document.createElement('button');user.className='lamou-user-chip';user.innerHTML=`👤 <b>${esc(u.name)}</b>`;user.title='Perfil ativo';
    const newMusic=document.createElement('button');newMusic.className='lamou-primary';newMusic.textContent='＋ Nova música';newMusic.onclick=()=>createBlankProject(true);
    const hist=document.createElement('button');hist.textContent='🕘 Histórico';hist.onclick=openHistory;
    const test=document.createElement('button');test.textContent='🧪 Teste';test.onclick=openTest;
    const logout=document.createElement('button');logout.textContent='Sair';logout.onclick=logoutUser;
    row.append(user,newMusic,hist,test,logout);
  }

  function logoutUser(){
    if(!confirm('Sair deste usuário neste aparelho?')) return;
    try{localStorage.removeItem(REMEMBER_KEY);localStorage.removeItem(ACCESS_KEY);sessionStorage.removeItem(ACCESS_KEY);sessionStorage.removeItem('lamou_access')}catch(_){}
    location.reload();
  }

  function addStyles(){
    if(document.getElementById('lamouV63Styles')) return;
    const s=document.createElement('style');s.id='lamouV63Styles';s.textContent=`
      .top .row{gap:7px;flex-wrap:wrap}.top .row button{white-space:nowrap}.top .row .lamou-primary{background:#5c5ff2;color:#fff;border-color:#5c5ff2}.lamou-user-chip{background:#f4f5fb!important;border-color:#dfe2ed!important}
      .lamou-modal{position:fixed;inset:0;z-index:22000;background:#0b1020aa;backdrop-filter:blur(5px);display:none;place-items:center;padding:15px}.lamou-modal.on{display:grid}.lamou-sheet{width:min(860px,100%);max-height:90vh;overflow:auto;background:#fff;color:#172033;border-radius:22px;padding:20px;box-shadow:0 28px 90px #0006}.lamou-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;border-bottom:1px solid #e5e8ef;padding-bottom:12px}.lamou-head h2{margin:0}.lamou-head p{margin:4px 0 0;color:#6b7280}.lamou-x{border:0;background:#f1f3f7;border-radius:50%;width:38px;height:38px;font-size:21px}.lamou-actions{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.lamou-list{display:grid;gap:8px}.lamou-item{border:1px solid #e4e7ef;border-radius:13px;padding:12px;background:#fff;cursor:pointer;text-align:left}.lamou-item:hover{background:#f8f9ff}.lamou-item b,.lamou-item small{display:block}.lamou-item small{color:#687080;margin-top:3px}.lamou-result-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0}.lamou-stat{border:1px solid #e5e7ee;border-radius:12px;padding:11px;background:#fafbff}.lamou-stat b,.lamou-stat small{display:block}.lamou-stat b{font-size:1.25rem}.lamou-empty{padding:16px;border-radius:13px;background:#f7f8fb;color:#687080}.lamou-test-row{display:grid;grid-template-columns:26px 1fr;gap:8px;border:1px solid #e5e7ee;border-radius:10px;padding:8px;margin-bottom:6px}.lamou-test-row small{display:block;color:#687080}.lamou-ok{color:#167049}.lamou-warn{color:#946700}.lamou-fail{color:#a22}.lamou-test-history{border-top:1px solid #e5e7ee;margin-top:14px;padding-top:12px}
      @media(max-width:650px){.top{align-items:flex-start}.top .row{width:100%}.top .row button{flex:1 1 auto}.lamou-result-grid{grid-template-columns:1fr 1fr}.lamou-sheet{padding:15px}}
    `;document.head.appendChild(s);
  }

  function modal(id,title,subtitle){
    let m=document.getElementById(id);if(m)return m;
    m=document.createElement('div');m.id=id;m.className='lamou-modal';m.innerHTML=`<div class="lamou-sheet"><div class="lamou-head"><div><h2>${title}</h2><p>${subtitle}</p></div><button class="lamou-x" data-close>×</button></div><div data-body></div></div>`;document.body.appendChild(m);m.querySelector('[data-close]').onclick=()=>m.classList.remove('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};return m;
  }

  function openHistory(){
    const m=modal('lamouHistoryModal','🕘 Histórico','Selecione uma música/campanha para ver o resultado daquele trabalho.');
    const body=m.querySelector('[data-body]');const u=activeUser()||ensureLamou();const ps=[...(u.projects||[])].sort((a,b)=>String(b.updatedAt||b.createdAt).localeCompare(String(a.updatedAt||a.createdAt)));
    body.innerHTML=ps.length?`<div class="lamou-list" style="margin-top:14px">${ps.map((p,i)=>{const d=load(projectKey(u.id,p.id),freshState());const actions=(d.history||[]).length;return `<button class="lamou-item" data-pid="${esc(p.id)}"><b>${i+1}. ${esc(p.name||'Nova música')}</b><small>${actions} ação(ões) registradas • ${new Date(p.updatedAt||p.createdAt).toLocaleString('pt-BR')}</small></button>`}).join('')}</div>`:`<div class="lamou-empty" style="margin-top:14px">Ainda não há trabalhos no histórico.</div>`;
    body.querySelectorAll('[data-pid]').forEach(b=>b.onclick=()=>showProjectResult(b.dataset.pid));m.classList.add('on');
  }

  function showProjectResult(pid){
    const u=activeUser()||ensureLamou();const p=(u.projects||[]).find(x=>x.id===pid);if(!p)return;const d=load(projectKey(u.id,pid),freshState());const h=d.history||[];
    const actions=h.length,channels=new Set(h.map(x=>x.channel).filter(Boolean)).size,campaigns=h.filter(x=>String(x.action||'').includes('Campanha')).length,selected=(d.selected||[]).length;
    const m=modal('lamouResultModal','📊 Resultado do trabalho','Resultado contextual da música/campanha selecionada.');const body=m.querySelector('[data-body]');
    body.innerHTML=`<div style="margin-top:14px"><h3>${esc(p.name||d.title||'Nova música')}</h3><div class="lamou-result-grid"><div class="lamou-stat"><b>${actions}</b><small>Ações</small></div><div class="lamou-stat"><b>${channels}</b><small>Canais usados</small></div><div class="lamou-stat"><b>${campaigns}</b><small>Campanhas</small></div><div class="lamou-stat"><b>${selected}</b><small>Canais selecionados</small></div></div>${h.length?`<div class="lamou-list">${h.slice(0,30).map(x=>`<div class="lamou-item" style="cursor:default"><b>${esc(x.action||'Ação')}</b><small>${esc(x.channel||'')} • ${new Date(x.date).toLocaleString('pt-BR')}</small></div>`).join('')}</div>`:`<div class="lamou-empty">Este trabalho ainda não tem resultados registrados.</div>`}<div class="lamou-actions"><button class="btn p" id="lamouOpenProject">Abrir este trabalho</button><button class="btn" id="lamouCloseResult">Fechar</button></div></div>`;
    document.getElementById('lamouOpenProject').onclick=()=>{localStorage.setItem(ACTIVE_PROJECT_KEY,pid);save('lamou',d);location.reload()};document.getElementById('lamouCloseResult').onclick=()=>m.classList.remove('on');m.classList.add('on');
  }

  async function aiHealth(){try{const r=await fetch(AI_ENDPOINT+'/health',{cache:'no-store'});return{online:r.ok,status:r.status}}catch(_){return{online:false}}}
  async function runTest(){
    const out=document.getElementById('lamouTestOut'),btn=document.getElementById('lamouRunTestNow');btn.disabled=true;btn.textContent='⏳ Testando…';out.innerHTML='<div class="lamou-empty">Executando diagnóstico…</div>';
    const r=[];const push=(n,s,d)=>r.push({name:n,status:s,detail:d});
    ['loadSpotify','analyseAudio','makeCopy','buildCampaign','filterChannels','tracked','renderHistory','createQuick'].forEach(fn=>push('Função '+fn,typeof window[fn]==='function'?'ok':'fail',typeof window[fn]==='function'?'carregada':'ausente'));
    try{const k='lamou_test_'+Date.now();localStorage.setItem(k,'1');const ok=localStorage.getItem(k)==='1';localStorage.removeItem(k);push('Armazenamento',ok?'ok':'fail',ok?'OK':'falhou')}catch(_){push('Armazenamento','fail','bloqueado')}
    push('Spotify',localStorage.getItem(CLIENT_KEY)===SPOTIFY_CLIENT_ID?'ok':'fail','configuração interna');push('Usuário ativo',activeUser()?'ok':'fail',activeUser()?.name||'ausente');push('Projeto ativo',localStorage.getItem(ACTIVE_PROJECT_KEY)?'ok':'fail',localStorage.getItem(ACTIVE_PROJECT_KEY)?'definido':'ausente');push('Áudio',(window.AudioContext||window.webkitAudioContext)?'ok':'fail','suporte do navegador');
    try{const res=await fetch(location.href,{cache:'no-store'});push('Servidor',res.ok?'ok':'fail','HTTP '+res.status)}catch(_){push('Servidor','fail','sem resposta')}
    const ai=await aiHealth();push('Workers AI',ai.online?'ok':'warn',ai.online?'online':'backend ainda não respondeu');
    const fails=r.filter(x=>x.status==='fail').length,warns=r.filter(x=>x.status==='warn').length,overall=fails?'fail':warns?'warn':'ok',diag={date:new Date().toISOString(),overall,fails,warns,results:r,version:VERSION};let hist=load(TEST_HISTORY_KEY,[]);hist.unshift(diag);save(TEST_HISTORY_KEY,hist.slice(0,20));window.__lamouLastTest=diag;
    out.innerHTML=`<div class="lamou-empty"><b class="lamou-${overall}">${overall==='ok'?'✅ Tudo funcionando':overall==='warn'?'⚠️ Essencial OK, com avisos':'❌ Há falhas para revisar'}</b><br><small>${new Date(diag.date).toLocaleString('pt-BR')}</small></div><div style="margin-top:10px">${r.map(x=>`<div class="lamou-test-row"><b class="lamou-${x.status}">${x.status==='ok'?'✓':x.status==='warn'?'!':'×'}</b><div><b>${esc(x.name)}</b><small>${esc(x.detail)}</small></div></div>`).join('')}</div>`;btn.disabled=false;btn.textContent='▶ Rodar novo teste';renderTestHistory();
  }

  function renderTestHistory(){const el=document.getElementById('lamouTestHistory');if(!el)return;const h=load(TEST_HISTORY_KEY,[]);el.innerHTML=h.length?h.slice(0,8).map(x=>`<div class="lamou-item" style="cursor:default"><b class="lamou-${x.overall}">${x.overall==='ok'?'✅ OK':x.overall==='warn'?'⚠️ Aviso':'❌ Falha'}</b><small>${new Date(x.date).toLocaleString('pt-BR')} • v${esc(x.version||VERSION)}</small></div>`).join(''):'<div class="lamou-empty">Nenhum teste realizado ainda.</div>'}
  function testText(){const d=window.__lamouLastTest;if(!d)return'';return [`LAMOU Music Promoter v${d.version}`,`Teste: ${new Date(d.date).toLocaleString('pt-BR')}`,`Status: ${d.overall}`,'',...d.results.map(x=>`[${x.status.toUpperCase()}] ${x.name}: ${x.detail}`)].join('\n')}
  function saveTest(){const t=testText();if(!t)return toast('Rode um teste primeiro.');const b=new Blob([t],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='lamou-teste-'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),800)}
  function emailTest(){const t=testText();if(!t)return toast('Rode um teste primeiro.');location.href='mailto:?subject='+encodeURIComponent('Diagnóstico LAMOU Music Promoter')+'&body='+encodeURIComponent(t)}
  function openTest(){const m=modal('lamouTestModal','🧪 Teste do sistema','O diagnóstico abre aqui e não ocupa a tela principal.');const body=m.querySelector('[data-body]');body.innerHTML=`<div class="lamou-actions"><button class="btn p" id="lamouRunTestNow">▶ Rodar novo teste</button><button class="btn" id="lamouSaveTestNow">💾 Salvar resultado</button><button class="btn" id="lamouEmailTestNow">✉️ Mandar por e-mail</button></div><div id="lamouTestOut"><div class="lamou-empty">Pronto para testar.</div></div><div class="lamou-test-history"><h3>Últimos testes</h3><div id="lamouTestHistory"></div></div>`;document.getElementById('lamouRunTestNow').onclick=runTest;document.getElementById('lamouSaveTestNow').onclick=saveTest;document.getElementById('lamouEmailTestNow').onclick=emailTest;renderTestHistory();m.classList.add('on')}

  function prefillKnownProfile(){
    const u=activeUser()||ensureLamou();
    const input=document.getElementById('artistSpotifyUrl');if(input && u.spotifyProfile && !input.value) input.value=u.spotifyProfile;
    const config=document.getElementById('spotifyConfig');if(config)config.style.display='none';try{localStorage.setItem(CLIENT_KEY,SPOTIFY_CLIENT_ID)}catch(_){}
  }

  function toast(msg){if(typeof window.toast==='function')window.toast(msg);else console.log(msg)}

  function init(){ensureLamou();ensureActiveProject();addStyles();hideLegacyClutter();buildHeader();prefillKnownProfile();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,120));else setTimeout(init,120);
  window.addEventListener('load',()=>setTimeout(()=>{hideLegacyClutter();buildHeader();prefillKnownProfile()},180));
})();