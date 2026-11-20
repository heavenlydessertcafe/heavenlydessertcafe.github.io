const C='heavenly-menu-v4';
const MINE=p=>/\/(menu\.html|menu\.json|manifest\.json|[a-z_]+\.(webp|png))$/.test(p);
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['menu.html','menu.json','manifest.json'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const net=(req,key)=>fetch(req).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(key,c));return r}).catch(()=>caches.match(key));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin||!MINE(u.pathname))return; // cashier & points pages untouched
  if(u.pathname.endsWith('menu.json')){e.respondWith(net(e.request,'menu.json'));return;}
  if(u.pathname.endsWith('menu.html')){e.respondWith(net(e.request,'menu.html'));return;}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r})));
});
