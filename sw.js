/* Offline-Cache für die App-Dateien. Bei Änderungen an der App VERSION hochzählen. */
const VERSION = "essensapp-v1.0.0";
const FILES = ["./", "index.html", "css/app.css", "js/app.js", "js/store.js", "js/ai.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; /* KI-Anfragen und Bilder nie cachen */
  /* Erst Netz (damit Updates sofort kommen), offline aus dem Cache */
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
