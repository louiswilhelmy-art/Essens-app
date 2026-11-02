/* ============================================================
   Push-Server für die Essens-App (Cloudflare Worker, kostenlos)

   Was er macht:
   - Merkt sich pro Gerät das Push-Abo und die Zeitpunkte für Erinnerungen
     (die Texte bleiben auf dem Handy, hier liegen nur Uhrzeiten).
   - Läuft alle 15 Minuten (Cron) und klopft beim Handy an, wenn ein
     Zeitpunkt erreicht ist. Das Handy zeigt dann die passende Nachricht.
   - Erzeugt beim ersten Aufruf selbst sein Schlüsselpaar (VAPID).

   Einrichtung: siehe push-server/ANLEITUNG.md
   ============================================================ */
// Benötigt: KV-Namespace mit dem Variablennamen KV und einen Cron-Trigger alle 15 Minuten: */15 * * * *

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...CORS } });

const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64urlStr = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function getKeys(env) {
  let k = await env.KV.get("vapid", "json");
  if (k) return k;
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const priv = await crypto.subtle.exportKey("jwk", pair.privateKey);
  const pub = b64url(await crypto.subtle.exportKey("raw", pair.publicKey));
  k = { priv, pub };
  await env.KV.put("vapid", JSON.stringify(k));
  return k;
}

async function vapidHeader(env, endpoint) {
  const k = await getKeys(env);
  const aud = new URL(endpoint).origin;
  const header = b64urlStr(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const payload = b64urlStr(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: env.CONTACT || "mailto:essensapp@example.com" }));
  const key = await crypto.subtle.importKey("jwk", k.priv, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(header + "." + payload));
  return `vapid t=${header}.${payload}.${b64url(sig)}, k=${k.pub}`;
}

/* Leere Push-Nachricht senden (ohne Inhalt; das Handy weiß selbst, was es anzeigen soll) */
async function sendPush(env, sub) {
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: { Authorization: await vapidHeader(env, sub.endpoint), TTL: "43200", Urgency: "normal", "Content-Length": "0" },
  });
  return res.status;
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(req.url);
    try {
      if (url.pathname === "/vapid") return json({ key: (await getKeys(env)).pub });
      if (url.pathname === "/sync" && req.method === "POST") {
        const b = await req.json();
        if (!b.device || !b.sub || !b.sub.endpoint) return json({ error: "device und sub nötig" }, 400);
        const times = (b.times || []).filter(t => typeof t === "number").sort((x, y) => x - y).slice(0, 60);
        await env.KV.put("dev:" + b.device, JSON.stringify({ sub: b.sub, times, at: Date.now() }));
        return json({ ok: true, next: times[0] || null });
      }
      if (url.pathname === "/test" && req.method === "POST") {
        const b = await req.json();
        const d = await env.KV.get("dev:" + b.device, "json");
        if (!d) return json({ error: "Gerät unbekannt, erst aktivieren" }, 404);
        return json({ status: await sendPush(env, d.sub) });
      }
      if (url.pathname === "/off" && req.method === "POST") {
        const b = await req.json(); await env.KV.delete("dev:" + b.device); return json({ ok: true });
      }
      return json({ app: "essensapp-push", ok: true });
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 500);
    }
  },

  async scheduled(event, env) {
    const now = Date.now();
    let cursor;
    do {
      const list = await env.KV.list({ prefix: "dev:", cursor });
      for (const { name } of list.keys) {
        const d = await env.KV.get(name, "json"); if (!d) continue;
        const due = d.times.filter(t => t <= now + 60 * 1000);
        if (!due.length) continue;
        /* Zu alte Erinnerungen (> 3 Std. verpasst) nicht mehr schicken */
        const fresh = due.some(t => t > now - 3 * 3600 * 1000);
        const status = fresh ? await sendPush(env, d.sub) : 0;
        if (status === 404 || status === 410) { await env.KV.delete(name); continue; }
        d.times = d.times.filter(t => t > now + 60 * 1000);
        await env.KV.put(name, JSON.stringify(d));
      }
      cursor = list.list_complete ? undefined : list.cursor;
    } while (cursor);
  },
};
