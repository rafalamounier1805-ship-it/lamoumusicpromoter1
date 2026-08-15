(() => {
  'use strict';

  const STORE = 'lamou_v10_db';
  const SESSION = 'lamou_v10_session';
  const SYNC_KEY = 'lamou_v11_cloud_user';
  const PROVIDERS = {
    spotify: 'Spotify', instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube',
    facebook: 'Facebook', threads: 'Threads', amuse: 'Amuse / distribuidora'
  };
  const OAUTH_READY = new Set(['spotify']);
  let remoteUser = null;
  let lastSynced = '';
  let syncBusy = false;

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; }
    catch (_) { return {}; }
  };
  const write = data => localStorage.setItem(STORE, JSON.stringify(data));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const toast = message => {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 3000);
  };

  async function api(path, options = {}) {
    let response;
    try {
      response = await fetch(path, {
        credentials: 'include', cache: 'no-store', ...options,
        headers: {'Content-Type':'application/json', ...(options.headers || {})}
      });
    } catch (_) {
      return {ok:false,status:0,data:{error:'Sem resposta do servidor.'}};
    }
    let data = {};
    try { data = await response.json(); } catch (_) {}
    return {ok:response.ok,status:response.status,data};
  }

  function blankConnections() {
    return {spotify:'red',instagram:'red',tiktok:'red',youtube:'red',facebook:'red',threads:'red',amuse:'yellow'};
  }

  function workspaceFrom(data) {
    const profile = {...(data.profile || {})};
    if (!profile.artistName) profile.artistName = 'LAMOU';
    profile.socials = {...(profile.socials || {})};
    if (!profile.socials.tiktok) profile.socials.tiktok = '@lamourafa';
    return {
      profile,
      history: Array.isArray(data.history) ? data.history : [],
      draft: data.draft || null,
      radar: Array.isArray(data.radar) ? data.radar : [],
      webChannels: Array.isArray(data.webChannels) ? data.webChannels : [],
      ai: data.ai || {}
    };
  }

  function applyWorkspace(data, workspace) {
    if (!workspace || typeof workspace !== 'object') return data;
    data.profile = {...(data.profile || {}), ...(workspace.profile || {})};
    if (Array.isArray(workspace.history)) data.history = workspace.history;
    if ('draft' in workspace) data.draft = workspace.draft || null;
    if (Array.isArray(workspace.radar)) data.radar = workspace.radar;
    if (Array.isArray(workspace.webChannels) && workspace.webChannels.length) data.webChannels = workspace.webChannels;
    if (workspace.ai) data.ai = {...(data.ai || {}), ...workspace.ai};
    return data;
  }

  function remoteName(user) {
    return user?.display_name || user?.displayName || user?.name || user?.username || 'LAMOU';
  }

  function accountKey(user) { return `backend_${user.id}`; }

  function activateRemoteAccount(user, remoteProfile, cloudState) {
    const data = read();
    if (!data.accounts || typeof data.accounts !== 'object') data.accounts = {};
    const currentKey = data.current;
    const currentAccount = currentKey ? data.accounts[currentKey] : null;
    const key = Object.keys(data.accounts).find(k => data.accounts[k]?.backendId === user.id)
      || ((currentAccount?.localOnly || currentKey === 'lamou-local') ? currentKey : null)
      || accountKey(user);

    const localWorkspace = workspaceFrom(data);
    const serverWorkspace = cloudState && typeof cloudState === 'object' ? cloudState : null;
    const chosen = serverWorkspace && (
      (serverWorkspace.history?.length || 0) > 0 || serverWorkspace.draft || (serverWorkspace.radar?.length || 0) > 0
    ) ? serverWorkspace : {...localWorkspace, ...(serverWorkspace || {}), profile:{...localWorkspace.profile, ...(serverWorkspace?.profile || {})}};

    data.accounts[key] = {
      ...(data.accounts[key] || {}),
      name: remoteName(user), email: user.email || data.accounts[key]?.email || '',
      username: user.username || data.accounts[key]?.username || '',
      backend: true, backendId: user.id, localOnly: false,
      workspace: chosen
    };
    data.current = key;
    applyWorkspace(data, chosen);
    data.profile = {...(data.profile || {}), displayName:remoteName(user), email:user.email || data.profile?.email || ''};
    if (!data.profile.artistName) data.profile.artistName = 'LAMOU';
    data.profile.socials = {...(data.profile.socials || {})};
    if (!data.profile.socials.tiktok) data.profile.socials.tiktok = '@lamourafa';
    if (remoteProfile?.artist) {
      data.profile.artistName = remoteProfile.artist.name || data.profile.artistName;
      data.profile.artistUrl = remoteProfile.artist.url || data.profile.artistUrl || '';
      data.profile.artistImage = remoteProfile.artist.image || data.profile.artistImage || '';
      data.profile.artistStats = remoteProfile.artist.stats || data.profile.artistStats || null;
    }
    data.connections = {...blankConnections(), ...(data.connections || {}), ...(remoteProfile?.connections || {})};
    data.accounts[key].workspace = workspaceFrom(data);
    write(data);
    localStorage.setItem(SESSION, key);
    sessionStorage.setItem(SESSION, key);
    localStorage.setItem(SYNC_KEY, user.id);
    return {key, workspace:workspaceFrom(data)};
  }

  async function fetchCloudState() {
    const result = await api('/api/app-state', {method:'GET', headers:{}});
    if (!result.ok) return null;
    return result.data?.state || null;
  }

  async function pushCloudState(force = false) {
    if (!remoteUser || syncBusy) return;
    const payload = workspaceFrom(read());
    const serialized = JSON.stringify(payload);
    if (!force && serialized === lastSynced) return;
    syncBusy = true;
    try {
      const result = await api('/api/app-state', {method:'PUT', body:JSON.stringify({state:payload})});
      if (result.ok) lastSynced = serialized;
    } finally { syncBusy = false; }
  }

  async function bootstrapRemote() {
    const profile = await api('/api/profile/summary', {method:'GET', headers:{}});
    if (!profile.ok || !profile.data?.user?.id) return false;
    remoteUser = profile.data.user;
    const before = JSON.stringify(read());
    const cloudState = await fetchCloudState();
    const activated = activateRemoteAccount(remoteUser, profile.data, cloudState);
    lastSynced = JSON.stringify(activated.workspace);
    if (!cloudState) await pushCloudState(true);
    const after = JSON.stringify(read());
    if (before !== after && sessionStorage.getItem('lamou_v11_reloaded') !== remoteUser.id) {
      sessionStorage.setItem('lamou_v11_reloaded', remoteUser.id);
      location.reload();
      return true;
    }
    return true;
  }

  function authError(message) {
    const el = document.getElementById('authError');
    if (el) el.textContent = message;
    else toast(message);
  }

  async function login() {
    const identity = document.getElementById('loginUser')?.value.trim() || '';
    const password = document.getElementById('loginPass')?.value || '';
    if (!identity || !password) return authError('Informe usuário/e-mail e senha.');
    const result = await api('/api/auth/login', {method:'POST', body:JSON.stringify({identity,password})});
    if (!result.ok) return authError(result.data?.error || 'Não foi possível entrar.');
    remoteUser = result.data.user;
    const profile = await api('/api/profile/summary', {method:'GET',headers:{}});
    const cloudState = await fetchCloudState();
    const activated = activateRemoteAccount(remoteUser, profile.data || {}, cloudState);
    if (!cloudState) {
      lastSynced = '';
      await pushCloudState(true);
    } else lastSynced = JSON.stringify(activated.workspace);
    sessionStorage.setItem('lamou_v11_reloaded', remoteUser.id);
    location.reload();
  }

  async function register() {
    const displayName = document.getElementById('regName')?.value.trim() || '';
    const email = document.getElementById('regEmail')?.value.trim().toLowerCase() || '';
    const username = document.getElementById('regUser')?.value.trim() || '';
    const password = document.getElementById('regPass')?.value || '';
    const confirm = document.getElementById('regPass2')?.value || '';
    if (!displayName || !email || !username || password.length < 8) return authError('Preencha os campos e use senha com pelo menos 8 caracteres.');
    if (password !== confirm) return authError('As senhas não conferem.');
    const result = await api('/api/auth/register', {method:'POST',body:JSON.stringify({displayName,email,username,password})});
    if (!result.ok) return authError(result.data?.error || 'Não foi possível criar o acesso.');
    remoteUser = result.data.user;
    const profile = await api('/api/profile/summary', {method:'GET',headers:{}});
    activateRemoteAccount(remoteUser, profile.data || {}, null);
    await pushCloudState(true);
    sessionStorage.setItem('lamou_v11_reloaded', remoteUser.id);
    location.reload();
  }

  async function forgot() {
    const email = document.getElementById('forgotEmail')?.value.trim().toLowerCase() || '';
    if (!email) return authError('Informe o e-mail.');
    const result = await api('/api/auth/forgot', {method:'POST',body:JSON.stringify({email})});
    authError(result.ok ? (result.data?.message || 'Pedido de recuperação registrado.') : (result.data?.error || 'Não foi possível solicitar a recuperação.'));
  }

  async function logout(originalLogout) {
    await pushCloudState(true).catch(() => {});
    await api('/api/auth/logout', {method:'POST',body:'{}'}).catch(() => {});
    remoteUser = null;
    lastSynced = '';
    localStorage.removeItem(SYNC_KEY);
    sessionStorage.removeItem('lamou_v11_reloaded');
    originalLogout();
  }

  async function changePassword() {
    const currentPassword = document.getElementById('oldPass')?.value || '';
    const newPassword = document.getElementById('newPass')?.value || '';
    const confirm = document.getElementById('newPass2')?.value || '';
    const msg = document.getElementById('passMsg');
    if (newPassword.length < 8 || newPassword !== confirm) { if (msg) msg.textContent='Nova senha inválida ou confirmação diferente.'; return; }
    const result = await api('/api/auth/change-password',{method:'POST',body:JSON.stringify({currentPassword,newPassword})});
    if (msg) msg.textContent = result.ok ? 'Senha alterada e sessão protegida renovada.' : (result.data?.error || 'Não foi possível alterar a senha.');
  }

  function status(provider, value) {
    if (!OAUTH_READY.has(provider)) return ['gray','Integração em implantação'];
    return value === 'green' ? ['green','Conectado'] : value === 'yellow' ? ['yellow','Renovar'] : ['red','Não conectado'];
  }

  function openSettings() {
    const data = read();
    const p = data.profile || {};
    const c = data.connections || blankConnections();
    const cards = Object.keys(PROVIDERS).map(provider => {
      const [cls,label] = status(provider,c[provider]);
      const action = OAUTH_READY.has(provider)
        ? `<button onclick="Lamou.connect('${provider}')">${c[provider]==='green'?'Reconectar':'Conectar'}</button>`
        : `<button disabled>Em implantação</button>`;
      return `<div class="connection"><div class="row between"><b>${esc(PROVIDERS[provider])}</b><span class="status ${cls}">${label}</span></div><small>${provider==='spotify'?'OAuth oficial e tokens protegidos no servidor.':'Não será marcado como conectado sem API/autorização oficial.'}</small><div class="connection-actions">${action}</div></div>`;
    }).join('');
    document.getElementById('modalRoot').innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this)Lamou.closeModal()"><section class="modal">
      <div class="modal-head"><div><div class="eyebrow">MEU LAMOU</div><h2>${esc(p.displayName || remoteName(remoteUser) || 'LAMOU')}</h2><p class="sub">Dados e conexões carregados automaticamente neste usuário.</p></div><button class="icon-button" onclick="Lamou.closeModal()">×</button></div>
      <div class="two">
        <div class="field"><label>Nome</label><input id="v11Name" value="${esc(p.displayName || '')}"></div>
        <div class="field"><label>E-mail da conta</label><input value="${esc(p.email || remoteUser?.email || '')}" readonly></div>
        <div class="field"><label>Artista</label><input id="v11ArtistName" value="${esc(p.artistName || 'LAMOU')}"></div>
        <div class="field"><label>Perfil do artista</label><input id="v11ArtistUrl" value="${esc(p.artistUrl || '')}" placeholder="Link oficial do artista"></div>
        <div class="field"><label>Código AD</label><input id="v11AD" value="${esc(p.adCode || '')}"></div>
        <div class="field"><label>TikTok conhecido</label><input id="v11TikTok" value="${esc(p.socials?.tiktok || '@lamourafa')}"></div>
      </div>
      <div class="row" style="margin-top:12px"><button class="primary-button" onclick="LamouV11.saveProfile()">Salvar no LAMOU</button><button class="ghost-button" onclick="Lamou.changePasswordModal()">Mudar senha</button><button class="ghost-button" onclick="Lamou.connectAll()">Conectar disponíveis</button></div>
      <h3 style="margin-top:18px">Conexões</h3><div class="connection-grid" style="margin-top:9px">${cards}</div>
      <div class="notice" style="margin-top:12px">Spotify pode ficar conectado automaticamente enquanto a autorização estiver válida. As demais plataformas só serão ativadas quando houver integração oficial; o LAMOU não vai fingir conexão.</div>
    </section></div>`;
  }

  async function saveProfile() {
    const data = read();
    data.profile = data.profile || {};
    data.profile.displayName = document.getElementById('v11Name')?.value.trim() || data.profile.displayName || 'LAMOU';
    data.profile.artistName = document.getElementById('v11ArtistName')?.value.trim() || 'LAMOU';
    data.profile.artistUrl = document.getElementById('v11ArtistUrl')?.value.trim() || '';
    data.profile.adCode = document.getElementById('v11AD')?.value.trim() || '';
    data.profile.socials = {...(data.profile.socials || {}),tiktok:document.getElementById('v11TikTok')?.value.trim() || ''};
    if (data.current && data.accounts?.[data.current]) {
      data.accounts[data.current].name = data.profile.displayName;
      data.accounts[data.current].workspace = workspaceFrom(data);
    }
    write(data);
    const result = await api('/api/profile',{method:'PATCH',body:JSON.stringify({
      displayName:data.profile.displayName,artistName:data.profile.artistName,artistUrl:data.profile.artistUrl,
      adCode:data.profile.adCode,socials:data.profile.socials
    })});
    await pushCloudState(true);
    if (result.ok) { toast('Dados salvos e sincronizados.'); document.getElementById('headerUser').textContent=data.profile.displayName; }
    else toast(result.data?.error || 'Dados salvos no aparelho; servidor não respondeu.');
  }

  async function connectAll() {
    const data = read();
    if (data.connections?.spotify === 'green') return toast('Spotify já está conectado.');
    return window.Lamou.connect('spotify');
  }

  function installOverrides() {
    if (!window.Lamou || window.LamouV11Installed) return;
    window.LamouV11Installed = true;
    const original = {
      logout: window.Lamou.logout,
      openUser: window.Lamou.openUser
    };
    window.Lamou.login = login;
    window.Lamou.register = register;
    window.Lamou.forgot = forgot;
    window.Lamou.logout = () => logout(original.logout);
    window.Lamou.changePassword = changePassword;
    window.Lamou.openUser = openSettings;
    window.Lamou.connectAll = connectAll;
    window.LamouV11 = {saveProfile,openSettings,pushCloudState,bootstrapRemote};
  }

  installOverrides();
  bootstrapRemote().catch(() => {});

  setInterval(() => pushCloudState(false).catch(() => {}), 1800);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') pushCloudState(false).catch(() => {}); });
  window.addEventListener('beforeunload', () => {
    if (!remoteUser) return;
    const payload = workspaceFrom(read());
    const serialized = JSON.stringify(payload);
    if (serialized === lastSynced) return;
    try { fetch('/api/app-state',{method:'PUT',credentials:'include',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({state:payload})}); } catch (_) {}
  });
})();