"use strict";
/* ============================================================
   Speicher: alles bleibt lokal auf dem Gerät (IndexedDB).
   Jeder "Dokument"-Schlüssel ist ein Eintrag:
     pantry, shopping, plan, requests, ideas, settings, usage, r_<id> (Rezepte)
   ============================================================ */
const DEL = { del: true };
const IDB = {
  db: null,
  open() {
    return new Promise((res, rej) => {
      const req = indexedDB.open("essensapp", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("kv");
      req.onsuccess = () => { this.db = req.result; res(); };
      req.onerror = () => rej(req.error);
    });
  },
  all() {
    return new Promise((res, rej) => {
      const out = {}; const tx = this.db.transaction("kv", "readonly"); const st = tx.objectStore("kv");
      const cur = st.openCursor();
      cur.onsuccess = () => { const c = cur.result; if (c) { out[c.key] = c.value; c.continue(); } else res(out); };
      cur.onerror = () => rej(cur.error);
    });
  },
  put(key, val) {
    return new Promise((res, rej) => { const tx = this.db.transaction("kv", "readwrite"); tx.objectStore("kv").put(val, key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  },
  del(key) {
    return new Promise((res, rej) => { const tx = this.db.transaction("kv", "readwrite"); tx.objectStore("kv").delete(key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  },
  clear() {
    return new Promise((res, rej) => { const tx = this.db.transaction("kv", "readwrite"); tx.objectStore("kv").clear(); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  },
};

const Store = {
  /* Stubs für Funktionen, die später mit Sync (gemeinsamer Haushalt) kommen */
  user: null, canWriteShared: true, loaded: false,
  shareMode() { return false; },
  syncShared() {},
  apply() {},
  async init() {
    try {
      await IDB.open();
      const all = await IDB.all();
      S.pantry = all.pantry?.items || [];
      S.shopping = all.shopping?.items || [];
      S.plan = all.plan || { days: {} };
      if (!S.plan.days) S.plan.days = {};
      S.requests = all.requests?.items || [];
      S.ideas = all.ideas?.byKey || {};
      const st = all.settings || {};
      S.household = st.household || null; S.people = st.people || null;
      S.ai = Object.assign({ provider: "gemini", keys: {}, models: {}, prices: {}, budget: 0 }, all.ai || {});
      S.usage = all.usage || { days: {} };
      S.push = Object.assign({ server: "", on: false, morning: "09:00", evening: "18:00", device: "" }, all.push || {});
      S.recipes = {};
      Object.keys(all).forEach(k => { if (k.startsWith("r_")) S.recipes[k] = all[k]; });
      S.storeMode = "local"; S.storeNote = "";
      S.me = "ich";
      this.loaded = true;
    } catch (e) {
      S.storeNote = "Der Speicher dieses Browsers ist nicht verfügbar (privater Modus?). Änderungen gehen beim Schließen verloren.";
    }
  },
  dataFor(key) {
    if (key === "pantry") return { items: S.pantry };
    if (key === "shopping") return { items: S.shopping };
    if (key === "plan") return S.plan;
    if (key === "requests") return { items: S.requests };
    if (key === "ideas") return { byKey: S.ideas };
    if (key === "settings") return { household: S.household || null, people: S.people || null };
    if (key === "ai") return S.ai;
    if (key === "usage") return S.usage;
    if (key === "push") return S.push;
    return S.recipes[key] ? S.recipes[key] : DEL;
  },
  save(key) {
    if (S.drafts && S.drafts[key]) return;
    if (!IDB.db) return;
    const d = this.dataFor(key);
    const p = d === DEL ? IDB.del(key) : IDB.put(key, JSON.parse(JSON.stringify(d)));
    if (typeof Push !== "undefined" && (key === "pantry" || key === "shopping" || key === "plan" || key.startsWith("r_"))) Push.changed();
    p.catch(e => toast(e && e.name === "QuotaExceededError" ? "Speicher voll: lösche ein paar Fotos oder alte Rezepte." : "Speichern hat nicht geklappt."));
  },
  /* Sicherung als JSON (alle Daten) */
  async exportAll() {
    const all = await IDB.all();
    delete all.ai; /* API-Schlüssel nie mit exportieren */
    delete all.push; delete all.reminders;
    return { app: "essensapp", version: 1, exportedAt: new Date().toISOString(), data: all };
  },
  async importAll(json, replace) {
    const data = json && (json.data || json);
    if (!data || typeof data !== "object") throw new Error("Datei passt nicht");
    if (replace) { const ai = S.ai; await IDB.clear(); await IDB.put("ai", JSON.parse(JSON.stringify(ai))); }
    for (const [k, v] of Object.entries(data)) {
      if (k === "ai") continue;
      if (!replace && k.startsWith("r_")) { await IDB.put(k, v); continue; }
      if (!replace && (k === "pantry" || k === "shopping")) {
        const cur = (await IDB.all())[k]?.items || []; const ids = new Set(cur.map(x => x.id));
        await IDB.put(k, { items: [...cur, ...(v.items || []).filter(x => !ids.has(x.id))] }); continue;
      }
      await IDB.put(k, v);
    }
    await this.init();
  },
};

function setHousehold(mode, people) {
  S.household = mode; S.people = people;
  Store.save("settings");
  render();
}
