// Comp 18 offline appka – service worker (Claude 10.11.2026): appka sa uloží do telefónu a otvorí sa aj bez signálu.
const V = "c18-v1";
const SUBORY = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SUBORY)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;          // Google API ide vždy priamo do siete
  e.respondWith(caches.open(V).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const siet = fetch(e.request).then(r => { if (r.ok) c.put(e.request.url.split("?")[0], r.clone()); return r; }).catch(() => hit);
    return hit || siet;                                                              // hneď z telefónu, na pozadí aktualizácia
  })));
});
