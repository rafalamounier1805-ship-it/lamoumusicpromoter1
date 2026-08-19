const CACHE='lamou-runtime-v15';
const ASSETS=[
  './','./index.html',
  './styles.css?v=15','./workflow.css?v=15','./app-core.css?v=15','./submissions-v15.css?v=15',
  './app-core.js?v=15','./integrations-v10.js?v=15','./runtime-v13.js?v=15','./runtime-v14.js?v=15','./submissions-v15.js?v=15',
  './manifest.webmanifest?v=15','./icon-192.svg','./icon-512.svg'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response.ok&&response.type==='basic'){
        const cache=await caches.open(CACHE);
        cache.put(request,response.clone()).catch(()=>{});
      }
      return response;
    }catch(_){
      const cached=await caches.match(request);
      if(cached)return cached;
      if(request.mode==='navigate'){
        const shell=await caches.match('./index.html')||await caches.match('./');
        if(shell)return shell;
      }
      return new Response('Offline e recurso não disponível no cache.',{status:503,headers:{'content-type':'text/plain; charset=utf-8'}});
    }
  })());
});
