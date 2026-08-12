/* LAMOU Strategy Hub v5 — compact, authorization-first, no CSV */
(() => {
  'use strict';

  const PROFILE_KEY = 'lamou_artist_profile_v5';
  const TOKEN_KEY = 'lamou_spotify_pkce_v2';
  const CLIENT_KEY = 'lamou_spotify_client_id';
  const REMEMBER_KEY = 'lamou_access_remember';
  let installPrompt = null;

  const profile = load(PROFILE_KEY, {
    spotifyUrl: '',
    verifiedArtistId: '',
    spotifyStatus: 'disconnected',
    spotifyEmail: '',
    spotifyName: '',
    lastSync: '',
    catalog: null
  });

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || '') || fallback; }
    catch (_) { return fallback; }
  }

  function saveProfile() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
  }

  function artistId(url) {
    const m = String(url || '').match(/open\.spotify\.com\/artist\/([A-Za-z0-9]+)/);
    return m ? m[1] : '';
  }

  function toastSafe(msg) {
    if (typeof window.toast === 'function') window.toast(msg);
    else alert(msg);
  }

  /* ---------- LOGIN / REMEMBER ACCESS ---------- */
  window.unlockApp = async function () {
    const input = document.getElementById('accessPassword');
    const error = document.getElementById('accessError');
    if (!input) return;
    const hash = await sha256Text(input.value);
    if (hash === ACCESS_HASH) {
      sessionStorage.setItem('lamou_access', 'ok');
      if (document.getElementById('rememberAccess')?.checked) localStorage.setItem(REMEMBER_KEY, 'ok');
      else localStorage.removeItem(REMEMBER_KEY);
      document.getElementById('accessGate')?.classList.add('hidden');
      if (error) error.textContent = '';
    } else {
      if (error) error.textContent = 'Senha incorreta.';
      input.select();
    }
  };

  window.initAccess = function () {
    if (sessionStorage.getItem('lamou_access') === 'ok' || localStorage.getItem(REMEMBER_KEY) === 'ok') {
      document.getElementById('accessGate')?.classList.add('hidden');
    }
  };

  function injectRememberAccess() {
    const card = document.querySelector('#accessGate .access-card');
    if (!card || document.getElementById('rememberAccess')) return;
    const button = card.querySelector('.btn.p');
    const label = document.createElement('label');
    label.className = 'remember-access';
    label.innerHTML = '<input id="rememberAccess" type="checkbox"> <span>Lembrar acesso neste aparelho</span>';
    card.insertBefore(label, button);
  }

  /* ---------- PWA ---------- */
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    const button = document.getElementById('installAppBtn');
    if (button) button.textContent = '📲 Instalar app';
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    const button = document.getElementById('installAppBtn');
    if (button) button.textContent = '✓ App instalado';
  });

  window.installLamouApp = async function () {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      return;
    }
    showInstallGuide();
  };

  function showInstallGuide() {
    let modal = document.getElementById('installGuide');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'installGuide';
      modal.className = 'install-guide';
      modal.innerHTML = `
        <div class="install-sheet">
          <button class="install-x" onclick="document.getElementById('installGuide').classList.remove('on')">×</button>
          <h3>📲 Instalar LAMOU</h3>
          <p>No Android, abra esta página no <b>Chrome</b>.</p>
          <ol>
            <li>Toque em <b>⋮</b>.</li>
            <li>Escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</li>
            <li>Confirme <b>Instalar</b>.</li>
          </ol>
        </div>`;
      document.body.appendChild(modal);
    }
    modal.classList.add('on');
  }

  function injectHeaderButtons() {
    const row = document.querySelector('.top .row');
    if (!row) return;
    if (!document.getElementById('installAppBtn')) {
      const b = document.createElement('button');
      b.id = 'installAppBtn';
      b.textContent = '📲 Instalar app';
      b.onclick = window.installLamouApp;
      row.prepend(b);
    }
  }

  /* ---------- SPOTIFY PKCE ---------- */
  function token() { return load(TOKEN_KEY, null); }
  function saveToken(value) { localStorage.setItem(TOKEN_KEY, JSON.stringify(value)); }

  function randomString(length = 64) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => (b % 36).toString(36)).join('');
  }

  async function base64urlSha256(text) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  async function getAccessToken() {
    let t = token();
    if (!t) return '';
    if (Date.now() < (t.expiresAt || 0) - 60000) return t.access_token || '';
    if (!t.refresh_token) return '';
    const clientId = localStorage.getItem(CLIENT_KEY) || '';
    if (!clientId) return '';

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: t.refresh_token,
      client_id: clientId
    });
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!res.ok) return '';
    const next = await res.json();
    t = {
      ...t,
      ...next,
      refresh_token: next.refresh_token || t.refresh_token,
      expiresAt: Date.now() + (next.expires_in || 3600) * 1000
    };
    saveToken(t);
    return t.access_token || '';
  }

  async function spotifyFetch(path) {
    const access = await getAccessToken();
    if (!access) throw new Error('auth');
    const res = await fetch('https://api.spotify.com/v1' + path, {
      headers: { Authorization: 'Bearer ' + access }
    });
    if (!res.ok) throw new Error('spotify-' + res.status);
    return res.json();
  }

  window.saveSpotifyClientId = function () {
    const value = document.getElementById('spotifyClientId')?.value.trim();
    if (!value) return toastSafe('Informe o Client ID do Spotify.');
    localStorage.setItem(CLIENT_KEY, value);
    document.getElementById('spotifyConfig')?.classList.remove('on');
    toastSafe('Configuração do Spotify salva neste aparelho.');
  };

  window.startSpotifyAuth = async function () {
    const url = document.getElementById('artistSpotifyUrl')?.value.trim() || profile.spotifyUrl;
    const id = artistId(url);
    if (!id) return toastSafe('Cole primeiro um link válido do perfil do artista no Spotify.');

    profile.spotifyUrl = url;
    saveProfile();

    const clientId = localStorage.getItem(CLIENT_KEY) || '';
    if (!clientId) {
      document.getElementById('spotifyConfig')?.classList.add('on');
      return toastSafe('Informe uma vez o Client ID do Spotify Developer.');
    }

    const verifier = randomString(72);
    const challenge = await base64urlSha256(verifier);
    const state = randomString(24);
    const redirect = location.origin + location.pathname;

    sessionStorage.setItem('lamou_spotify_verifier', verifier);
    sessionStorage.setItem('lamou_spotify_state', state);
    sessionStorage.setItem('lamou_pending_artist', id);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirect,
      scope: 'user-read-email user-read-private',
      code_challenge_method: 'S256',
      code_challenge: challenge,
      state
    });
    location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
  };

  async function handleSpotifyCallback() {
    const current = new URL(location.href);
    const code = current.searchParams.get('code');
    if (!code) return;

    const state = current.searchParams.get('state');
    const expected = sessionStorage.getItem('lamou_spotify_state');
    const verifier = sessionStorage.getItem('lamou_spotify_verifier');
    const clientId = localStorage.getItem(CLIENT_KEY) || '';
    if (!state || state !== expected || !verifier || !clientId) return;

    try {
      const redirect = location.origin + location.pathname;
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect,
        client_id: clientId,
        code_verifier: verifier
      });
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (!res.ok) throw new Error('token');
      const t = await res.json();
      saveToken({ ...t, expiresAt: Date.now() + (t.expires_in || 3600) * 1000 });
      const me = await spotifyFetch('/me');
      profile.spotifyEmail = me.email || '';
      profile.spotifyName = me.display_name || '';
      profile.spotifyStatus = 'authorized';
      profile.verifiedArtistId = sessionStorage.getItem('lamou_pending_artist') || artistId(profile.spotifyUrl);
      saveProfile();
      history.replaceState({}, '', location.pathname);
      await window.syncSpotifyProfile(true);
    } catch (_) {
      profile.spotifyStatus = 'error';
      saveProfile();
      renderConnection();
      toastSafe('Falha ao concluir a autorização do Spotify.');
    }
  }

  window.artistLinkChanged = function () {
    const value = document.getElementById('artistSpotifyUrl')?.value.trim() || '';
    profile.spotifyUrl = value;
    const id = artistId(value);
    if (!id) profile.spotifyStatus = 'disconnected';
    else if (id !== profile.verifiedArtistId) profile.spotifyStatus = token() ? 'needs-confirmation' : 'disconnected';
    else if (token()) profile.spotifyStatus = 'verified';
    saveProfile();
    renderConnection();
  };

  window.confirmArtistProfile = async function () {
    const value = document.getElementById('artistSpotifyUrl')?.value.trim() || '';
    const id = artistId(value);
    if (!id) return toastSafe('Cole um perfil válido do Spotify.');
    if (!token()) return window.startSpotifyAuth();
    profile.spotifyUrl = value;
    profile.verifiedArtistId = id;
    profile.spotifyStatus = 'authorized';
    saveProfile();
    renderConnection();
    await window.syncSpotifyProfile(true);
  };

  window.syncSpotifyProfile = async function (manual = false) {
    const id = artistId(profile.spotifyUrl);
    if (!id) return manual && toastSafe('Cole um perfil válido do artista.');
    if (id !== profile.verifiedArtistId) return manual && toastSafe('Confirme primeiro este perfil.');
    if (!token()) return manual && window.startSpotifyAuth();

    setSync('Sincronizando…', 'yellow');
    try {
      const artist = await spotifyFetch('/artists/' + id);
      let next = '/artists/' + id + '/albums?include_groups=album,single,compilation&limit=50';
      const releases = [];
      for (let page = 0; page < 6 && next; page++) {
        const data = await spotifyFetch(next.startsWith('http') ? next.replace('https://api.spotify.com/v1', '') : next);
        releases.push(...(data.items || []));
        next = data.next || '';
      }
      const uniq = [...new Map(releases.map(item => [item.id, item])).values()];
      profile.catalog = {
        artist: artist.name || 'Artista',
        image: artist.images?.[0]?.url || '',
        genres: artist.genres || [],
        albums: uniq.filter(x => x.album_type === 'album').length,
        singles: uniq.filter(x => x.album_type === 'single').length,
        compilations: uniq.filter(x => x.album_type === 'compilation').length,
        tracks: uniq.reduce((sum, x) => sum + (Number(x.total_tracks) || 0), 0),
        recent: [...uniq].sort((a, b) => String(b.release_date || '').localeCompare(String(a.release_date || ''))).slice(0, 8)
      };
      profile.spotifyStatus = 'verified';
      profile.lastSync = new Date().toISOString();
      saveProfile();
      renderConnection();
      renderCatalog();
      setSync('Sincronizado', 'green');
      if (manual) toastSafe('Perfil Spotify sincronizado.');
    } catch (_) {
      profile.spotifyStatus = 'error';
      saveProfile();
      renderConnection();
      setSync('Erro ao sincronizar', 'red');
      if (manual) toastSafe('Não foi possível sincronizar o Spotify.');
    }
  };

  function setSync(text, color) {
    const el = document.getElementById('spotifySyncState');
    if (!el) return;
    el.className = 'status ' + color;
    el.textContent = text;
  }

  /* ---------- STRATEGIC HUB ---------- */
  window.toggleStrategyPanel = function (id, button) {
    const panel = document.getElementById(id);
    if (!panel) return;
    const opening = !panel.classList.contains('on');
    document.querySelectorAll('.strategy-panel').forEach(x => x.classList.remove('on'));
    document.querySelectorAll('.strategy-btn').forEach(x => x.classList.remove('on'));
    if (opening) {
      panel.classList.add('on');
      button?.classList.add('on');
    }
  };

  function injectHub() {
    const main = document.querySelector('main.grid');
    if (!main || document.getElementById('strategyHub')) return;
    const first = main.querySelector('.card');
    const hub = document.createElement('section');
    hub.id = 'strategyHub';
    hub.className = 'card strategy-hub';
    hub.innerHTML = `
      <div class="strategy-head">
        <div><small>ANTES DO ITEM 1</small><h2>Central estratégica do artista</h2><p class="sub">Escolha um módulo. O perfil autorizado fica salvo neste aparelho.</p></div>
        <span class="status ai-rank">LAMOU Intelligence</span>
      </div>
      <div class="strategy-buttons">
        <button class="strategy-btn" onclick="toggleStrategyPanel('artistProfilePanel',this)">👤<b>Perfil do artista</b><small>Spotify + autorização</small></button>
        <button class="strategy-btn" onclick="toggleStrategyPanel('promotePanel',this)">🎯<b>Qual música divulgar?</b><small>Recomendação do catálogo</small></button>
        <button class="strategy-btn" onclick="toggleStrategyPanel('worldTopPanel',this)">🏆<b>Top 10 IA Mundial</b><small>Análise técnica por estilo</small></button>
      </div>

      <div id="artistProfilePanel" class="strategy-panel">
        <div class="strategy-title"><h3>👤 Perfil do artista / compositor</h3><span id="spotifySyncState" class="status gray">Aguardando</span></div>
        <div class="connection-card">
          <div class="provider-line"><b>Spotify</b><span id="spotifyConnectionBadge" class="status red">Não autorizado</span></div>
          <div class="field"><label>Link do perfil do artista</label><input id="artistSpotifyUrl" value="${esc(profile.spotifyUrl)}" placeholder="https://open.spotify.com/artist/..." oninput="artistLinkChanged()"></div>
          <div id="spotifyIdentity" class="identity-line"></div>
          <div class="row" style="margin-top:10px">
            <button class="btn p" onclick="startSpotifyAuth()">Autorizar Spotify</button>
            <button class="btn" onclick="confirmArtistProfile()">Confirmar este perfil</button>
            <button class="btn" onclick="syncSpotifyProfile(true)">↻ Sincronizar</button>
          </div>
          <div id="spotifyConfig" class="spotify-config">
            <div class="field"><label>Spotify Client ID</label><input id="spotifyClientId" value="${esc(localStorage.getItem(CLIENT_KEY) || '')}" placeholder="Client ID do Spotify Developer"></div>
            <button class="btn" onclick="saveSpotifyClientId()">Salvar configuração</button>
          </div>
        </div>
        <div id="artistCatalog" class="catalog-box"></div>
        <div class="notice"><b>Sem CSV.</b> O catálogo é puxado por link + autorização. Se você trocar o perfil, o status volta para vermelho até confirmar novamente.</div>
      </div>

      <div id="promotePanel" class="strategy-panel">
        <div class="strategy-title"><h3>🎯 Qual música devo divulgar?</h3><span class="status green">LAMOU Match</span></div>
        <div class="field"><label>Objetivo</label><select id="promotionGoal"><option value="new">Impulsionar lançamento recente</option><option value="catalog">Trabalhar catálogo</option><option value="ai">Competir em ranking de IA</option></select></div>
        <div class="row" style="margin-top:10px"><button class="btn p" onclick="recommendPromotionV5()">✨ Analisar agora</button></div>
        <div id="promotionAdvice" class="promotion-advice"><div class="notice">Autorize e sincronize seu perfil para receber a recomendação.</div></div>
      </div>

      <div id="worldTopPanel" class="strategy-panel">
        <div class="strategy-title"><h3>🏆 Top 10 IA Mundial</h3><span class="status ai-rank">Análise técnica</span></div>
        <p class="sub">Sem reviews, curtidas ou votos. A avaliação considera características do áudio.</p>
        <div class="two">
          <div class="field"><label>Estilo</label><select id="techStyle"><option>Livre</option><option>Pop</option><option>Gospel</option><option>Funk BH</option><option>Pagode / Samba</option><option>Rock</option><option>Forró / Sertanejo</option><option>Eletrônica</option><option>Rap / Hip Hop</option><option>R&B / Soul</option><option>Latino</option></select></div>
          <div class="field"><label>Áudios para comparar</label><input type="file" accept="audio/*" multiple onchange="analyseTop10(event)"></div>
        </div>
        <div id="technicalRanking" class="technical-ranking"><div class="notice">Envie os áudios candidatos para gerar o ranking técnico.</div></div>
      </div>`;
    main.insertBefore(hub, first);
    renderConnection();
    renderCatalog();
  }

  function renderConnection() {
    const badge = document.getElementById('spotifyConnectionBadge');
    const identity = document.getElementById('spotifyIdentity');
    if (!badge || !identity) return;

    const currentId = artistId(profile.spotifyUrl);
    let cls = 'red';
    let text = 'Não autorizado';
    if (profile.spotifyStatus === 'verified' && currentId && currentId === profile.verifiedArtistId) {
      cls = 'green'; text = '✓ Verificado';
    } else if (profile.spotifyStatus === 'authorized') {
      cls = 'yellow'; text = 'Autorizado — confirmar perfil';
    } else if (profile.spotifyStatus === 'needs-confirmation') {
      cls = 'red'; text = 'Perfil novo — confirmar';
    } else if (profile.spotifyStatus === 'error') {
      cls = 'red'; text = 'Erro de conexão';
    }
    badge.className = 'status ' + cls;
    badge.textContent = text;
    identity.innerHTML = profile.spotifyEmail
      ? `<span class="status green">✓ Conta autorizada</span> <b>${esc(profile.spotifyEmail)}</b>${profile.spotifyName ? ' • ' + esc(profile.spotifyName) : ''}`
      : '<span class="status red">Conta Spotify ainda não autorizada</span>';
  }

  function renderCatalog() {
    const box = document.getElementById('artistCatalog');
    if (!box) return;
    const c = profile.catalog;
    if (!c) {
      box.innerHTML = '<div class="notice">Depois da autorização, o catálogo aparecerá aqui automaticamente.</div>';
      return;
    }
    box.innerHTML = `
      <div class="catalog-head">${c.image ? `<img src="${esc(c.image)}" alt="">` : ''}<div><h3>${esc(c.artist)}</h3><small>Última sincronização: ${profile.lastSync ? new Date(profile.lastSync).toLocaleString('pt-BR') : '—'}</small></div></div>
      <div class="profile-stats">
        <div class="stat"><b>${c.albums}</b><small>Álbuns</small></div>
        <div class="stat"><b>${c.singles}</b><small>Singles</small></div>
        <div class="stat"><b>${c.tracks}</b><small>Faixas no catálogo</small></div>
        <div class="stat"><b>${c.compilations}</b><small>Compilações</small></div>
      </div>
      <div class="release-list">${(c.recent || []).map((x, i) => `<div><b>${i + 1}. ${esc(x.name)}</b><small>${esc(x.release_date || '')} • ${esc(x.album_type || '')}</small></div>`).join('')}</div>`;
  }

  window.recommendPromotionV5 = function () {
    const out = document.getElementById('promotionAdvice');
    const c = profile.catalog;
    if (!out) return;
    if (!c || !c.recent?.length) {
      out.innerHTML = '<div class="notice warn">Sincronize primeiro o catálogo do artista.</div>';
      return;
    }
    const goal = document.getElementById('promotionGoal')?.value || 'new';
    const items = c.recent.slice(0, 3);
    const reason = goal === 'ai' ? 'prioridade para análise técnica e canais de IA' : goal === 'catalog' ? 'boa candidata para reativar o catálogo' : 'lançamento mais recente disponível';
    out.innerHTML = items.map((x, i) => `<div class="recommend-card"><b>${['🥇','🥈','🥉'][i]} ${esc(x.name)}</b><small>${reason} • ${esc(x.release_date || '')}</small></div>`).join('');
  };

  window.analyseTop10 = async function (event) {
    const files = Array.from(event.target.files || []).slice(0, 10);
    const out = document.getElementById('technicalRanking');
    if (!out || !files.length) return;
    out.innerHTML = '<div class="notice">Analisando os áudios no aparelho…</div>';
    const results = [];
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (const file of files) {
      try {
        const buffer = await ctx.decodeAudioData(await file.arrayBuffer());
        const data = buffer.getChannelData(0);
        let sum = 0, peak = 0, changes = 0, prev = 0;
        const step = Math.max(1, Math.floor(data.length / 50000));
        for (let i = 0; i < data.length; i += step) {
          const v = Math.abs(data[i]);
          sum += v * v;
          if (v > peak) peak = v;
          if ((data[i] >= 0) !== (prev >= 0)) changes++;
          prev = data[i];
        }
        const n = Math.ceil(data.length / step);
        const rms = Math.sqrt(sum / Math.max(1, n));
        const durationScore = Math.max(0, 100 - Math.abs(buffer.duration - 180) / 2);
        const production = Math.min(100, rms * 420 + peak * 35);
        const dynamics = Math.min(100, (peak - rms) * 180 + 45);
        const texture = Math.min(100, changes / Math.max(1, n) * 1000 + 35);
        const score = Math.round(production * .35 + dynamics * .25 + texture * .2 + durationScore * .2);
        results.push({ name: file.name, score, production: Math.round(production), dynamics: Math.round(dynamics), texture: Math.round(texture) });
      } catch (_) {
        results.push({ name: file.name, score: 0, error: true });
      }
    }
    await ctx.close();
    results.sort((a, b) => b.score - a.score);
    out.innerHTML = results.map((r, i) => `<div class="tech-row"><b>${i + 1}º ${esc(r.name)}</b><span>${r.error ? 'Erro no áudio' : r.score + '/100'}</span>${r.error ? '' : `<small>Produção ${r.production} • Dinâmica ${r.dynamics} • Textura ${r.texture}</small>`}</div>`).join('');
  };

  function injectStyles() {
    if (document.getElementById('strategyV5Styles')) return;
    const style = document.createElement('style');
    style.id = 'strategyV5Styles';
    style.textContent = `
      .remember-access{display:flex;gap:8px;align-items:center;margin:2px 0 12px;color:#d9ddea;font-size:.86rem}.remember-access input{width:auto}
      .strategy-hub{background:linear-gradient(145deg,#f5fbff,#eef7ff)!important;border-color:#cfe4f5!important}.strategy-head,.strategy-title,.provider-line{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.strategy-head>div>small{color:#4d78a5;font-weight:800;letter-spacing:.08em}
      .strategy-buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.strategy-btn{border:1px solid #d9e5ee;background:#fff;border-radius:16px;padding:15px;text-align:left}.strategy-btn b,.strategy-btn small{display:block}.strategy-btn b{margin:6px 0 3px}.strategy-btn small{color:var(--muted)}.strategy-btn.on{background:#eaf5ff;border-color:#80b9e3}
      .strategy-panel{display:none;margin-top:14px;padding:16px;border:1px solid #d9e5ee;background:#fff;border-radius:16px}.strategy-panel.on{display:block}.connection-card{padding:14px;border:1px solid var(--line);border-radius:15px;background:#fcfdff}.identity-line{margin:10px 0}.spotify-config{display:none;margin-top:10px;padding:12px;border-radius:12px;background:#fff8e8;border:1px solid #f0dca9}.spotify-config.on{display:block}
      .catalog-box{margin-top:12px}.catalog-head{display:flex;gap:12px;align-items:center}.catalog-head img{width:62px;height:62px;border-radius:14px;object-fit:cover}.profile-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}.release-list{display:grid;gap:7px;margin-top:12px}.release-list>div,.recommend-card,.tech-row{border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff}.release-list small,.recommend-card small,.tech-row small{display:block;color:var(--muted)}.promotion-advice,.technical-ranking{display:grid;gap:8px;margin-top:12px}.tech-row{display:grid;grid-template-columns:1fr auto;gap:4px 10px}.tech-row small{grid-column:1/-1}
      .install-guide{position:fixed;inset:0;z-index:10000;display:none;place-items:end center;background:#0005;padding:16px}.install-guide.on{display:grid}.install-sheet{position:relative;width:min(520px,100%);background:white;border-radius:22px;padding:22px;box-shadow:0 20px 60px #0004}.install-x{position:absolute;right:12px;top:10px;border:0;background:#f1f2f5;border-radius:50%;width:34px;height:34px;font-size:20px}
      .finalize-card{background:linear-gradient(145deg,#f4faff,#e9f5ff)!important;color:#152238!important;border-color:#cfe6fb!important}.finalize-card .sub{color:#60728a!important}.finalize-card .final-check{color:#23364d;background:#ffffffaa;border-color:#cfe0ef}.finalize-card .final-stamp{background:#ffffffb8;color:#31465d}.finalize-card .notice.warn{background:#fff9e8;color:#795b17}.finalize-card .btn.publish-final{background:linear-gradient(135deg,#5c7cf2,#6c63ef)!important;color:#fff!important}
      @media(max-width:760px){.strategy-buttons,.profile-stats{grid-template-columns:1fr}.strategy-panel{padding:13px}}
    `;
    document.head.appendChild(style);
  }

  async function init() {
    injectStyles();
    injectRememberAccess();
    injectHeaderButtons();
    injectHub();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
    renderConnection();
    renderCatalog();
    await handleSpotifyCallback();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
