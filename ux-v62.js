/* LAMOU Music Promoter — UX v6.2
   Header Test Center + diagnostic history + simplified known-user flow.
*/
(() => {
  'use strict';

  const VERSION = '6.2.0';
  const TEST_HISTORY_KEY = 'lamou_test_history_v62';
  const USERS_KEY = 'lamou_users_v6';
  const ACTIVE_USER_KEY = 'lamou_active_user_v6';
  const CLIENT_KEY = 'lamou_spotify_client_id';
  const SPOTIFY_CLIENT_ID = '8a9c328f33b14bad9b48473d238925fc';
  const AI_ENDPOINT = '/api/ai';
  const LAMOU_SPOTIFY_USER_ID = '31i5b3kg7i6mlhfgbvsc53ab6rlm';
  const LAMOU_SPOTIFY_PROFILE = 'https://open.spotify.com/user/31i5b3kg7i6mlhfgbvsc53ab6rlm';

  const load = (key, fallback) => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (_) { return fallback; }
  };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function ensureKnownLamou() {
    let users = load(USERS_KEY, []);
    let lamou = users.find(u => String(u.name || '').trim().toUpperCase() === 'LAMOU');
    if (!lamou) {
      lamou = {
        id: 'user_lamou_primary',
        name: 'LAMOU',
        spotifyUserId: LAMOU_SPOTIFY_USER_ID,
        spotifyProfile: LAMOU_SPOTIFY_PROFILE,
        createdAt: new Date().toISOString(),
        projects: []
      };
      users.unshift(lamou);
    } else {
      lamou.spotifyUserId = LAMOU_SPOTIFY_USER_ID;
      lamou.spotifyProfile = LAMOU_SPOTIFY_PROFILE;
    }
    save(USERS_KEY, users);
    if (!localStorage.getItem(ACTIVE_USER_KEY)) localStorage.setItem(ACTIVE_USER_KEY, lamou.id);
  }

  function activeUser() {
    const id = localStorage.getItem(ACTIVE_USER_KEY) || '';
    return load(USERS_KEY, []).find(u => u.id === id) || null;
  }

  function syncKnownUserUI() {
    const user = activeUser();
    if (!user) return;
    const isLamou = String(user.name || '').trim().toUpperCase() === 'LAMOU';
    const meta = document.getElementById('lamouUserMeta');
    if (meta && isLamou) meta.textContent = `Perfil LAMOU carregado automaticamente • Spotify ID ${LAMOU_SPOTIFY_USER_ID}`;

    // The known LAMOU profile does not need editing prompts on the main screen.
    const edit = document.getElementById('lamouEditUser');
    if (edit) edit.style.display = isLamou ? 'none' : '';

    // Keep the Strategy Hub user field synchronized when it can use the saved profile.
    const strategyInput = document.getElementById('artistSpotifyUrl');
    if (strategyInput && !strategyInput.value && user.spotifyProfile) strategyInput.value = user.spotifyProfile;
  }

  function simplifyManager() {
    const manager = document.getElementById('lamouManager');
    if (!manager) return;

    const oldTest = document.getElementById('lamouRunTest');
    if (oldTest) oldTest.style.display = 'none';
    const oldResults = document.getElementById('lamouTestResults');
    if (oldResults) oldResults.style.display = 'none';

    const diag = document.getElementById('lamouDiag');
    if (diag) diag.innerHTML = '<span class="diag-dot ok"></span>Sistema pronto';

    const select = document.getElementById('lamouUserSelect');
    if (select && !select.dataset.v62) {
      select.dataset.v62 = '1';
      select.addEventListener('change', () => setTimeout(syncKnownUserUI, 80));
    }
    syncKnownUserUI();
  }

  function injectHeaderTestButton() {
    const row = document.querySelector('.top .row');
    if (!row || document.getElementById('lamouHeaderTest')) return;
    const button = document.createElement('button');
    button.id = 'lamouHeaderTest';
    button.textContent = '🧪 Teste';
    button.onclick = openTestCenter;
    row.appendChild(button);
  }

  function injectStyles() {
    if (document.getElementById('lamouV62Styles')) return;
    const style = document.createElement('style');
    style.id = 'lamouV62Styles';
    style.textContent = `
      .lamou-test-modal{position:fixed;inset:0;z-index:20000;display:none;place-items:center;background:#0b1020aa;padding:16px;backdrop-filter:blur(5px)}
      .lamou-test-modal.on{display:grid}.lamou-test-sheet{width:min(850px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:22px;box-shadow:0 28px 90px #0006;padding:20px;color:#182033}
      .lamou-test-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;position:sticky;top:-20px;background:#fff;padding:4px 0 12px;z-index:2;border-bottom:1px solid #e5e8ef}.lamou-test-head h2{margin:0}.lamou-test-head p{margin:4px 0 0;color:#687080}
      .lamou-test-close{border:0;background:#f1f3f7;border-radius:50%;width:38px;height:38px;font-size:22px;cursor:pointer}.lamou-test-actions{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
      .lamou-test-summary{padding:13px;border-radius:14px;margin:12px 0}.lamou-test-summary.ok{background:#eaf8f0}.lamou-test-summary.warn{background:#fff7df}.lamou-test-summary.fail{background:#fff0f0}.lamou-test-summary b,.lamou-test-summary small{display:block}
      .lamou-test-list{display:grid;gap:7px}.lamou-test-row{display:grid;grid-template-columns:28px 1fr;gap:9px;padding:9px 10px;border:1px solid #e5e7ee;border-radius:11px}.lamou-test-row small{display:block;color:#687080}.lamou-test-icon{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-weight:900}.lamou-test-icon.ok{background:#dff5e9;color:#167049}.lamou-test-icon.warn{background:#fff0c7;color:#926600}.lamou-test-icon.fail{background:#ffe0e0;color:#a22}
      .lamou-test-history{margin-top:18px;padding-top:15px;border-top:1px solid #e2e5eb}.lamou-test-history h3{margin:0 0 9px}.lamou-history-item{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid #e5e7ee;border-radius:11px;padding:9px 10px;margin-bottom:7px}.lamou-history-item small{display:block;color:#687080}.lamou-history-badge{white-space:nowrap;font-weight:800}.lamou-history-badge.ok{color:#167049}.lamou-history-badge.warn{color:#9a6b00}.lamou-history-badge.fail{color:#a22}
      @media(max-width:650px){.lamou-test-sheet{padding:15px}.lamou-test-head{top:-15px}.lamou-history-item{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(style);
  }

  function injectTestModal() {
    if (document.getElementById('lamouTestModal')) return;
    const modal = document.createElement('div');
    modal.id = 'lamouTestModal';
    modal.className = 'lamou-test-modal';
    modal.innerHTML = `
      <div class="lamou-test-sheet" role="dialog" aria-modal="true" aria-labelledby="lamouTestTitle">
        <div class="lamou-test-head">
          <div><h2 id="lamouTestTitle">🧪 Central de Testes</h2><p>Diagnóstico do LAMOU sem apagar, alterar ou publicar conteúdo.</p></div>
          <button class="lamou-test-close" id="lamouTestClose" aria-label="Fechar">×</button>
        </div>
        <div class="lamou-test-actions">
          <button class="btn p" id="lamouRunNewTest">▶ Rodar novo teste</button>
          <button class="btn" id="lamouSaveTest" disabled>💾 Salvar resultado</button>
          <button class="btn" id="lamouEmailTest" disabled>✉️ Mandar por e-mail</button>
          <button class="btn" id="lamouCloseTest">Fechar</button>
        </div>
        <div id="lamouPopupTestResult"><div class="notice">Clique em <b>Rodar novo teste</b> para verificar o sistema.</div></div>
        <div class="lamou-test-history"><h3>Histórico dos últimos testes</h3><div id="lamouTestHistory"></div></div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('lamouTestClose').onclick = closeTestCenter;
    document.getElementById('lamouCloseTest').onclick = closeTestCenter;
    document.getElementById('lamouRunNewTest').onclick = runSystemTestV62;
    document.getElementById('lamouSaveTest').onclick = saveDiagnosticFile;
    document.getElementById('lamouEmailTest').onclick = emailDiagnostic;
    modal.addEventListener('click', e => { if (e.target === modal) closeTestCenter(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('on')) closeTestCenter(); });
  }

  function openTestCenter() {
    const modal = document.getElementById('lamouTestModal');
    if (!modal) return;
    modal.classList.add('on');
    renderTestHistory();
  }
  function closeTestCenter() { document.getElementById('lamouTestModal')?.classList.remove('on'); }

  function result(name, status, detail) { return {name, status, detail}; }
  async function withTimeout(promise, ms=5000) {
    let timer;
    try { return await Promise.race([promise, new Promise((_, reject) => timer = setTimeout(() => reject(new Error('timeout')), ms))]); }
    finally { clearTimeout(timer); }
  }

  async function aiHealth() {
    try {
      const res = await withTimeout(fetch(AI_ENDPOINT + '/health', {headers:{Accept:'application/json'}, cache:'no-store'}), 4500);
      if (!res.ok) return {online:false,status:res.status};
      const data = await res.json().catch(() => ({}));
      return {online:true,...data};
    } catch (_) { return {online:false}; }
  }

  async function runSystemTestV62() {
    const button = document.getElementById('lamouRunNewTest');
    const out = document.getElementById('lamouPopupTestResult');
    button.disabled = true; button.textContent = '⏳ Testando…';
    out.innerHTML = '<div class="notice">Verificando funções, integrações e armazenamento…</div>';

    const results = [];
    const requiredFunctions = ['loadSpotify','analyseAudio','makeCopy','buildCampaign','filterChannels','tracked','renderHistory','createQuick','shareNow','prepareExternal'];
    requiredFunctions.forEach(fn => results.push(result('Função ' + fn, typeof window[fn] === 'function' ? 'ok' : 'fail', typeof window[fn] === 'function' ? 'carregada' : 'não encontrada')));

    ['spotify','genre','channels','history','analytics','strategyHub','lamouManager'].forEach(id => {
      const ok = !!document.getElementById(id);
      results.push(result('Tela #' + id, ok ? 'ok' : 'fail', ok ? 'presente' : 'elemento ausente'));
    });

    try { const k='lamou_test_'+Date.now(); localStorage.setItem(k,'ok'); const ok=localStorage.getItem(k)==='ok'; localStorage.removeItem(k); results.push(result('Armazenamento local',ok?'ok':'fail',ok?'leitura e gravação OK':'falhou')); }
    catch (_) { results.push(result('Armazenamento local','fail','bloqueado pelo navegador')); }

    try { const k='lamou_test_session'; sessionStorage.setItem(k,'ok'); const ok=sessionStorage.getItem(k)==='ok'; sessionStorage.removeItem(k); results.push(result('Sessão',ok?'ok':'fail',ok?'OK':'falhou')); }
    catch (_) { results.push(result('Sessão','fail','indisponível')); }

    results.push(result('HTTPS / criptografia', window.isSecureContext && !!crypto?.subtle ? 'ok' : 'fail', window.isSecureContext ? 'contexto seguro' : 'HTTPS não confirmado'));
    results.push(result('Áudio no navegador', (window.AudioContext||window.webkitAudioContext) ? 'ok' : 'fail', (window.AudioContext||window.webkitAudioContext) ? 'AudioContext disponível' : 'não suportado'));
    results.push(result('Spotify configurado', localStorage.getItem(CLIENT_KEY)===SPOTIFY_CLIENT_ID ? 'ok' : 'fail', localStorage.getItem(CLIENT_KEY) ? 'Client ID presente' : 'Client ID ausente'));

    const user = activeUser();
    results.push(result('Usuário ativo', user ? 'ok':'fail', user ? user.name : 'nenhum usuário'));
    results.push(result('Perfil LAMOU conhecido', load(USERS_KEY,[]).some(u=>String(u.name||'').toUpperCase()==='LAMOU'&&u.spotifyUserId===LAMOU_SPOTIFY_USER_ID) ? 'ok':'warn', 'dados padrão disponíveis'));
    results.push(result('Projeto ativo', localStorage.getItem('lamou_active_project_v6') ? 'ok':'fail', localStorage.getItem('lamou_active_project_v6') ? 'definido':'não definido'));
    results.push(result('Service Worker', 'serviceWorker' in navigator ? 'ok':'warn', 'serviceWorker' in navigator ? 'suportado':'não suportado neste navegador'));
    results.push(result('Compartilhamento nativo', navigator.share ? 'ok':'warn', navigator.share ? 'disponível':'opcional neste navegador'));

    try { const res = await withTimeout(fetch(location.href,{method:'GET',cache:'no-store'}),5000); results.push(result('Aplicativo / servidor',res.ok?'ok':'fail','HTTP '+res.status)); }
    catch (_) { results.push(result('Aplicativo / servidor','fail','sem resposta')); }

    const ai = await aiHealth();
    results.push(result('Workers AI', ai.online ? 'ok':'warn', ai.online ? 'backend de IA respondeu':'IA local disponível; backend Workers AI não respondeu'));

    const fails=results.filter(r=>r.status==='fail').length;
    const warns=results.filter(r=>r.status==='warn').length;
    const oks=results.filter(r=>r.status==='ok').length;
    const overall=fails?'fail':warns?'warn':'ok';
    const label=fails?`${fails} falha(s) encontrada(s)`:warns?`Funções essenciais OK • ${warns} aviso(s)`:'Tudo funcionando';
    const diagnostic={id:'test_'+Date.now(),version:VERSION,date:new Date().toISOString(),time:new Date().toLocaleString('pt-BR'),overall,label,oks,warns,fails,results};
    window.__lamouDiagnosticV62 = diagnostic;

    const history=load(TEST_HISTORY_KEY,[]);
    history.unshift(diagnostic);
    save(TEST_HISTORY_KEY,history.slice(0,20));

    out.innerHTML = `<div class="lamou-test-summary ${overall}"><b>${overall==='ok'?'✅':overall==='warn'?'⚠️':'❌'} ${esc(label)}</b><small>${oks} OK • ${warns} avisos • ${fails} falhas • ${esc(diagnostic.time)}</small></div><div class="lamou-test-list">${results.map(r=>`<div class="lamou-test-row"><span class="lamou-test-icon ${r.status}">${r.status==='ok'?'✓':r.status==='warn'?'!':'×'}</span><div><b>${esc(r.name)}</b><small>${esc(r.detail)}</small></div></div>`).join('')}</div>`;
    document.getElementById('lamouSaveTest').disabled=false;
    document.getElementById('lamouEmailTest').disabled=false;
    button.disabled=false; button.textContent='↻ Rodar novo teste';
    renderTestHistory();
  }

  function diagnosticText(d) {
    return [`LAMOU Music Promoter v${d.version}`,`Teste: ${d.time}`,`Status: ${d.label}`,`${d.oks} OK | ${d.warns} avisos | ${d.fails} falhas`,'',...d.results.map(r=>`[${r.status.toUpperCase()}] ${r.name}: ${r.detail}`)].join('\n');
  }

  function saveDiagnosticFile() {
    const d=window.__lamouDiagnosticV62;
    if (!d) return;
    const blob=new Blob([diagnosticText(d)],{type:'text/plain;charset=utf-8'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`lamou-teste-${d.date.slice(0,19).replace(/[:T]/g,'-')}.txt`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function emailDiagnostic() {
    const d=window.__lamouDiagnosticV62;
    if (!d) return;
    const subject=encodeURIComponent(`LAMOU — resultado do teste ${d.time}`);
    const body=encodeURIComponent(diagnosticText(d));
    location.href=`mailto:?subject=${subject}&body=${body}`;
  }

  function renderTestHistory() {
    const box=document.getElementById('lamouTestHistory');
    if (!box) return;
    const history=load(TEST_HISTORY_KEY,[]).slice(0,10);
    if (!history.length) { box.innerHTML='<div class="notice">Nenhum teste realizado ainda.</div>'; return; }
    box.innerHTML=history.map(d=>`<div class="lamou-history-item"><div><b>${esc(d.time)}</b><small>v${esc(d.version)} • ${d.oks} OK • ${d.warns} avisos • ${d.fails} falhas</small></div><span class="lamou-history-badge ${d.overall}">${d.overall==='ok'?'✅ OK':d.overall==='warn'?'⚠️ Avisos':'❌ Falhas'}</span></div>`).join('');
  }

  function init() {
    ensureKnownLamou();
    injectStyles();
    injectHeaderTestButton();
    injectTestModal();
    simplifyManager();
    setTimeout(simplifyManager, 400);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', () => setTimeout(simplifyManager, 100));
})();