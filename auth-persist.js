/* LAMOU persistent device access
   Persists only the authenticated-device flag. The password itself is never stored. */
(() => {
  const ACCESS_KEY = 'lamou_access';

  function rememberAccess() {
    try {
      localStorage.setItem(ACCESS_KEY, 'ok');
      sessionStorage.removeItem(ACCESS_KEY);
    } catch (_) {
      sessionStorage.setItem(ACCESS_KEY, 'ok');
    }
  }

  function hasRememberedAccess() {
    try {
      if (localStorage.getItem(ACCESS_KEY) === 'ok') return true;
      if (sessionStorage.getItem(ACCESS_KEY) === 'ok') {
        localStorage.setItem(ACCESS_KEY, 'ok');
        sessionStorage.removeItem(ACCESS_KEY);
        return true;
      }
    } catch (_) {
      return sessionStorage.getItem(ACCESS_KEY) === 'ok';
    }
    return false;
  }

  window.unlockApp = async function unlockAppPersistent() {
    const input = document.getElementById('accessPassword');
    const error = document.getElementById('accessError');
    const gate = document.getElementById('accessGate');
    const value = input?.value || '';
    const hash = await sha256Text(value);

    if (hash === ACCESS_HASH) {
      rememberAccess();
      gate?.classList.add('hidden');
      if (error) error.textContent = '';
      if (input) input.value = '';
      return;
    }

    if (error) error.textContent = 'Senha incorreta.';
    input?.select();
  };

  window.initAccess = function initPersistentAccess() {
    if (hasRememberedAccess()) {
      document.getElementById('accessGate')?.classList.add('hidden');
    }
  };

  window.forgetLamouAccess = function forgetLamouAccess() {
    try { localStorage.removeItem(ACCESS_KEY); } catch (_) {}
    try { sessionStorage.removeItem(ACCESS_KEY); } catch (_) {}
  };
})();
