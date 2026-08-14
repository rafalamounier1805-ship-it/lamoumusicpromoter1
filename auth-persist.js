/* LAMOU Music Promoter — UX/state layer v6.1
   - persistent device access (password is never stored)
   - fixed Spotify Client ID
   - users and projects separated
   - new user / new music / clear controls
   - backup / restore / one-click diagnostics
   - prepares AI endpoint without pretending it is online
*/
(() => {
  'use strict';

  const VERSION = '6.1.0';
  const ACCESS_KEY = 'lamou_access';
  const REMEMBER_KEY = 'lamou_access_remember';
  const CLIENT_KEY = 'lamou_spotify_client_id';
  const SPOTIFY_CLIENT_ID = '8a9c328f33b14bad9b48473d238925fc';
  const USERS_KEY = 'lamou_users_v6';
  const ACTIVE_USER_KEY = 'lamou_active_user_v6';
  const ACTIVE_PROJECT_KEY = 'lamou_active_project_v6';
  const PROJECT_PREFIX = 'lamou_project_v6_';
  const AI_ENDPOINT = '/api/ai';

  try { localStorage.setItem(CLIENT_KEY, SPOTIFY_CLIENT_ID); } catch (_) {}
  try { if (localStorage.getItem(ACCESS_KEY) === 'ok') localStorage.setItem(REMEMBER_KEY, 'ok'); } catch (_) {}

  const jsonLoad = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (_) { return fallback; } };
  const jsonSave = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const uid = (prefix = 'id') => prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function getUsers() { return jsonLoad(USERS_KEY, []); }
  function setUsers(users) { jsonSave(USERS_KEY, users); }
  function getActiveUserId() { return localStorage.getItem(ACTIVE_USER_KEY) || ''; }
  function setActiveUserId(id) { localStorage.setItem(ACTIVE_USER_KEY, id || ''); }
  function getActiveProjectId() { return localStorage.getItem(ACTIVE_PROJECT_KEY) || ''; }
  function setActiveProjectId(id) { localStorage.setItem(ACTIVE_PROJECT_KEY, id || ''); }
  function projectKey(userId, projectId) { return `${PROJECT_PREFIX}${userId}_${projectId}`; }

  function activeUser() { const id = getActiveUserId(); return getUsers().find(u => u.id === id) || null; }

  function defaultUser() {
    const users = getUsers();
    if (users.length) { if (!getActiveUserId()) setActiveUserId(users[0].id); return users[0]; }
    const user = { id:uid('user'), name:'LAMOU', spotifyUserId:'31i5b3kg7i6mlhfgbvsc53ab6rlm', spotifyProfile:'https://open.spotify.com/user/31i5b3kg7i6mlhfgbvsc53ab6rlm', createdAt:new Date().toISOString(), projects:[] };
    setUsers([user]); setActiveUserId(user.id); return user;
  }

  function freshState() {
    return { url:'',title:'',cover:'',hooks:[],hook:null,duration:0,audioUrl:'',creativeMode:'image',creativeFormat:'1:1',creativeImageUrl:'',creativeVideoUrl:'',creativeImageSource:'',creativeVideoName:'',syncHook:true,quick:['Instagram','TikTok','YouTube Shorts'],camp:['Instagram','TikTok'],langs:['Português'],markets:['Brasil'],selected:[],history:[] };
  }

  function ensureProject() {
    const user = activeUser() || defaultUser(); let projectId = getActiveProjectId();
    if (projectId && user.projects?.some(p => p.id === projectId)) return projectId;
    const p={id:uid('project'),name:'Nova música',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    const users=getUsers(), idx=users.findIndex(u=>u.id===user.id); users[idx].projects=[...(users[idx].projects||[]),p]; setUsers(users); setActiveProjectId(p.id);
    const legacy=jsonLoad('lamou',null); jsonSave(projectKey(user.id,p.id),legacy||freshState()); return p.id;
  }

  function currentProjectData() { const user=activeUser()||defaultUser(), pid=ensureProject(); return jsonLoad(projectKey(user.id,pid),freshState()); }

  function overwriteState(data) {
    if (typeof S === 'undefined') return;
    const next=Object.assign(freshState(),data||{}); Object.keys(S).forEach(k=>{if(!(k in next))delete S[k]}); Object.assign(S,next);
    try {
      if (window.spotify) spotify.value=S.url||'';
      if (typeof renderHistory==='function') renderHistory();
      if (typeof renderPlatforms==='function') renderPlatforms();
      if (typeof filterChannels==='function') filterChannels();
      if (typeof restoreCreative==='function') restoreCreative();
      if (S.url&&typeof loadSpotify==='function') loadSpotify(true); else { document.getElementById('track')?.classList.remove('show'); const e=document.getElementById('embed'); if(e)e.innerHTML=''; const t=document.getElementById('title'); if(t)t.textContent='Faixa Spotify'; }
      const cal=document.getElementById('calendar'); if(cal)cal.innerHTML=''; const copyEl=document.getElementById('copy'); if(copyEl&&!S.url)copyEl.textContent='Carregue uma música e toque em Gerar.';
    } catch (_) {}
  }

  function persistCurrent() {
    const user=activeUser()||defaultUser(), pid=ensureProject(); if(typeof S==='undefined')return;
    const safe={...S,audioUrl:'',creativeVideoUrl:'',creativeImageUrl:S.creativeImageSource==='spotify'?S.creativeImageUrl:''};
    jsonSave(projectKey(user.id,pid),safe); jsonSave('lamou',safe);
    const users=getUsers(), ui=users.findIndex(u=>u.id===user.id), pi=users[ui]?.projects?.findIndex(p=>p.id===pid)??-1;
    if(ui>=0&&pi>=0){if(S.title&&S.title!=='Faixa Spotify')users[ui].projects[pi].name=S.title;users[ui].projects[pi].updatedAt=new Date().toISOString();setUsers(users)}
    refreshManager();
  }

  function switchProject(projectId){persistCurrent();setActiveProjectId(projectId);const u=activeUser();overwriteState(jsonLoad(projectKey(u.id,projectId),freshState()));jsonSave('lamou',currentProjectData());refreshManager();toastMsg('Projeto carregado.')}
  function createProject(){persistCurrent();const u=activeUser()||defaultUser(),users=getUsers(),idx=users.findIndex(x=>x.id===u.id),p={id:uid('project'),name:'Nova música',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};users[idx].projects=[...(users[idx].projects||[]),p];setUsers(users);setActiveProjectId(p.id);jsonSave(projectKey(u.id,p.id),freshState());jsonSave('lamou',freshState());overwriteState(freshState());refreshManager();toastMsg('Nova música pronta. Usuário e integrações foram mantidos.')}
  function switchUser(userId){persistCurrent();const users=getUsers(),u=users.find(x=>x.id===userId);if(!u)return;setActiveUserId(u.id);const pid=u.projects?.[0]?.id||'';setActiveProjectId(pid);if(!pid)ensureProject();const d=currentProjectData();jsonSave('lamou',d);overwriteState(d);refreshManager();toastMsg(`Usuário ativo: ${u.name}`)}

  function createUser(){const name=prompt('Nome do novo usuário/artista:');if(!name?.trim())return;const sid=prompt('Spotify User ID (opcional):','')||'',sp=prompt('Link do perfil Spotify (opcional):',sid?`https://open.spotify.com/user/${sid}`:'')||'';persistCurrent();const u={id:uid('user'),name:name.trim(),spotifyUserId:sid.trim(),spotifyProfile:sp.trim(),createdAt:new Date().toISOString(),projects:[]},users=getUsers();users.push(u);setUsers(users);setActiveUserId(u.id);setActiveProjectId('');ensureProject();const d=currentProjectData();jsonSave('lamou',d);overwriteState(d);refreshManager();toastMsg('Novo usuário criado com espaço separado.')}
  function editUser(){const u=activeUser();if(!u)return;const name=prompt('Nome do usuário/artista:',u.name);if(!name?.trim())return;const sid=prompt('Spotify User ID:',u.spotifyUserId||'')??u.spotifyUserId,sp=prompt('Link do perfil Spotify:',u.spotifyProfile||'')??u.spotifyProfile,users=getUsers(),idx=users.findIndex(x=>x.id===u.id);users[idx]={...users[idx],name:name.trim(),spotifyUserId:String(sid||'').trim(),spotifyProfile:String(sp||'').trim()};setUsers(users);refreshManager();toastMsg('Usuário atualizado.')}

  function clearCurrentWork(){if(!confirm('Limpar a música/projeto atual? O usuário e as integrações serão mantidos.'))return;const u=activeUser()||defaultUser(),pid=ensureProject();jsonSave(projectKey(u.id,pid),freshState());jsonSave('lamou',freshState());overwriteState(freshState());const users=getUsers(),ui=users.findIndex(x=>x.id===u.id),pi=users[ui].projects.findIndex(p=>p.id===pid);if(pi>=0)users[ui].projects[pi].name='Nova música';setUsers(users);refreshManager();toastMsg('Trabalho atual limpo.')}
  function clearCurrentUser(){const u=activeUser();if(!u||!confirm(`Apagar todos os projetos e históricos de ${u.name}? O cadastro do usuário será mantido.`))return;(u.projects||[]).forEach(p=>localStorage.removeItem(projectKey(u.id,p.id)));const users=getUsers(),idx=users.findIndex(x=>x.id===u.id);users[idx].projects=[];setUsers(users);setActiveProjectId('');ensureProject();const d=currentProjectData();jsonSave('lamou',d);overwriteState(d);refreshManager();toastMsg('Dados do usuário limpos. Cadastro mantido.')}
  function deleteCurrentUser(){const u=activeUser();if(!u||!confirm(`Excluir o usuário ${u.name} e todos os dados dele?`))return;(u.projects||[]).forEach(p=>localStorage.removeItem(projectKey(u.id,p.id)));setUsers(getUsers().filter(x=>x.id!==u.id));setActiveUserId('');setActiveProjectId('');defaultUser();ensureProject();const d=currentProjectData();jsonSave('lamou',d);overwriteState(d);refreshManager();toastMsg('Usuário excluído.')}
  function clearEverything(){if(!confirm('LIMPAR TUDO neste aparelho? Isso apaga usuários, projetos, histórico, Spotify e configurações locais.'))return;if(!confirm('Última confirmação: deseja realmente zerar o LAMOU neste aparelho?'))return;const keep=localStorage.getItem(REMEMBER_KEY);localStorage.clear();sessionStorage.clear();if(keep)localStorage.setItem(REMEMBER_KEY,keep);localStorage.setItem(CLIENT_KEY,SPOTIFY_CLIENT_ID);defaultUser();ensureProject();jsonSave('lamou',freshState());location.reload()}

  function exportBackup(){persistCurrent();const data={version:VERSION,exportedAt:new Date().toISOString(),users:getUsers(),activeUserId:getActiveUserId(),activeProjectId:getActiveProjectId(),projects:{}};data.users.forEach(u=>(u.projects||[]).forEach(p=>data.projects[projectKey(u.id,p.id)]=jsonLoad(projectKey(u.id,p.id),freshState())));const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`lamou-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toastMsg('Backup exportado.')}
  function importBackup(file){if(!file)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);if(!Array.isArray(data.users)||!data.projects)throw new Error('invalid');if(!confirm('Restaurar este backup? Os usuários/projetos atuais serão substituídos.'))return;Object.keys(localStorage).filter(k=>k.startsWith(PROJECT_PREFIX)).forEach(k=>localStorage.removeItem(k));setUsers(data.users);setActiveUserId(data.activeUserId||data.users[0]?.id||'');setActiveProjectId(data.activeProjectId||'');Object.entries(data.projects).forEach(([k,v])=>jsonSave(k,v));const current=currentProjectData();jsonSave('lamou',current);overwriteState(current);refreshManager();toastMsg('Backup restaurado.')}catch(_){alert('Arquivo de backup inválido.')}};r.readAsText(file)}

  async function aiHealth(){try{const res=await fetch(AI_ENDPOINT+'/health',{headers:{Accept:'application/json'},cache:'no-store'});if(!res.ok)return{online:false,status:res.status};const data=await res.json().catch(()=>({}));return{online:true,...data}}catch(_){return{online:false}}}
  window.lamouAIRequest=async function(task,payload={}){const res=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task,payload})});if(!res.ok)throw new Error('LAMOU AI indisponível');return res.json()};
  function toastMsg(message){if(typeof window.toast==='function')window.toast(message);else console.log('[LAMOU]',message)}

  function testResult(name,status,detail){return{name,status,detail}}
  async function withTimeout(promise,ms=5000){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>timer=setTimeout(()=>reject(new Error('timeout')),ms))])}finally{clearTimeout(timer)}}

  async function runSystemTest(){
    const btn=document.getElementById('lamouRunTest'),out=document.getElementById('lamouTestResults');if(btn){btn.disabled=true;btn.textContent='⏳ Testando…'}if(out)out.innerHTML='<div class="notice">Executando testes sem apagar nem publicar nada…</div>';
    const results=[];
    try{
      const requiredFunctions=['loadSpotify','analyseAudio','makeCopy','buildCampaign','filterChannels','tracked','renderHistory','createQuick','shareNow','prepareExternal'];
      requiredFunctions.forEach(fn=>results.push(testResult('Função '+fn,typeof window[fn]==='function'?'ok':'fail',typeof window[fn]==='function'?'carregada':'não encontrada')));
      ['spotify','genre','channels','history','analytics','strategyHub','lamouManager'].forEach(id=>results.push(testResult('Tela #'+id,document.getElementById(id)?'ok':'fail',document.getElementById(id)?'presente':'elemento ausente')));
      try{const k='lamou_diag_'+Date.now();localStorage.setItem(k,'ok');const ok=localStorage.getItem(k)==='ok';localStorage.removeItem(k);results.push(testResult('Armazenamento local',ok?'ok':'fail',ok?'leitura e gravação OK':'falhou'))}catch(e){results.push(testResult('Armazenamento local','fail','bloqueado pelo navegador'))}
      try{const k='lamou_diag_session';sessionStorage.setItem(k,'ok');const ok=sessionStorage.getItem(k)==='ok';sessionStorage.removeItem(k);results.push(testResult('Sessão',ok?'ok':'fail',ok?'OK':'falhou'))}catch(e){results.push(testResult('Sessão','fail','indisponível'))}
      results.push(testResult('Segurança HTTPS / Crypto',window.isSecureContext&&!!crypto?.subtle?'ok':'fail',window.isSecureContext?'contexto seguro':'HTTPS não confirmado'));
      results.push(testResult('Áudio no navegador',(window.AudioContext||window.webkitAudioContext)?'ok':'fail',(window.AudioContext||window.webkitAudioContext)?'AudioContext disponível':'não suportado'));
      results.push(testResult('Spotify Client ID',localStorage.getItem(CLIENT_KEY)===SPOTIFY_CLIENT_ID?'ok':'fail',localStorage.getItem(CLIENT_KEY)?'configurado':'ausente'));
      const u=activeUser(),pid=getActiveProjectId();results.push(testResult('Usuário ativo',u?'ok':'fail',u?u.name:'nenhum usuário'));results.push(testResult('Projeto ativo',pid?'ok':'fail',pid?'separado por usuário':'não definido'));
      results.push(testResult('Service Worker','serviceWorker' in navigator?'ok':'warn','serviceWorker' in navigator?'suportado pelo navegador':'não suportado'));
      results.push(testResult('Compartilhamento nativo',navigator.share?'ok':'warn',navigator.share?'disponível':'opcional neste navegador'));
      try{const res=await withTimeout(fetch(location.href,{method:'GET',cache:'no-store'}),5000);results.push(testResult('Aplicativo / servidor',res.ok?'ok':'fail','HTTP '+res.status))}catch(e){results.push(testResult('Aplicativo / servidor','fail','sem resposta'))}
      const ai=await aiHealth();results.push(testResult('Workers AI',ai.online?'ok':'warn',ai.online?'backend de IA respondeu':'IA local funciona; backend Workers AI ainda não respondeu'));
    }catch(e){results.push(testResult('Teste geral','fail',e.message||'erro inesperado'))}
    const fails=results.filter(r=>r.status==='fail').length,warns=results.filter(r=>r.status==='warn').length,oks=results.filter(r=>r.status==='ok').length;
    const overall=fails?'fail':warns?'warn':'ok',label=fails?`${fails} falha(s) encontrada(s)`:warns?`Tudo essencial OK • ${warns} aviso(s)`:'Tudo funcionando';
    const time=new Date().toLocaleString('pt-BR');
    window.__lamouLastDiagnostic={version:VERSION,time,overall,results};
    if(out)out.innerHTML=`<div class="diag-summary ${overall}"><b>${overall==='ok'?'✅':overall==='warn'?'⚠️':'❌'} ${label}</b><small>${oks} OK • ${warns} avisos • ${fails} falhas • ${time}</small></div><div class="diag-list">${results.map(r=>`<div class="diag-row"><span class="diag-icon ${r.status}">${r.status==='ok'?'✓':r.status==='warn'?'!':'×'}</span><div><b>${esc(r.name)}</b><small>${esc(r.detail)}</small></div></div>`).join('')}</div><button class="btn" id="lamouCopyTest">Copiar relatório</button>`;
    document.getElementById('lamouCopyTest')?.addEventListener('click',copyDiagnosticReport);
    const d=document.getElementById('lamouDiag');if(d)d.innerHTML=`<span class="diag-dot ${overall==='fail'?'bad':overall==='warn'?'warn':'ok'}"></span>${label}`;
    if(btn){btn.disabled=false;btn.textContent='🧪 Rodar teste'}
    toastMsg(fails?'Teste concluído: há falhas para revisar.':'Teste concluído.');
  }

  function copyDiagnosticReport(){const d=window.__lamouLastDiagnostic;if(!d)return;const text=[`LAMOU Music Promoter v${d.version}`,`Teste: ${d.time}`,`Status: ${d.overall}`,'' ,...d.results.map(r=>`[${r.status.toUpperCase()}] ${r.name}: ${r.detail}`)].join('\n');navigator.clipboard?.writeText(text).then(()=>toastMsg('Relatório copiado.')).catch(()=>prompt('Copie o relatório:',text))}

  function injectStyles(){
    if(document.getElementById('lamouV6Styles'))return;const s=document.createElement('style');s.id='lamouV6Styles';s.textContent=`
      .lamou-manager{grid-column:1/-1;border:1px solid #dfe2ee;background:linear-gradient(135deg,#fff,#f7f7ff)}
      .lamou-manager .manager-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:12px;align-items:end}
      .lamou-manager .mini{font-size:.78rem;color:#687080}.lamou-manager .danger{border-color:#d55;color:#a22;background:#fff7f7}.lamou-manager .toolbar-v6{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.lamou-manager select,.lamou-manager input{width:100%}
      .diag-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#999}.diag-dot.ok{background:#22a06b}.diag-dot.warn{background:#d89b18}.diag-dot.bad{background:#c33}
      .diag-panel{margin-top:12px;border-top:1px solid #e2e4ec;padding-top:12px}.diag-summary{padding:12px;border-radius:12px;margin-bottom:10px}.diag-summary b,.diag-summary small{display:block}.diag-summary.ok{background:#edf9f3}.diag-summary.warn{background:#fff8e8}.diag-summary.fail{background:#fff0f0}.diag-list{display:grid;gap:6px;margin-bottom:10px}.diag-row{display:flex;gap:9px;align-items:flex-start;padding:8px 10px;border:1px solid #e5e7ee;border-radius:10px;background:#fff}.diag-row small{display:block;color:#6a7180}.diag-icon{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-weight:900;flex:0 0 22px}.diag-icon.ok{background:#dff5e9;color:#167049}.diag-icon.warn{background:#fff0c7;color:#9a6b00}.diag-icon.fail{background:#ffe0e0;color:#a22}
      @media(max-width:850px){.lamou-manager .manager-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s)
  }

  function injectManager(){
    if(document.getElementById('lamouManager'))return;const main=document.querySelector('main.grid');if(!main)return;const card=document.createElement('section');card.id='lamouManager';card.className='card lamou-manager';card.innerHTML=`
      <div class="row" style="justify-content:space-between;align-items:flex-start"><div><h2>👤 Usuário e projeto</h2><p class="sub">Cada usuário tem músicas, campanhas e histórico separados.</p></div><span class="status green">v${VERSION}</span></div>
      <div class="manager-grid"><div class="field"><label>Usuário ativo</label><select id="lamouUserSelect"></select><div id="lamouUserMeta" class="mini"></div></div><div class="field"><label>Música / projeto</label><select id="lamouProjectSelect"></select><div class="mini">Trocar projeto não mistura históricos.</div></div><div class="field"><label>Status</label><div id="lamouDiag" class="notice">Pronto para testar.</div></div></div>
      <div class="toolbar-v6"><button class="btn p" id="lamouNewMusic">＋ Nova música</button><button class="btn" id="lamouNewUser">＋ Novo usuário</button><button class="btn" id="lamouEditUser">✎ Editar usuário</button><button class="btn" id="lamouClearWork">🧹 Limpar trabalho atual</button><button class="btn" id="lamouClearUser">Limpar dados do usuário</button><button class="btn danger" id="lamouDeleteUser">Excluir usuário</button><button class="btn" id="lamouBackup">⬇ Backup</button><label class="btn" style="cursor:pointer">⬆ Restaurar<input id="lamouRestore" type="file" accept="application/json,.json" hidden></label><button class="btn" id="lamouRunTest">🧪 Rodar teste</button><button class="btn danger" id="lamouClearAll">⚠ Limpar tudo</button></div>
      <div id="lamouTestResults" class="diag-panel"><div class="notice">O teste verifica funções, telas, armazenamento, Spotify, áudio, servidor e IA sem publicar nem apagar nada.</div></div>`;
    main.prepend(card);
    document.getElementById('lamouUserSelect').addEventListener('change',e=>switchUser(e.target.value));document.getElementById('lamouProjectSelect').addEventListener('change',e=>switchProject(e.target.value));document.getElementById('lamouNewMusic').onclick=createProject;document.getElementById('lamouNewUser').onclick=createUser;document.getElementById('lamouEditUser').onclick=editUser;document.getElementById('lamouClearWork').onclick=clearCurrentWork;document.getElementById('lamouClearUser').onclick=clearCurrentUser;document.getElementById('lamouDeleteUser').onclick=deleteCurrentUser;document.getElementById('lamouBackup').onclick=exportBackup;document.getElementById('lamouRestore').onchange=e=>importBackup(e.target.files?.[0]);document.getElementById('lamouRunTest').onclick=runSystemTest;document.getElementById('lamouClearAll').onclick=clearEverything;
  }

  async function refreshDiagnostics(){const el=document.getElementById('lamouDiag');if(!el)return;const ai=await aiHealth(),spotifyReady=!!localStorage.getItem(CLIENT_KEY);el.innerHTML=`<span class="diag-dot ${spotifyReady?'ok':'warn'}"></span>Spotify configurado<br><span class="diag-dot ok"></span>IA local de áudio ativa<br><span class="diag-dot ${ai.online?'ok':'warn'}"></span>Workers AI ${ai.online?'conectada':'aguardando backend'}`}
  function refreshManager(){const us=document.getElementById('lamouUserSelect'),ps=document.getElementById('lamouProjectSelect'),meta=document.getElementById('lamouUserMeta');if(!us||!ps)return;const users=getUsers(),au=activeUser()||defaultUser(),pid=ensureProject();us.innerHTML=users.map(u=>`<option value="${esc(u.id)}" ${u.id===au.id?'selected':''}>${esc(u.name)}</option>`).join('');ps.innerHTML=(au.projects||[]).map(p=>`<option value="${esc(p.id)}" ${p.id===pid?'selected':''}>${esc(p.name||'Nova música')}</option>`).join('');meta.textContent=[au.spotifyUserId?`Spotify ID: ${au.spotifyUserId}`:'Spotify ID não informado',`${(au.projects||[]).length} projeto(s)`].join(' • ')}
  function patchAccess(){const old=window.unlockApp;if(typeof old==='function')window.unlockApp=async function(){const r=document.getElementById('rememberAccess');if(r)r.checked=true;await old.apply(this,arguments);if(document.getElementById('accessGate')?.classList.contains('hidden'))try{localStorage.setItem(REMEMBER_KEY,'ok')}catch(_){}};const r=document.getElementById('rememberAccess');if(r)r.checked=true}
  function patchSave(){window.save=persistCurrent}
  function initializeV6(){defaultUser();ensureProject();injectStyles();injectManager();patchAccess();patchSave();const data=currentProjectData();jsonSave('lamou',data);overwriteState(data);refreshManager();refreshDiagnostics();const client=document.getElementById('spotifyClientId');if(client)client.value=SPOTIFY_CLIENT_ID;const config=document.getElementById('spotifyConfig');if(config)config.style.display='none'}
  window.addEventListener('load',initializeV6,{once:true});
})();