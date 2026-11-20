const C='heavenly-menu-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','menu.json','manifest.json'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const net=(req,key)=>fetch(req).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(key||req,c));return r}).catch(()=>caches.match(key||req).then(m=>m||caches.match('index.html')));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('menu.json')){e.respondWith(net(e.request,'menu.json'));return;}
  if(e.request.mode==='navigate'||u.pathname.endsWith('.html')){e.respondWith(net(e.request));return;}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r})));
});
