/* LAMOU Music Promoter — UX/state layer v6
   - persistent device access (password is never stored)
   - fixed Spotify Client ID
   - users and projects separated
   - new user / new music / clear controls
   - backup / restore / diagnostics
   - prepares AI endpoint without pretending it is online
*/
(() => {
  'use strict';

  const VERSION = '6.0.0';
  const ACCESS_KEY = 'lamou_access';
  const REMEMBER_KEY = 'lamou_access_remember';
  const CLIENT_KEY = 'lamou_spotify_client_id';
  const SPOTIFY_CLIENT_ID = '8a9c328f33b14bad9b48473d238925fc';
  const USERS_KEY = 'lamou_users_v6';
  const ACTIVE_USER_KEY = 'lamou_active_user_v6';
  const ACTIVE_PROJECT_KEY = 'lamou_active_project_v6';
  const PROJECT_PREFIX = 'lamou_project_v6_';
  const AI_ENDPOINT = '/api/ai';

  // Spotify configuration is now internal. No need to type Client ID again.
  try { localStorage.setItem(CLIENT_KEY, SPOTIFY_CLIENT_ID); } catch (_) {}

  // Migrate the old remembered access flag to the flag used by strategy.js.
  try {
    if (localStorage.getItem(ACCESS_KEY) === 'ok') {
      localStorage.setItem(REMEMBER_KEY, 'ok');
    }
  } catch (_) {}

  const jsonLoad = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  };

  const jsonSave = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  };

  const uid = (prefix = 'id') => prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const slug = value => String(value || 'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 42) || 'usuario';

  function getUsers() { return jsonLoad(USERS_KEY, []); }
  function setUsers(users) { jsonSave(USERS_KEY, users); }
  function getActiveUserId() { return localStorage.getItem(ACTIVE_USER_KEY) || ''; }
  function setActiveUserId(id) { localStorage.setItem(ACTIVE_USER_KEY, id || ''); }
  function getActiveProjectId() { return localStorage.getItem(ACTIVE_PROJECT_KEY) || ''; }
  function setActiveProjectId(id) { localStorage.setItem(ACTIVE_PROJECT_KEY, id || ''); }
  function projectKey(userId, projectId) { return `${PROJECT_PREFIX}${userId}_${projectId}`; }

  function activeUser() {
    const id = getActiveUserId();
    return getUsers().find(u => u.id === id) || null;
  }

  function defaultUser() {
    const users = getUsers();
    if (users.length) {
      if (!getActiveUserId()) setActiveUserId(users[0].id);
      return users[0];
    }
    const user = {
      id: uid('user'),
      name: 'LAMOU',
      spotifyUserId: '31i5b3kg7i6mlhfgbvsc53ab6rlm',
      spotifyProfile: 'https://open.spotify.com/user/31i5b3kg7i6mlhfgbvsc53ab6rlm',
      createdAt: new Date().toISOString(),
      projects: []
    };
    setUsers([user]);
    setActiveUserId(user.id);
    return user;
  }

  function freshState() {
    return {
      url:'', title:'', cover:'', hooks:[], hook:null, duration:0, audioUrl:'',
      creativeMode:'image', creativeFormat:'1:1', creativeImageUrl:'', creativeVideoUrl:'',
      creativeImageSource:'', creativeVideoName:'', syncHook:true,
      quick:['Instagram','TikTok','YouTube Shorts'], camp:['Instagram','TikTok'],
      langs:['Português'], markets:['Brasil'], selected:[], history:[]
    };
  }

  function ensureProject() {
    let user = activeUser() || defaultUser();
    let projectId = getActiveProjectId();
    if (projectId && user.projects?.some(p => p.id === projectId)) return projectId;

    const p = { id: uid('project'), name: 'Nova música', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    users[idx].projects = [...(users[idx].projects || []), p];
    setUsers(users);
    setActiveProjectId(p.id);

    // First migration: preserve whatever the old app already had.
    const legacy = jsonLoad('lamou', null);
    jsonSave(projectKey(user.id, p.id), legacy || freshState());
    return p.id;
  }

  function currentProjectData() {
    const user = activeUser() || defaultUser();
    const pid = ensureProject();
    return jsonLoad(projectKey(user.id, pid), freshState());
  }

  function overwriteState(data) {
    if (typeof S === 'undefined') return;
    const base = freshState();
    const next = Object.assign(base, data || {});
    Object.keys(S).forEach(k => { if (!(k in next)) delete S[k]; });
    Object.assign(S, next);

    // Refresh the visible parts without reloading the whole page when possible.
    try {
      if (window.spotify) spotify.value = S.url || '';
      if (typeof renderHistory === 'function') renderHistory();
      if (typeof renderPlatforms === 'function') renderPlatforms();
      if (typeof filterChannels === 'function') filterChannels();
      if (typeof restoreCreative === 'function') restoreCreative();
      if (S.url && typeof loadSpotify === 'function') loadSpotify(true);
      else {
        document.getElementById('track')?.classList.remove('show');
        const embedEl = document.getElementById('embed'); if (embedEl) embedEl.innerHTML = '';
        const titleEl = document.getElementById('title'); if (titleEl) titleEl.textContent = 'Faixa Spotify';
      }
      const cal = document.getElementById('calendar'); if (cal) cal.innerHTML = '';
      const copyEl = document.getElementById('copy'); if (copyEl && !S.url) copyEl.textContent = 'Carregue uma música e toque em Gerar.';
    } catch (_) {}
  }

  function persistCurrent() {
    const user = activeUser() || defaultUser();
    const pid = ensureProject();
    if (typeof S === 'undefined') return;

    const safe = {
      ...S,
      audioUrl:'',
      creativeVideoUrl:'',
      creativeImageUrl:S.creativeImageSource === 'spotify' ? S.creativeImageUrl : ''
    };
    jsonSave(projectKey(user.id, pid), safe);
    // Keep legacy key updated so existing functions remain compatible.
    jsonSave('lamou', safe);

    const users = getUsers();
    const ui = users.findIndex(u => u.id === user.id);
    const pi = users[ui]?.projects?.findIndex(p => p.id === pid) ?? -1;
    if (ui >= 0 && pi >= 0) {
      if (S.title && S.title !== 'Faixa Spotify') users[ui].projects[pi].name = S.title;
      users[ui].projects[pi].updatedAt = new Date().toISOString();
      setUsers(users);
    }
    refreshManager();
  }

  function switchProject(projectId) {
    persistCurrent();
    setActiveProjectId(projectId);
    const user = activeUser();
    overwriteState(jsonLoad(projectKey(user.id, projectId), freshState()));
    jsonSave('lamou', currentProjectData());
    refreshManager();
    toastMsg('Projeto carregado.');
  }

  function createProject() {
    persistCurrent();
    const user = activeUser() || defaultUser();
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    const p = { id: uid('project'), name: 'Nova música', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    users[idx].projects = [...(users[idx].projects || []), p];
    setUsers(users);
    setActiveProjectId(p.id);
    jsonSave(projectKey(user.id, p.id), freshState());
    jsonSave('lamou', freshState());
    overwriteState(freshState());
    refreshManager();
    toastMsg('Nova música pronta. Usuário e integrações foram mantidos.');
  }

  function switchUser(userId) {
    persistCurrent();
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setActiveUserId(user.id);
    const pid = user.projects?.[0]?.id || '';
    setActiveProjectId(pid);
    if (!pid) ensureProject();
    const data = currentProjectData();
    jsonSave('lamou', data);
    overwriteState(data);
    refreshManager();
    toastMsg(`Usuário ativo: ${user.name}`);
  }

  function createUser() {
    const name = prompt('Nome do novo usuário/artista:');
    if (!name?.trim()) return;
    const spotifyUserId = prompt('Spotify User ID (opcional):', '') || '';
    const spotifyProfile = prompt('Link do perfil Spotify (opcional):', spotifyUserId ? `https://open.spotify.com/user/${spotifyUserId}` : '') || '';

    persistCurrent();
    const user = { id: uid('user'), name:name.trim(), spotifyUserId:spotifyUserId.trim(), spotifyProfile:spotifyProfile.trim(), createdAt:new Date().toISOString(), projects:[] };
    const users = getUsers(); users.push(user); setUsers(users); setActiveUserId(user.id); setActiveProjectId('');
    ensureProject();
    const data = currentProjectData(); jsonSave('lamou', data); overwriteState(data); refreshManager();
    toastMsg('Novo usuário criado com espaço separado.');
  }

  function editUser() {
    const user = activeUser(); if (!user) return;
    const name = prompt('Nome do usuário/artista:', user.name); if (!name?.trim()) return;
    const sid = prompt('Spotify User ID:', user.spotifyUserId || '') ?? user.spotifyUserId;
    const profile = prompt('Link do perfil Spotify:', user.spotifyProfile || '') ?? user.spotifyProfile;
    const users = getUsers(); const idx = users.findIndex(u => u.id === user.id);
    users[idx] = {...users[idx], name:name.trim(), spotifyUserId:String(sid||'').trim(), spotifyProfile:String(profile||'').trim()};
    setUsers(users); refreshManager(); toastMsg('Usuário atualizado.');
  }

  function clearCurrentWork() {
    if (!confirm('Limpar a música/projeto atual? O usuário e as integrações serão mantidos.')) return;
    const user = activeUser() || defaultUser(); const pid = ensureProject();
    jsonSave(projectKey(user.id, pid), freshState()); jsonSave('lamou', freshState()); overwriteState(freshState());
    const users = getUsers(); const ui = users.findIndex(u=>u.id===user.id); const pi = users[ui].projects.findIndex(p=>p.id===pid);
    if (pi >= 0) users[ui].projects[pi].name = 'Nova música'; setUsers(users); refreshManager();
    toastMsg('Trabalho atual limpo.');
  }

  function clearCurrentUser() {
    const user = activeUser(); if (!user) return;
    if (!confirm(`Apagar todos os projetos e históricos de ${user.name}? O cadastro do usuário será mantido.`)) return;
    (user.projects || []).forEach(p => localStorage.removeItem(projectKey(user.id, p.id)));
    const users = getUsers(); const idx = users.findIndex(u=>u.id===user.id); users[idx].projects = []; setUsers(users); setActiveProjectId('');
    ensureProject(); const data = currentProjectData(); jsonSave('lamou',data); overwriteState(data); refreshManager();
    toastMsg('Dados do usuário limpos. Cadastro mantido.');
  }

  function deleteCurrentUser() {
    const user = activeUser(); if (!user) return;
    if (!confirm(`Excluir o usuário ${user.name} e todos os dados dele?`)) return;
    (user.projects || []).forEach(p => localStorage.removeItem(projectKey(user.id, p.id)));
    let users = getUsers().filter(u => u.id !== user.id); setUsers(users); setActiveUserId(''); setActiveProjectId('');
    defaultUser(); ensureProject(); const data=currentProjectData(); jsonSave('lamou',data); overwriteState(data); refreshManager();
    toastMsg('Usuário excluído.');
  }

  function clearEverything() {
    if (!confirm('LIMPAR TUDO neste aparelho? Isso apaga usuários, projetos, histórico, Spotify e configurações locais.')) return;
    if (!confirm('Última confirmação: deseja realmente zerar o LAMOU neste aparelho?')) return;
    const preserve = [REMEMBER_KEY];
    const keep = {}; preserve.forEach(k => keep[k] = localStorage.getItem(k));
    localStorage.clear(); sessionStorage.clear();
    Object.entries(keep).forEach(([k,v]) => { if (v) localStorage.setItem(k,v); });
    localStorage.setItem(CLIENT_KEY, SPOTIFY_CLIENT_ID);
    defaultUser(); ensureProject(); jsonSave('lamou', freshState());
    location.reload();
  }

  function exportBackup() {
    persistCurrent();
    const data = { version:VERSION, exportedAt:new Date().toISOString(), users:getUsers(), activeUserId:getActiveUserId(), activeProjectId:getActiveProjectId(), projects:{} };
    data.users.forEach(u => (u.projects||[]).forEach(p => { data.projects[projectKey(u.id,p.id)] = jsonLoad(projectKey(u.id,p.id), freshState()); }));
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `lamou-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000); toastMsg('Backup exportado.');
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.users) || !data.projects) throw new Error('invalid');
        if (!confirm('Restaurar este backup? Os usuários/projetos atuais serão substituídos.')) return;
        // remove only v6 project records
        Object.keys(localStorage).filter(k=>k.startsWith(PROJECT_PREFIX)).forEach(k=>localStorage.removeItem(k));
        setUsers(data.users); setActiveUserId(data.activeUserId || data.users[0]?.id || ''); setActiveProjectId(data.activeProjectId || '');
        Object.entries(data.projects).forEach(([k,v])=>jsonSave(k,v));
        const current=currentProjectData(); jsonSave('lamou',current); overwriteState(current); refreshManager(); toastMsg('Backup restaurado.');
      } catch (_) { alert('Arquivo de backup inválido.'); }
    };
    reader.readAsText(file);
  }

  async function aiHealth() {
    try {
      const res = await fetch(AI_ENDPOINT + '/health', {headers:{'Accept':'application/json'}});
      if (!res.ok) return {online:false};
      const data = await res.json().catch(()=>({}));
      return {online:true, ...data};
    } catch (_) { return {online:false}; }
  }

  window.lamouAIRequest = async function(task, payload={}) {
    const res = await fetch(AI_ENDPOINT, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task,payload})});
    if (!res.ok) throw new Error('LAMOU AI indisponível');
    return res.json();
  };

  function toastMsg(message) {
    if (typeof window.toast === 'function') window.toast(message);
    else console.log('[LAMOU]', message);
  }

  function injectStyles() {
    if (document.getElementById('lamouV6Styles')) return;
    const s = document.createElement('style'); s.id='lamouV6Styles'; s.textContent = `
      .lamou-manager{grid-column:1/-1;border:1px solid #dfe2ee;background:linear-gradient(135deg,#fff,#f7f7ff)}
      .lamou-manager .manager-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:12px;align-items:end}
      .lamou-manager .mini{font-size:.78rem;color:#687080}
      .lamou-manager .danger{border-color:#d55;color:#a22;background:#fff7f7}
      .lamou-manager .toolbar-v6{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .lamou-manager select,.lamou-manager input{width:100%}
      .lamou-version{font-size:.72rem;color:#777;margin-left:auto;align-self:center}
      .diag-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#999}
      .diag-dot.ok{background:#22a06b}.diag-dot.warn{background:#d89b18}
      @media(max-width:850px){.lamou-manager .manager-grid{grid-template-columns:1fr}.lamou-version{width:100%;margin-left:0}}
    `; document.head.appendChild(s);
  }

  function injectManager() {
    if (document.getElementById('lamouManager')) return;
    const main = document.querySelector('main.grid'); if (!main) return;
    const card = document.createElement('section'); card.id='lamouManager'; card.className='card lamou-manager';
    card.innerHTML = `
      <div class="row" style="justify-content:space-between;align-items:flex-start">
        <div><h2>👤 Usuário e projeto</h2><p class="sub">Cada usuário tem músicas, campanhas e histórico separados.</p></div>
        <span class="status green">v${VERSION}</span>
      </div>
      <div class="manager-grid">
        <div class="field"><label>Usuário ativo</label><select id="lamouUserSelect"></select><div id="lamouUserMeta" class="mini"></div></div>
        <div class="field"><label>Música / projeto</label><select id="lamouProjectSelect"></select><div class="mini">Trocar projeto não mistura históricos.</div></div>
        <div class="field"><label>Status</label><div id="lamouDiag" class="notice">Verificando…</div></div>
      </div>
      <div class="toolbar-v6">
        <button class="btn p" id="lamouNewMusic">＋ Nova música</button>
        <button class="btn" id="lamouNewUser">＋ Novo usuário</button>
        <button class="btn" id="lamouEditUser">✎ Editar usuário</button>
        <button class="btn" id="lamouClearWork">🧹 Limpar trabalho atual</button>
        <button class="btn" id="lamouClearUser">Limpar dados do usuário</button>
        <button class="btn danger" id="lamouDeleteUser">Excluir usuário</button>
        <button class="btn" id="lamouBackup">⬇ Backup</button>
        <label class="btn" style="cursor:pointer">⬆ Restaurar<input id="lamouRestore" type="file" accept="application/json,.json" hidden></label>
        <button class="btn danger" id="lamouClearAll">⚠ Limpar tudo</button>
      </div>`;
    main.prepend(card);

    document.getElementById('lamouUserSelect').addEventListener('change', e=>switchUser(e.target.value));
    document.getElementById('lamouProjectSelect').addEventListener('change', e=>switchProject(e.target.value));
    document.getElementById('lamouNewMusic').onclick=createProject;
    document.getElementById('lamouNewUser').onclick=createUser;
    document.getElementById('lamouEditUser').onclick=editUser;
    document.getElementById('lamouClearWork').onclick=clearCurrentWork;
    document.getElementById('lamouClearUser').onclick=clearCurrentUser;
    document.getElementById('lamouDeleteUser').onclick=deleteCurrentUser;
    document.getElementById('lamouBackup').onclick=exportBackup;
    document.getElementById('lamouRestore').onchange=e=>importBackup(e.target.files?.[0]);
    document.getElementById('lamouClearAll').onclick=clearEverything;
  }

  async function refreshDiagnostics() {
    const el = document.getElementById('lamouDiag'); if (!el) return;
    const ai = await aiHealth();
    const spotifyReady = !!localStorage.getItem(CLIENT_KEY);
    el.innerHTML = `<span class="diag-dot ${spotifyReady?'ok':'warn'}"></span>Spotify configurado<br>`+
      `<span class="diag-dot ok"></span>IA local de áudio ativa<br>`+
      `<span class="diag-dot ${ai.online?'ok':'warn'}"></span>Workers AI ${ai.online?'conectada':'aguardando backend'}`;
  }

  function refreshManager() {
    const userSel=document.getElementById('lamouUserSelect'), projectSel=document.getElementById('lamouProjectSelect'), meta=document.getElementById('lamouUserMeta');
    if (!userSel || !projectSel) return;
    const users=getUsers(), au=activeUser() || defaultUser(), pid=ensureProject();
    userSel.innerHTML=users.map(u=>`<option value="${esc(u.id)}" ${u.id===au.id?'selected':''}>${esc(u.name)}</option>`).join('');
    projectSel.innerHTML=(au.projects||[]).map(p=>`<option value="${esc(p.id)}" ${p.id===pid?'selected':''}>${esc(p.name||'Nova música')}</option>`).join('');
    meta.textContent=[au.spotifyUserId?`Spotify ID: ${au.spotifyUserId}`:'Spotify ID não informado', `${(au.projects||[]).length} projeto(s)`].join(' • ');
  }

  function patchAccess() {
    // Strategy.js is loaded after this file and defines unlockApp again, so patch it after window.load.
    const oldUnlock = window.unlockApp;
    if (typeof oldUnlock === 'function') {
      window.unlockApp = async function() {
        const remember = document.getElementById('rememberAccess');
        if (remember) remember.checked = true;
        await oldUnlock.apply(this, arguments);
        const gate = document.getElementById('accessGate');
        if (gate?.classList.contains('hidden')) {
          try { localStorage.setItem(REMEMBER_KEY,'ok'); } catch (_) {}
        }
      };
    }
    const remember = document.getElementById('rememberAccess');
    if (remember) remember.checked = true;
  }

  function patchSave() {
    // Replace the legacy single-bucket save with per-user/per-project persistence.
    window.save = persistCurrent;
  }

  function initializeV6() {
    defaultUser(); ensureProject(); injectStyles(); injectManager(); patchAccess(); patchSave();

    const data=currentProjectData();
    jsonSave('lamou', data);
    overwriteState(data);
    refreshManager(); refreshDiagnostics();

    // Hide the technical Spotify Client ID UI: configuration is already internal.
    const client = document.getElementById('spotifyClientId');
    if (client) client.value = SPOTIFY_CLIENT_ID;
    const config = document.getElementById('spotifyConfig');
    if (config) config.style.display = 'none';
  }

  window.addEventListener('load', initializeV6, {once:true});
})();
