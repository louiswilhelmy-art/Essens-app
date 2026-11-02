"use strict";
/* ============================================================
   Push-Erinnerungen
   - Die App berechnet aus Wochenplan, Vorrat und Einkaufsliste die
     Erinnerungen (Zeitpunkt + Text) und legt sie lokal ab ("reminders").
   - Dem Push-Server (push-server/worker.js) schickt sie nur die Zeitpunkte.
   - Zum Zeitpunkt klopft der Server an; der Service Worker (sw.js) liest
     die passende Erinnerung lokal und zeigt sie an.
   ============================================================ */
const Push = {
  timer: null,
  supported() { return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; },
  cfg() { return S.push || (S.push = { server: "", on: false, morning: "09:00", evening: "18:00", device: "" }); },
  /* Nach jeder Änderung an Plan/Vorrat/Liste: neu berechnen (gebündelt) */
  changed() { clearTimeout(this.timer); this.timer = setTimeout(() => this.schedule().catch(() => {}), 1500); },
  at(dayKey, hhmm) { const d = parseKey(dayKey); const [h, m] = (hhmm || "09:00").split(":").map(Number); d.setHours(h || 0, m || 0, 0, 0); return d.getTime(); },
  compute() {
    const c = this.cfg(), out = [], now = Date.now();
    for (let i = 0; i < 15; i++) {
      const k = dkey(addDays(new Date(), i));
      const list = entriesOn(k); if (!list.length) continue;
      const titles = list.map(e => e.title).join(" + ");
      const needs = planNeeds(list.map(e => ({ e, day: k }))).filter(n => !n.asked);
      const listed = S.shopping.filter(s => !s.checked && s.due && s.due <= k);
      const body = needs.length
        ? "Noch einkaufen: " + needs.slice(0, 6).map(n => n.name).join(", ") + (needs.length > 6 ? " …" : "")
        : listed.length ? `${listed.length} ${listed.length === 1 ? "Sache steht" : "Sachen stehen"} noch auf der Einkaufsliste.` : "Alles da. Guten Appetit!";
      if (c.evening) { const t = this.at(dkey(addDays(parseKey(k), -1)), c.evening); if (t > now) out.push({ at: t, day: k, title: "Morgen Abend: " + titles, body }); }
      if (c.morning) { const t = this.at(k, c.morning); if (t > now) out.push({ at: t, day: k, title: "Heute Abend: " + titles, body }); }
    }
    return out.sort((a, b) => a.at - b.at);
  },
  async schedule() {
    const c = this.cfg();
    if (!c.on || !c.server || !this.supported()) return;
    const rem = this.compute();
    await IDB.put("reminders", rem);
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await fetch(c.server.replace(/\/$/, "") + "/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ device: c.device, sub: sub.toJSON(), times: rem.map(r => r.at) }) });
  },
  async enable() {
    const c = this.cfg();
    if (!this.supported()) throw new Error("Dieses Gerät oder dieser Browser kann keine Push-Nachrichten. Auf dem iPhone geht es nur, wenn die App über „Zum Home-Bildschirm“ installiert ist.");
    if (!c.server) throw new Error("Trag zuerst die Adresse deines Push-Servers ein.");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") throw new Error("Benachrichtigungen wurden nicht erlaubt. Du kannst das in den Handy-Einstellungen für die App ändern.");
    const base = c.server.replace(/\/$/, "");
    let key;
    try { key = (await (await fetch(base + "/vapid")).json()).key; } catch (e) { throw new Error("Push-Server nicht erreichbar. Stimmt die Adresse?"); }
    if (!key) throw new Error("Push-Server antwortet nicht richtig. Ist der KV-Speicher verbunden?");
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (sub && c.key !== key) { await sub.unsubscribe(); sub = null; }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(key) });
    if (!c.device) c.device = uid() + uid();
    c.key = key; c.on = true; Store.save("push");
    await this.schedule();
  },
  async disable() {
    const c = this.cfg(); c.on = false; Store.save("push");
    try { const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription(); if (sub) await sub.unsubscribe(); } catch (e) {}
    if (c.server && c.device) fetch(c.server.replace(/\/$/, "") + "/off", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ device: c.device }) }).catch(() => {});
  },
  async test() {
    const c = this.cfg();
    await IDB.put("reminders", [{ at: Date.now() - 1000, title: "Test: Benachrichtigungen klappen", body: "So sehen deine Erinnerungen aus.", test: true }, ...this.compute()]);
    const r = await fetch(c.server.replace(/\/$/, "") + "/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ device: c.device }) });
    const j = await r.json(); if (!r.ok || (j.status && j.status >= 300)) throw new Error("Der Server konnte nicht senden (" + (j.error || j.status) + ").");
  },
};
function b64ToBytes(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); s += "=".repeat((4 - s.length % 4) % 4); return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }

