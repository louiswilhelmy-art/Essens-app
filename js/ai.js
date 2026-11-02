"use strict";
/* ============================================================
   KI-Anbindung: Gemini (Standard), Claude oder ChatGPT.
   Jeder Anbieter bekommt dieselbe Anfrage (Text + optional Bilder),
   die Weiche unten übersetzt sie ins jeweilige API-Format.
   Der API-Schlüssel bleibt nur auf diesem Gerät (IndexedDB).
   ============================================================ */
const PROVIDERS = {
  gemini: {
    name: "Gemini (Google)",
    keyUrl: "https://aistudio.google.com/apikey",
    keyHint: "Kostenlos in Google AI Studio: mit Google anmelden, „API-Schlüssel erstellen“, kopieren.",
    models: [
      { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash (Gratis-Kontingent)" },
      { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash-Lite (Gratis, schneller)" },
    ],
    free: true,
  },
  claude: {
    name: "Claude (Anthropic)",
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyHint: "In der Claude Console unter „API Keys“. Wird pro Nutzung abgerechnet, getrennt von einem Claude-Abo.",
    models: [
      { id: "claude-haiku-5-5", label: "Claude Haiku 5.5 (günstig)" },
      { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5 (genauer, teurer)" },
    ],
  },
  openai: {
    name: "ChatGPT (OpenAI)",
    keyUrl: "https://platform.openai.com/api-keys",
    keyHint: "Auf platform.openai.com unter „API keys“. Wird pro Nutzung abgerechnet, getrennt von ChatGPT Plus.",
    models: [],
  },
};
/* Preise in US-$ pro 1 Mio. Tokens [Eingabe, Ausgabe]; in den Einstellungen überschreibbar */
const DEFAULT_PRICES = {
  "claude-haiku-5-5": [0.10, 0.50],
  "claude-sonnet-5-5": [2, 10],
  "claude-opus-5-5": [4, 20],
};

const AI = {
  init() { S.sample = this.ready() ? this : null; S.sampleReady = true; },
  provider() { return S.ai?.provider || "gemini"; },
  key(p) { return (S.ai?.keys || {})[p || this.provider()] || ""; },
  model(p) {
    p = p || this.provider();
    const m = (S.ai?.models || {})[p];
    return m || (PROVIDERS[p].models[0] && PROVIDERS[p].models[0].id) || "";
  },
  ready() { return !!this.key() && !!this.model(); },
  canWatch(url) { return this.provider() === "gemini" && !!ytId(url); },
  canRead(url) { return (this.provider() === "gemini" || this.provider() === "claude") && /^https?:\/\//i.test(url || "") && !isVideoUrl(url); },

  /* ---------- Verbrauch ---------- */
  price(model) {
    const own = (S.ai?.prices || {})[model];
    if (own && own.length === 2 && (own[0] || own[1])) return own;
    if (this.provider() === "gemini" && !S.ai?.geminiPaid) return [0, 0];
    return DEFAULT_PRICES[model] || [0, 0];
  },
  record(model, inTok, outTok) {
    const k = todayKey();
    const d = S.usage.days[k] || (S.usage.days[k] = { req: 0, in: 0, out: 0, cost: 0 });
    const [pi, po] = this.price(model);
    d.req++; d.in += inTok || 0; d.out += outTok || 0; d.cost += ((inTok || 0) * pi + (outTok || 0) * po) / 1e6;
    const cut = dkey(addDays(new Date(), -60));
    Object.keys(S.usage.days).forEach(x => { if (x < cut) delete S.usage.days[x]; });
    Store.save("usage");
  },
  sum(from) {
    const t = { req: 0, in: 0, out: 0, cost: 0 };
    Object.entries(S.usage.days).forEach(([k, d]) => { if (k >= from) { t.req += d.req; t.in += d.in; t.out += d.out; t.cost += d.cost; } });
    return t;
  },
  week() { return this.sum(dkey(mondayOf(new Date()))); },
  today() { return this.sum(todayKey()); },
  overBudget() { const b = +S.ai?.budget || 0; return b > 0 && this.week().cost >= b; },

  /* ---------- Anfrage ---------- */
  async json(prompt, images, opts) {
    if (!this.ready()) throw { code: "not_granted" };
    if (this.overBudget()) throw { code: "budget" };
    opts = opts || {};
    const p = this.provider(), model = this.model(), key = this.key();
    const imgs = [];
    for (const b of (images || []).slice(0, 4)) imgs.push(await blobToB64(b));
    let text = "", inTok = 0, outTok = 0;
    if (p === "gemini") {
      const link = opts.link || "";
      /* Versuch 1: mit Video bzw. URL-Tool; falls Gemini das ablehnt, Versuch 2 ohne (nur Text/Bilder) */
      const build = (withLink) => {
        const parts = [];
        if (withLink && this.canWatch(link)) parts.push({ file_data: { file_uri: "https://www.youtube.com/watch?v=" + ytId(link) } });
        imgs.forEach(i => parts.push({ inline_data: { mime_type: i.type, data: i.data } }));
        parts.push({ text: withLink ? prompt : prompt + (link ? "\n\n(Hinweis: Der Link konnte nicht geöffnet werden. Erfinde nichts; wenn das Gericht nicht erkennbar ist, antworte {\"error\": \"unbekannt\"}.)" : "") });
        const body = { contents: [{ role: "user", parts }] };
        if (withLink && this.canRead(link)) body.tools = [{ url_context: {} }];
        else body.generationConfig = { responseMimeType: "application/json" };
        return body;
      };
      const call = body => apiFetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body),
      });
      const usesLink = this.canWatch(link) || this.canRead(link);
      let r;
      try { r = await call(build(true)); }
      catch (e) { if (usesLink && e && (e.code === "server" || e.code === "bad_request")) r = await call(build(false)); else throw e; }
      const parts = r.candidates?.[0]?.content?.parts || [];
      text = parts.filter(x => !x.thought).map(x => x.text || "").join("");
      if (!text.trim()) {
        const fr = r.candidates?.[0]?.finishReason || r.promptFeedback?.blockReason || "";
        throw { code: "server", detail: { error: { message: "Leere Antwort von Gemini" + (fr ? " (" + fr + ")" : "") } } };
      }
      const u = r.usageMetadata || {};
      inTok = (u.promptTokenCount || 0) + (u.toolUsePromptTokenCount || 0);
      outTok = (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
    } else if (p === "claude") {
      const link = opts.link || "";
      const build = withLink => {
        const content = imgs.map(i => ({ type: "image", source: { type: "base64", media_type: i.type, data: i.data } }));
        content.push({ type: "text", text: prompt + (withLink && this.canRead(link) ? "\n\nLies die Webseite unter dem Link mit dem web_fetch-Werkzeug." : link ? "\n\n(Der Link konnte nicht geöffnet werden. Erfinde nichts; wenn das Gericht nicht erkennbar ist, antworte {\"error\": \"unbekannt\"}.)" : "") + "\n\nAntworte am Ende ausschließlich mit gültigem JSON, ohne Text davor oder danach." });
        const body = { model, max_tokens: 4096, messages: [{ role: "user", content }] };
        if (withLink && this.canRead(link)) body.tools = [{ type: "web_fetch_20250910", name: "web_fetch", max_uses: 3 }];
        return body;
      };
      const call = (body) => apiFetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body.tools ? { "anthropic-beta": "web-fetch-2025-09-10" } : {}),
        body: JSON.stringify(body),
      });
      const usesLink = this.canRead(link);
      let r;
      try { r = await call(build(true)); }
      catch (e) { if (usesLink && e && (e.code === "server" || e.code === "bad_request")) r = await call(build(false)); else throw e; }
      /* Nur die Text-Blöcke nach dem letzten Werkzeug-Ergebnis sind die Antwort */
      const blocks = r.content || [];
      let lastTool = -1; blocks.forEach((b, i) => { if (b.type && b.type !== "text") lastTool = i; });
      text = blocks.slice(lastTool + 1).filter(b => b.type === "text").map(b => b.text).join("") || blocks.filter(b => b.type === "text").map(b => b.text).join("");
      inTok = (r.usage?.input_tokens || 0) + (r.usage?.cache_read_input_tokens || 0); outTok = r.usage?.output_tokens || 0;
    } else {
      const content = [{ type: "text", text: prompt + "\n\nAntworte ausschließlich mit gültigem JSON." }];
      imgs.forEach(i => content.push({ type: "image_url", image_url: { url: `data:${i.type};base64,${i.data}` } }));
      const r = await apiFetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
        body: JSON.stringify({ model, messages: [{ role: "user", content }], response_format: { type: "json_object" } }),
      });
      text = r.choices?.[0]?.message?.content || "";
      inTok = r.usage?.prompt_tokens || 0; outTok = r.usage?.completion_tokens || 0;
    }
    this.record(model, inTok, outTok);
    return parseJSONLoose(text);
  },
  async test() { return this.json('Antworte mit {"ok": true}'); },
};

