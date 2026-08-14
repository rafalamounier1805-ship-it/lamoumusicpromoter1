/* LAMOU compatibility loader — v8.2
   Legacy filename kept so existing deployments load the consolidated shell,
   simplified user/header layer, then workflow correctness fixes.
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
    x.onload = () => {
      if (document.getElementById('lamouV82Loader')) return;
      const y = document.createElement('script');
      y.id = 'lamouV82Loader';
      y.src = 'workflow-fix-v82.js?v=8.2.0';
      y.defer = true;
      document.body.appendChild(y);
    };
    document.body.appendChild(x);
  };
  document.body.appendChild(s);
})();