/* Einstellungs-Abschnitt */
function pushSettingsHtml() {
  const c = Push.cfg();
  const next = c.on ? Push.compute()[0] : null;
  return `<div class="section-h" style="margin:8px 0 0"><h2>Erinnerungen</h2></div>
    <div class="profile">
      <span class="small">Push-Nachricht, wenn für ein geplantes Abendessen noch etwas fehlt: am Vorabend und am Tag selbst.</span>
      ${!Push.supported() ? `<div class="banner bad small">Auf diesem Gerät gehen keine Push-Nachrichten. Auf dem iPhone nur, wenn die App über „Zum Home-Bildschirm“ installiert ist.</div>` : ""}
      <div class="field"><label for="pu-server">Adresse deines Push-Servers</label><input id="pu-server" inputmode="url" autocomplete="off" placeholder="https://essensapp-push.DEINNAME.workers.dev" value="${esc(c.server || "")}"></div>
      <div class="row"><div class="field grow"><label for="pu-eve">Am Vorabend um</label><input id="pu-eve" type="time" value="${esc(c.evening || "")}"></div><div class="field grow"><label for="pu-morn">Am Tag selbst um</label><input id="pu-morn" type="time" value="${esc(c.morning || "")}"></div></div>
      <div class="row" style="flex-wrap:wrap">${c.on ? `<button class="btn grow" id="pu-save">Speichern</button><button class="btn grow" id="pu-test">Testnachricht</button><button class="btn danger" id="pu-off">Aus</button>` : `<button class="btn primary grow" id="pu-on">Erinnerungen aktivieren</button>`}</div>
      <span class="small muted" id="pu-status" role="status">${c.on ? (next ? `Aktiv. Nächste: ${esc(new Date(next.at).toLocaleString("de-AT", { weekday: "short", hour: "2-digit", minute: "2-digit" }))} – ${esc(next.title)}` : "Aktiv. Gerade ist nichts geplant.") : "Aus."}</span>
      <span class="tiny muted">Den Push-Server richtest du einmal kostenlos bei Cloudflare ein, Anleitung im Repository unter push-server/ANLEITUNG.md. Er kennt nur Uhrzeiten, keine Rezepte.</span>
    </div>`;
}
function mountPushSettings() {
  const c = Push.cfg(), st = $("#pu-status");
  const read = () => { c.server = $("#pu-server").value.trim(); c.evening = $("#pu-eve").value; c.morning = $("#pu-morn").value; Store.save("push"); };
  const on = $("#pu-on"); if (on) on.onclick = async () => { read(); st.textContent = "Aktiviere …"; try { await Push.enable(); render(); toast("Erinnerungen aktiv"); } catch (e) { st.textContent = e.message || "Hat nicht geklappt."; } };
  const sv = $("#pu-save"); if (sv) sv.onclick = async () => { read(); try { await Push.schedule(); render(); toast("Gespeichert"); } catch (e) { st.textContent = "Server nicht erreichbar."; } };
  const ts = $("#pu-test"); if (ts) ts.onclick = async () => { read(); st.textContent = "Sende Test …"; try { await Push.test(); st.textContent = "Test geschickt. Kommt gleich an."; } catch (e) { st.textContent = e.message || "Test hat nicht geklappt."; } };
  const off = $("#pu-off"); if (off) off.onclick = async () => { await Push.disable(); render(); toast("Erinnerungen aus"); };
}
