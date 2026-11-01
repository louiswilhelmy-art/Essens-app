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
  canRead(url) { return this.provider() === "gemini" && /^https?:\/\//i.test(url || "") && !isVideoUrl(url); },

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
      const parts = [];
      const link = opts.link || "";
      if (this.canWatch(link)) parts.push({ file_data: { file_uri: "https://www.youtube.com/watch?v=" + ytId(link) } });
      imgs.forEach(i => parts.push({ inline_data: { mime_type: i.type, data: i.data } }));
      parts.push({ text: prompt });
      const body = { contents: [{ role: "user", parts }] };
      if (this.canRead(link)) body.tools = [{ url_context: {} }];
      else body.generationConfig = { responseMimeType: "application/json" };
      const r = await apiFetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body),
      });
      text = (r.candidates?.[0]?.content?.parts || []).map(x => x.text || "").join("");
      const u = r.usageMetadata || {};
      inTok = (u.promptTokenCount || 0) + (u.toolUsePromptTokenCount || 0);
      outTok = (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
    } else if (p === "claude") {
      const content = imgs.map(i => ({ type: "image", source: { type: "base64", media_type: i.type, data: i.data } }));
      content.push({ type: "text", text: prompt + "\n\nAntworte ausschließlich mit gültigem JSON, ohne Text davor oder danach." });
      const r = await apiFetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: "user", content }] }),
      });
      text = (r.content || []).map(x => x.text || "").join("");
      inTok = r.usage?.input_tokens || 0; outTok = r.usage?.output_tokens || 0;
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
    const msg = JSON.stringify(body || {}).toLowerCase();
    if (res.status === 429) throw { code: "rate_limited" };
    if (res.status === 401 || res.status === 403 || msg.includes("api_key") || msg.includes("api key") || msg.includes("authentication")) throw { code: "bad_key" };
    if (res.status === 404 || msg.includes("model")) throw { code: "bad_model", detail: body };
    if (msg.includes("credit") || msg.includes("billing") || msg.includes("quota")) throw { code: "no_credit" };
    throw { code: "server", status: res.status, detail: body };
  }
  return body;
}
function parseJSONLoose(t) {
  t = String(t || "").replace(/```(?:json)?/gi, "").trim();
  try { return JSON.parse(t); } catch (e) {}
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
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
  if (c === "rate_limited") return "Limit erreicht: zu viele Anfragen gerade oder Tageskontingent aufgebraucht. Später nochmal versuchen.";
  if (c === "bad_key") return "Der API-Schlüssel wird nicht akzeptiert. Prüf ihn in den Einstellungen.";
  if (c === "bad_model") return "Dieses Modell gibt es beim Anbieter nicht (mehr). Wähl in den Einstellungen ein anderes.";
  if (c === "no_credit") return "Beim Anbieter ist kein Guthaben mehr da.";
  if (c === "network") return "Keine Verbindung zur KI. Bist du online?";
  if (c === "bad_json") return "Die Antwort der KI war unvollständig. Versuch es nochmal.";
  return "Das hat nicht geklappt. Versuch es nochmal oder füge mehr Text ein.";
}
