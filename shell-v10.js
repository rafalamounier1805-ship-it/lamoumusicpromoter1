(() => {
  'use strict';

  const STORE = 'lamou_v10_db';
  const SESSION = 'lamou_v10_session';
  const DEFAULT_CONNECTIONS = {
    spotify: 'red', instagram: 'red', tiktok: 'red', youtube: 'red',
    facebook: 'red', threads: 'red', amuse: 'yellow'
  };

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; }
    catch (_) { return {}; }
  };
  const write = data => localStorage.setItem(STORE, JSON.stringify(data));
  const clean = value => String(value || '').replace(/[&<>"']/g, '');
  const workspaceFrom = data => ({
    profile: data.profile || {},
    connections: data.connections || { ...DEFAULT_CONNECTIONS },
    history: Array.isArray(data.history) ? data.history : [],
    draft: data.draft || null,
    radar: Array.isArray(data.radar) ? data.radar : []
  });
  const blankWorkspace = account => ({
    profile: {
      displayName: account.name || 'LAMOU', email: account.email || '', adCode: '',
      artistUrl: '', artistName: '', artistImage: '', artistStats: null, localAI: false
    },
    connections: { ...DEFAULT_CONNECTIONS }, history: [], draft: null, radar: []
  });

  function archiveCurrent(data) {
    if (data.current && data.accounts?.[data.current]) {
      data.accounts[data.current].workspace = workspaceFrom(data);
    }
  }

  function loadWorkspace(data, key) {
    const account = data.accounts[key];
    const workspace = account.workspace || blankWorkspace(account);
    data.profile = workspace.profile;
    data.connections = workspace.connections;
    data.history = workspace.history;
    data.draft = workspace.draft;
    data.radar = workspace.radar;
    data.current = key;
    write(data);
    localStorage.setItem(SESSION, key);
    sessionStorage.setItem(SESSION, key);
  }

  function bootstrapIdentity() {
    const data = read();
    if (!data.accounts || typeof data.accounts !== 'object') data.accounts = {};
    if (!Object.keys(data.accounts).length) {
      data.accounts['lamou-local'] = { name: 'LAMOU', email: '', createdAt: new Date().toISOString(), localOnly: true };
    }

    const keys = Object.keys(data.accounts);
    const priorKeys = keys.filter(key => key !== 'lamou-local');
    let current = data.current && data.accounts[data.current]
      ? data.current
      : (localStorage.getItem(SESSION) && data.accounts[localStorage.getItem(SESSION)]
          ? localStorage.getItem(SESSION)
          : keys[0]);

    if (current === 'lamou-local' && priorKeys.length) {
      current = priorKeys.find(key => data.accounts[key]?.backend)
        || priorKeys.find(key => data.accounts[key]?.email)
        || priorKeys[0];
    }

    data.current = current;
    const selected = data.accounts[current];
    if (selected?.workspace) {
      const w = selected.workspace;
      data.profile = w.profile || data.profile || {};
      data.connections = w.connections || data.connections || { ...DEFAULT_CONNECTIONS };
      data.history = Array.isArray(w.history) ? w.history : (Array.isArray(data.history) ? data.history : []);
      data.draft = w.draft ?? data.draft ?? null;
      data.radar = Array.isArray(w.radar) ? w.radar : (Array.isArray(data.radar) ? data.radar : []);
    } else {
      data.profile = data.profile || blankWorkspace(selected).profile;
      data.connections = data.connections || { ...DEFAULT_CONNECTIONS };
      data.history = Array.isArray(data.history) ? data.history : [];
      data.radar = Array.isArray(data.radar) ? data.radar : [];
    }

    write(data);
    localStorage.setItem(SESSION, current);
    sessionStorage.setItem(SESSION, current);
  }

  function modal(html) {
    const root = document.getElementById('modalRoot');
    if (!root) return;
    root.innerHTML = `<div class="modal-backdrop" data-close-menu><section class="modal">${html}</section></div>`;
  }

  function close() {
    const root = document.getElementById('modalRoot');
    if (root) root.innerHTML = '';
  }

  function menu() {
    const data = read();
    const account = data.accounts?.[data.current] || {};
    const connected = Object.values(data.connections || {}).filter(v => v === 'green').length;
    modal(`
      <div class="modal-head">
        <div><div class="eyebrow">LAMOU</div><h2>${clean(account.name || data.profile?.displayName || 'Usuário')}</h2><p class="sub">${connected} conexão(ões) ativa(s)</p></div>
        <button class="icon-button" data-action="close">×</button>
      </div>
      <div class="mode-grid" style="grid-template-columns:repeat(2,1fr)">
        <button class="choice-card" data-action="users"><span class="choice-icon">👤</span><strong>Usuários</strong><small>Trocar, criar ou editar.</small></button>
        <button class="choice-card" data-action="connections"><span class="choice-icon">🔌</span><strong>Conexões</strong><small>Spotify e demais plataformas.</small></button>
        <button class="choice-card" data-action="install"><span class="choice-icon">⬇️</span><strong>Instalar app</strong><small>Adicionar o LAMOU ao celular.</small></button>
        <button class="choice-card" data-action="tests"><span class="choice-icon">🧪</span><strong>Rodar teste</strong><small>Verificar funções do app.</small></button>
      </div>
    `);
  }

  function users() {
    const data = read();
    const rows = Object.keys(data.accounts || {}).map(key => {
      const a = data.accounts[key];
      const active = key === data.current;
      return `<button class="channel-item ${active ? 'on' : ''}" style="grid-template-columns:1fr auto" data-user-key="${encodeURIComponent(key)}"><div><b>${clean(a.name || key)}</b><small>${clean(a.email || '')}</small></div><span class="status ${active ? 'green' : 'gray'}">${active ? 'Ativo' : 'Trocar'}</span></button>`;
    }).join('');

    modal(`
      <div class="modal-head"><div><div class="eyebrow">USUÁRIOS</div><h2>Escolha o perfil</h2></div><button class="icon-button" data-action="close">×</button></div>
      <div class="channel-list">${rows}</div>
      <div class="row" style="margin-top:14px">
        <button class="primary-button" data-action="create-user">＋ Novo usuário</button>
        <button class="ghost-button" data-action="edit-user">Editar atual</button>
        <button class="ghost-button" data-action="remove-user">Excluir atual</button>
      </div>
      <div class="notice" style="margin-top:12px">Perfil, conexões, histórico, rascunhos e Radar ficam separados por usuário.</div>
    `);
  }

  function switchUser(key) {
    const data = read();
    if (!data.accounts?.[key]) return;
    archiveCurrent(data);
    loadWorkspace(data, key);
    location.reload();
  }

  function createUser() {
    const name = prompt('Nome do novo usuário/artista:');
    if (!name?.trim()) return;
    const email = (prompt('E-mail (opcional):', '') || '').trim();
    const data = read();
    archiveCurrent(data);
    const key = 'user_' + Date.now().toString(36);
    data.accounts[key] = { name: name.trim(), email, createdAt: new Date().toISOString(), localOnly: true };
    data.accounts[key].workspace = blankWorkspace(data.accounts[key]);
    loadWorkspace(data, key);
    location.reload();
  }

  function editUser() {
    const data = read();
    const account = data.accounts?.[data.current];
    if (!account) return;
    const name = prompt('Nome do usuário/artista:', account.name || 'LAMOU');
    if (!name?.trim()) return;
    const email = prompt('E-mail:', account.email || '');
    account.name = name.trim();
    account.email = String(email ?? account.email ?? '').trim();
    data.profile = data.profile || {};
    data.profile.displayName = account.name;
    data.profile.email = account.email;
    write(data);
    location.reload();
  }

  function removeUser() {
    const data = read();
    const keys = Object.keys(data.accounts || {});
    if (keys.length <= 1) { alert('Mantenha pelo menos um usuário no app.'); return; }
    const account = data.accounts[data.current];
    if (!confirm(`Excluir o usuário ${account?.name || ''} deste aparelho?`)) return;
    delete data.accounts[data.current];
    loadWorkspace(data, Object.keys(data.accounts)[0]);
    location.reload();
  }

  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstall = event;
  });
  window.addEventListener('appinstalled', () => { deferredInstall = null; });

  async function installApp() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      alert('O LAMOU já está instalado neste aparelho.');
      return;
    }
    if (deferredInstall) {
      deferredInstall.prompt();
      await deferredInstall.userChoice.catch(() => {});
      deferredInstall = null;
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    alert(ios
      ? 'No Safari: toque em Compartilhar e depois em “Adicionar à Tela de Início”.'
      : 'No Chrome: abra o menu ⋮ e toque em “Instalar app” ou “Adicionar à tela inicial”.');
  }

  bootstrapIdentity();

  window.LamouUserManager = { menu, users, close, switchUser, createUser, editUser, removeUser };
  window.LamouInstall = { install: installApp };

  document.addEventListener('click', event => {
    const menuBtn = event.target.closest('#lamouMenuBtn');
    if (menuBtn) { menu(); return; }

    if (event.target.matches('[data-close-menu]')) { close(); return; }

    const userBtn = event.target.closest('[data-user-key]');
    if (userBtn) { switchUser(decodeURIComponent(userBtn.dataset.userKey)); return; }

    const actionBtn = event.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    if (action === 'close') close();
    else if (action === 'users') users();
    else if (action === 'create-user') createUser();
    else if (action === 'edit-user') editUser();
    else if (action === 'remove-user') removeUser();
    else if (action === 'connections') { close(); setTimeout(() => window.Lamou?.openUser(), 0); }
    else if (action === 'tests') { close(); setTimeout(() => window.Lamou?.runTests(), 0); }
    else if (action === 'install') installApp();
  });
})();