async function apiFetch(url, init) {
  let res;
  try { res = await fetch(url, init); } catch (e) { throw { code: "network" }; }
  let body = null; try { body = await res.json(); } catch (e) {}
  if (!res.ok) {
    const raw = body && (body.error?.message || body.error?.type || JSON.stringify(body)) || "";
    const msg = String(raw).toLowerCase();
    const detail = { status: res.status, message: String(raw).slice(0, 200) };
    if (res.status === 429 || msg.includes("resource_exhausted") || msg.includes("rate limit")) throw { code: "rate_limited", detail };
    if (res.status === 401 || res.status === 403 || msg.includes("api key not valid") || msg.includes("invalid x-api-key") || msg.includes("incorrect api key") || msg.includes("api_key_invalid")) throw { code: "bad_key", detail };
    if (res.status === 404 && msg.includes("model")) throw { code: "bad_model", detail };
    if (msg.includes("credit balance") || msg.includes("billing") || msg.includes("insufficient_quota")) throw { code: "no_credit", detail };
    if (res.status === 400) throw { code: "bad_request", detail };
    throw { code: "server", detail };
  }
  return body;
}
function parseJSONLoose(t) {
  t = String(t || "");
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const cands = [];
  if (fence) cands.push(fence[1]);
  cands.push(t.trim());
  /* jedes ausbalancierte {...} von außen nach innen probieren */
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== "{") continue;
    let depth = 0, inStr = false, esc = false;
    for (let j = i; j < t.length; j++) {
      const c = t[j];
      if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true; else if (c === "{") depth++; else if (c === "}") { depth--; if (depth === 0) { cands.push(t.slice(i, j + 1)); break; } }
    }
    if (cands.length > 6) break;
  }
  let best = null;
  for (const c of cands) { try { const v = JSON.parse(c); if (v && typeof v === "object") { if (!best || JSON.stringify(v).length > JSON.stringify(best).length) best = v; } } catch (e) {} }
  if (best) return best;
  throw { code: "bad_json" };
}
function blobToB64(blob) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const s = String(fr.result); const i = s.indexOf(","); res({ type: blob.type || "image/jpeg", data: s.slice(i + 1) }); };
    fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob);
  });
}

