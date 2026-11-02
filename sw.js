/* Offline-Cache und Push-Erinnerungen. Bei Änderungen an der App VERSION hochzählen. */
const VERSION = "essensapp-v1.8.0";
const FILES = ["./", "index.html", "css/app.css", "js/app.js", "js/store.js", "js/ai.js", "js/push.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; /* KI-Anfragen und Bilder nie cachen */
  /* Erst Netz (damit Updates sofort kommen), offline aus dem Cache */
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});

/* ---------- Push ---------- */
function idb(mode, fn) {
  return new Promise((res, rej) => {
    const rq = indexedDB.open("essensapp", 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore("kv");
    rq.onerror = () => rej(rq.error);
    rq.onsuccess = () => { const tx = rq.result.transaction("kv", mode); const st = tx.objectStore("kv"); const out = fn(st); tx.oncomplete = () => res(out && out.result !== undefined ? out.result : out); tx.onerror = () => rej(tx.error); };
  });
}
self.addEventListener("push", e => {
  e.waitUntil((async () => {
    let list = [];
    try { list = (await idb("readonly", st => st.get("reminders"))) || []; } catch (err) {}
    const now = Date.now();
    const due = list.filter(r => !r.shown && r.at <= now + 20 * 60 * 1000 && r.at > now - 6 * 3600 * 1000).slice(-2);
    if (!due.length) {
      await self.registration.showNotification("Essens-App", { body: "Schau kurz in deinen Wochenplan.", icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "essensapp" });
      return;
    }
    for (const r of due) {
      await self.registration.showNotification(r.title, { body: r.body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "essensapp-" + (r.day || r.at), data: { tab: "einkauf" } });
      r.shown = true;
    }
    try { await idb("readwrite", st => st.put(list.filter(r => !r.test || !r.shown), "reminders")); } catch (err) {}
  })());
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await clients.matchAll({ type: "window", includeUncontrolled: true });
    if (all.length) { all[0].focus(); return; }
    await clients.openWindow("./#einkauf");
  })());
});
