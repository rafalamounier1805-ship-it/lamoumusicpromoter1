/* LAMOU compatibility loader — v8.1
   Legacy filename kept so existing deployments load the consolidated shell
   and then the simplified user/header/clear-data layer.
*/
(() => {
  'use strict';
  if (document.getElementById('lamouV8Loader')) return;
  const s = document.createElement('script');
  s.id = 'lamouV8Loader';
  s.src = 'lamou-v8.js?v=8.0.0';
  s.defer = true;
  s.onload = () => {
    if (document.getElementById('lamouV81Loader')) return;
    const x = document.createElement('script');
    x.id = 'lamouV81Loader';
    x.src = 'lamou-v81.js?v=8.1.0';
    x.defer = true;
    document.body.appendChild(x);
  };
  document.body.appendChild(s);
})();
