/* LAMOU dashboard compatibility loader — v8
   Kept at the legacy filename so existing deployments load the consolidated shell.
*/
(() => {
  'use strict';
  if (document.getElementById('lamouV8Loader')) return;
  const s = document.createElement('script');
  s.id = 'lamouV8Loader';
  s.src = 'lamou-v8.js?v=8.0.0';
  s.defer = true;
  document.body.appendChild(s);
})();