/* Von der App verwendete Einstiegspunkte */
async function askClaudeJSON(prompt, images, opts) { return AI.json(prompt, images, opts); }
function sampleErrorText(e) {
  const c = e && e.code;
  if (c === "unknown_dish") return "Aus dem Link allein ist nicht erkennbar, welches Gericht es ist. Füge einen Screenshot vom Video hinzu (oder das Titelbild) oder schreib in die Anmerkung, was gekocht wird, z. B. „Gnocchi mit Tomaten und Feta“.";
  if (c === "not_granted") return "Verbinde zuerst eine KI: Zahnrad oben rechts → KI-Anbieter und Schlüssel.";
  if (c === "budget") return "Dein Wochenbudget ist aufgebraucht. In den Einstellungen kannst du es erhöhen.";
  if (c === "bad_request") return "Die KI hat die Anfrage abgelehnt." + (e.detail?.message ? " Meldung: " + String(e.detail.message).slice(0, 160) : "");
  if (c === "rate_limited") return "Limit erreicht: zu viele Anfragen gerade oder Tageskontingent aufgebraucht. Später nochmal versuchen.";
  if (c === "bad_key") return "Der API-Schlüssel wird nicht akzeptiert. Prüf ihn in den Einstellungen.";
  if (c === "bad_model") return "Dieses Modell gibt es beim Anbieter nicht (mehr). Wähl in den Einstellungen ein anderes.";
  if (c === "no_credit") return "Beim Anbieter ist kein Guthaben mehr da.";
  if (c === "network") return "Keine Verbindung zur KI. Bist du online?";
  if (c === "bad_json") return "Die Antwort der KI war nicht lesbar. Versuch es nochmal.";
  const d = e && e.detail && (e.detail.message || e.detail.error?.message);
  return "Das hat nicht geklappt." + (d ? " Meldung der KI: " + String(d).slice(0, 160) : " Versuch es nochmal oder füge mehr Text ein.");
}
