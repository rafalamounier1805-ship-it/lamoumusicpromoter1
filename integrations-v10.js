(() => {
  'use strict';

  const STORE = 'lamou_v10_db';
  const SESSION = 'lamou_v10_session';
  const NAMES = {
    spotify: 'Spotify', instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube',
    facebook: 'Facebook', threads: 'Threads', amuse: 'Amuse / distribuidora'
  };
  const SUPPORTED = new Set(['spotify']);

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; }
    catch (_) { return {}; }
  };
  const write = data => localStorage.setItem(STORE, JSON.stringify(data));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const modalRoot = () => document.getElementById('modalRoot');
  const toast = message => {
    const el = document.getElementById('toast');
    if (!el) return alert(message);
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 3200);
  };

  function modal(html) {
    const root = modalRoot();
    if (!root) return;
    root.innerHTML = `<div class="modal-backdrop" data-int-action="close"><section class="modal" onclick="event.stopPropagation()">${html}</section></div>`;
  }
  function close() { const root = modalRoot(); if (root) root.innerHTML = ''; }

  async function api(path, options = {}) {
    let response;
    try {
      response = await fetch(path, {
        credentials: 'include',
        cache: 'no-store',
        ...options,
        headers: {'Content-Type':'application/json', ...(options.headers || {})}
      });
    } catch (_) {
      return {ok:false, status:0, data:{error:'Sem resposta do servidor.'}};
    }
    let data = {};
    try { data = await response.json(); } catch (_) {}
    return {ok:response.ok, status:response.status, data};
  }

  function persistRemote(remote) {
    const data = read();
    data.profile = data.profile || {};
    data.connections = data.connections || {};

    if (remote?.artist) {
      data.profile.artistName = remote.artist.name || data.profile.artistName || '';
      data.profile.artistImage = remote.artist.image || data.profile.artistImage || '';
      data.profile.artistUrl = remote.artist.url || data.profile.artistUrl || '';
      data.profile.artistStats = remote.artist.stats || data.profile.artistStats || null;
    }
    if (remote?.connections) data.connections = {...data.connections, ...remote.connections};

    const user = remote?.user;
    if (user && data.current && data.accounts?.[data.current]) {
      const account = data.accounts[data.current];
      account.backend = true;
      account.backendId = user.id || account.backendId || '';
      account.username = user.username || account.username || '';
      account.email = user.email || account.email || '';
      account.name = user.display_name || user.displayName || account.name || user.username || 'LAMOU';
      data.profile.displayName = account.name;
      data.profile.email = account.email;
      if (account.workspace) {
        account.workspace.profile = {...(account.workspace.profile || {}), ...data.profile};
        account.workspace.connections = {...(account.workspace.connections || {}), ...data.connections};
      }
    }
    write(data);
  }

  async function remoteProfile() {
    const result = await api('/api/profile/summary', {method:'GET', headers:{}});
    if (result.ok) persistRemote(result.data);
    return result;
  }

  function statusLabel(value) {
    return value === 'green' ? ['green','Conectado'] : value === 'yellow' ? ['yellow','Aguardando'] : ['red','Não conectado'];
  }

  async function openConnections() {
    modal(`<div class="modal-head"><div><div class="eyebrow">CONEXÕES</div><h2>Verificando integrações…</h2></div><button class="icon-button" data-int-action="close">×</button></div><div class="notice">Consultando o backend seguro do LAMOU.</div>`);
    const remote = await remoteProfile();
    const data = read();
    const hasSession = remote.ok;
    const cards = Object.keys(NAMES).map(provider => {
      const supported = SUPPORTED.has(provider);
      const [cls, label] = statusLabel(data.connections?.[provider]);
      const connected = data.connections?.[provider] === 'green';
      const detail = provider === 'spotify'
        ? (connected ? 'Autorização OAuth válida no servidor.' : hasSession ? 'Pronto para autorizar sua conta Spotify.' : 'Precisa ativar a sessão segura uma vez.')
        : 'Integração oficial ainda não foi implementada no backend.';
      const button = supported
        ? `<button data-int-connect="${provider}">${connected ? 'Reconectar' : 'Conectar'}</button>`
        : `<button disabled>Em implantação</button>`;
      return `<div class="connection"><div class="row between"><b>${esc(NAMES[provider])}</b><span class="status ${supported ? cls : 'gray'}">${supported ? label : 'Ainda indisponível'}</span></div><small>${esc(detail)}</small><div class="connection-actions">${button}</div></div>`;
    }).join('');

    modal(`
      <div class="modal-head"><div><div class="eyebrow">CONEXÕES</div><h2>Integrações do LAMOU</h2></div><button class="icon-button" data-int-action="close">×</button></div>
      ${hasSession ? '<div class="notice" style="margin-bottom:12px">Sessão segura ativa. O Spotify pode ser autorizado agora.</div>' : '<div class="notice warn" style="margin-bottom:12px"><b>Seu usuário está só no aparelho.</b><br>Para conectar o Spotify, ative a conta segura do servidor uma vez. Depois o aparelho permanece conectado pela sessão protegida.</div>'}
      <div class="connection-grid">${cards}</div>
      ${hasSession ? '<div class="row" style="margin-top:14px"><button class="ghost-button" data-int-action="sync">↻ Atualizar status</button></div>' : '<div class="row" style="margin-top:14px"><button class="primary-button" data-int-action="login">Entrar para ativar integrações</button><button class="ghost-button" data-int-action="register">Primeiro acesso seguro</button></div>'}
      <div class="notice" style="margin-top:12px">Hoje o backend possui OAuth real para Spotify. Instagram, TikTok, YouTube, Facebook, Threads e Amuse não serão marcados falsamente como conectados enquanto a integração oficial não existir.</div>
    `);
  }

  function openAuth(mode = 'login', provider = 'spotify') {
    const data = read();
    const account = data.accounts?.[data.current] || {};
    if (mode === 'register') {
      modal(`
        <div class="modal-head"><div><div class="eyebrow">PRIMEIRO ACESSO SEGURO</div><h2>Ativar integrações</h2></div><button class="icon-button" data-int-action="close">×</button></div>
        <p class="sub">Crie o acesso do servidor. Isso é feito uma vez; a sessão fica salva com cookie seguro.</p>
        <div class="two">
          <div class="field"><label>Nome</label><input id="intRegName" value="${esc(account.name || data.profile?.displayName || '')}"></div>
          <div class="field"><label>E-mail</label><input id="intRegEmail" type="email" value="${esc(account.email || data.profile?.email || '')}"></div>
          <div class="field"><label>Usuário</label><input id="intRegUser" autocomplete="username" value="${esc(account.username || '')}"></div>
          <div class="field"><label>Senha (mín. 8 caracteres)</label><input id="intRegPass" type="password" autocomplete="new-password"></div>
          <div class="field"><label>Confirmar senha</label><input id="intRegPass2" type="password" autocomplete="new-password"></div>
        </div>
        <div id="intAuthMsg" class="notice" style="display:none;margin:10px 0"></div>
        <div class="row"><button class="primary-button" data-int-action="submit-register" data-provider="${provider}">Criar acesso e conectar</button><button class="ghost-button" data-int-action="login">Já tenho acesso</button></div>
      `);
      return;
    }

    modal(`
      <div class="modal-head"><div><div class="eyebrow">ACESSO SEGURO</div><h2>Ativar integrações</h2></div><button class="icon-button" data-int-action="close">×</button></div>
      <p class="sub">Entre uma vez para o backend reconhecer seu usuário e permitir OAuth.</p>
      <div class="field"><label>Usuário ou e-mail</label><input id="intLoginIdentity" autocomplete="username" value="${esc(account.username || account.email || data.profile?.email || '')}"></div>
      <div class="field"><label>Senha</label><input id="intLoginPass" type="password" autocomplete="current-password"></div>
      <div id="intAuthMsg" class="notice" style="display:none;margin:10px 0"></div>
      <div class="row"><button class="primary-button" data-int-action="submit-login" data-provider="${provider}">Entrar e conectar</button><button class="ghost-button" data-int-action="register">Primeiro acesso</button></div>
    `);
  }

  function authMessage(text, bad = false) {
    const el = document.getElementById('intAuthMsg');
    if (!el) return;
    el.style.display = 'block';
    el.className = bad ? 'notice bad' : 'notice';
    el.textContent = text;
  }

  async function loginAndConnect(provider = 'spotify') {
    const identity = document.getElementById('intLoginIdentity')?.value.trim() || '';
    const password = document.getElementById('intLoginPass')?.value || '';
    if (!identity || !password) return authMessage('Informe usuário/e-mail e senha.', true);
    authMessage('Entrando…');
    const result = await api('/api/auth/login', {method:'POST', body:JSON.stringify({identity, password})});
    if (!result.ok) return authMessage(result.data?.error || `Falha ao entrar (${result.status}).`, true);
    const profile = await remoteProfile();
    if (!profile.ok) return authMessage('A sessão foi criada, mas o perfil não respondeu.', true);
    toast('Acesso seguro ativado. Abrindo autorização…');
    await connect(provider);
  }

  async function registerAndConnect(provider = 'spotify') {
    const displayName = document.getElementById('intRegName')?.value.trim() || '';
    const email = document.getElementById('intRegEmail')?.value.trim().toLowerCase() || '';
    const username = document.getElementById('intRegUser')?.value.trim() || '';
    const password = document.getElementById('intRegPass')?.value || '';
    const confirm = document.getElementById('intRegPass2')?.value || '';
    if (!displayName || !email || !username || password.length < 8) return authMessage('Preencha todos os campos e use senha com pelo menos 8 caracteres.', true);
    if (password !== confirm) return authMessage('As senhas não conferem.', true);
    authMessage('Criando acesso seguro…');
    const result = await api('/api/auth/register', {method:'POST', body:JSON.stringify({displayName, email, username, password})});
    if (!result.ok) {
      if (result.status === 409) return authMessage('Esse usuário/e-mail já existe no servidor. Use “Já tenho acesso”.', true);
      return authMessage(result.data?.error || `Falha ao cadastrar (${result.status}).`, true);
    }
    const data = read();
    if (data.current && data.accounts?.[data.current]) {
      data.accounts[data.current].backend = true;
      data.accounts[data.current].username = username;
      data.accounts[data.current].email = email;
      write(data);
    }
    await remoteProfile();
    toast('Cadastro seguro concluído. Abrindo autorização…');
    await connect(provider);
  }

  async function connect(provider) {
    if (!SUPPORTED.has(provider)) {
      toast(`${NAMES[provider] || provider}: integração oficial ainda não implementada.`);
      return;
    }
    const result = await api(`/api/oauth/${encodeURIComponent(provider)}/start`, {method:'GET', headers:{}});
    if (result.ok && result.data?.url) {
      location.href = result.data.url;
      return;
    }
    if (result.status === 401 || result.status === 403) {
      openAuth('login', provider);
      return;
    }
    if (result.status === 503) {
      const diagnostic = await api('/api/oauth/diagnostic', {method:'GET', headers:{}});
      const d = diagnostic.data || {};
      modal(`<div class="modal-head"><div><div class="eyebrow">SPOTIFY</div><h2>Backend incompleto</h2></div><button class="icon-button" data-int-action="close">×</button></div><div class="notice bad">${esc(result.data?.error || 'A autorização não pôde iniciar.')}</div><div class="test-list" style="margin-top:12px"><div class="test-item"><b>Spotify Client ID</b><span class="status ${d.spotify_client_id?'green':'red'}">${d.spotify_client_id?'OK':'Ausente'}</span></div><div class="test-item"><b>Chave de criptografia</b><span class="status ${d.token_encryption_key?'green':'red'}">${d.token_encryption_key?'OK':'Ausente'}</span></div><div class="test-item"><b>Banco D1</b><span class="status ${d.db?'green':'red'}">${d.db?'OK':'Ausente'}</span></div></div>`);
      return;
    }
    toast(result.data?.error || `${NAMES[provider]}: não foi possível iniciar a conexão (${result.status || 'sem servidor'}).`);
  }

  async function syncAndRefresh(reload = false) {
    const result = await remoteProfile();
    if (!result.ok) return result;
    if (reload) location.reload();
    else {
      close();
      toast('Status atualizado.');
      if (window.Lamou?.go) window.Lamou.go('home');
    }
    return result;
  }

  const original = window.Lamou || {};
  if (window.Lamou) {
    window.Lamou.openUser = openConnections;
    window.Lamou.connect = connect;
    window.Lamou.connectAll = () => connect('spotify');
  }

  document.addEventListener('click', event => {
    const connectBtn = event.target.closest('[data-int-connect]');
    if (connectBtn) { connect(connectBtn.dataset.intConnect); return; }
    const actionBtn = event.target.closest('[data-int-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.intAction;
    if (action === 'close' && event.target === actionBtn) close();
    else if (action === 'close') close();
    else if (action === 'login') openAuth('login');
    else if (action === 'register') openAuth('register');
    else if (action === 'submit-login') loginAndConnect(actionBtn.dataset.provider || 'spotify');
    else if (action === 'submit-register') registerAndConnect(actionBtn.dataset.provider || 'spotify');
    else if (action === 'sync') syncAndRefresh(false);
  });

  const query = new URLSearchParams(location.search);
  if (query.get('oauth') === 'spotify') {
    const status = query.get('status');
    const reason = query.get('reason') || '';
    history.replaceState({}, document.title, location.pathname + location.hash);
    if (status === 'success') {
      remoteProfile().then(result => {
        if (result.ok) {
          toast('Spotify conectado com sucesso.');
          setTimeout(() => location.reload(), 450);
        } else toast('Spotify autorizou, mas o status do perfil não pôde ser atualizado.');
      });
    } else {
      toast(`Spotify não conectou${reason ? ': ' + reason : '.'}`);
    }
  } else {
    remoteProfile().catch(() => {});
  }
})();
