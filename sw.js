/* Funciona sin conexión.
   Con internet: siempre carga la última versión publicada (y la guarda).
   Sin internet: usa la copia guardada en el iPhone. */
const CACHE='mi-cuaderno-v2';
const SHELL=['./','index.html','app.js','manifest.webmanifest','icons/apple-touch-icon.png','icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const same=new URL(r.url).origin===self.location.origin;
  e.respondWith(caches.open(CACHE).then(async c=>{
    if(same){
      try{const res=await fetch(r,{cache:'no-cache'});if(res&&res.ok)c.put(r,res.clone());return res}
      catch(_){return (await c.match(r,{ignoreSearch:true}))||(r.mode==='navigate'?c.match('index.html'):Response.error())}
    }
    const hit=await c.match(r);
    if(hit)return hit;
    try{const res=await fetch(r);if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}catch(_){return Response.error()}
  }));
});
