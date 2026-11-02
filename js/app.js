
"use strict";
const APP_VERSION = "1.8.0";
/* ---------- Grunddaten ---------- */
const UNITS = ["Stk","g","kg","ml","l","EL","TL","Prise","Bund","Dose","Packung","Zehe","Scheibe","Becher","Glas"];
const AISLES = { o:"Obst & Gemüse", k:"Kühlregal", f:"Fleisch & Fisch", t:"Trockenware & Konserven", g:"Gewürze, Öle & Saucen", b:"Brot & Backwaren", z:"Tiefkühl", d:"Getränke", s:"Sonstiges" };
const AISLE_ORDER = ["Obst & Gemüse","Brot & Backwaren","Kühlregal","Fleisch & Fisch","Trockenware & Konserven","Gewürze, Öle & Saucen","Tiefkühl","Getränke","Sonstiges"];
const PLACES = ["Kühlschrank","Vorrat","Tiefkühler"];
const CATEGORIES = ["Pasta","Reis & Bowls","Suppe & Eintopf","Curry & Pfanne","Salat","Ofen & Auflauf","Fleisch","Fisch","Burger & Sandwich","Pizza & Flammkuchen","Frühstück","Snack","Dessert","Backen","Sonstiges"];
const SEASONS = ["Frühling","Sommer","Herbst","Winter"];

const CATALOG_RAW = "Apfel|Stk|o;Aprikose|Stk|o;Avocado|Stk|o;Ananas|Stk|o;Banane|Stk|o;Birne|Stk|o;Blaubeeren|g|o;Erdbeeren|g|o;Himbeeren|g|o;Kirschen|g|o;Mango|Stk|o;Orange|Stk|o;Zitrone|Stk|o;Limette|Stk|o;Weintrauben|g|o;Kiwi|Stk|o;Pfirsich|Stk|o;Nektarine|Stk|o;Pflaume|Stk|o;Granatapfel|Stk|o;Wassermelone|Stk|o;Feige|Stk|o;"
+"Tomate|Stk|o;Kirschtomaten|g|o;Gurke|Stk|o;Paprika|Stk|o;Zwiebel|Stk|o;Rote Zwiebel|Stk|o;Frühlingszwiebel|Stk|o;Schalotte|Stk|o;Knoblauch|Zehe|o;Ingwer|g|o;Chili|Stk|o;Karotte|Stk|o;Kartoffel|g|o;Süßkartoffel|Stk|o;Zucchini|Stk|o;Aubergine|Stk|o;Brokkoli|g|o;Blumenkohl|Stk|o;Spinat|g|o;Babyspinat|g|o;Rucola|g|o;Salat|Stk|o;Eisbergsalat|Stk|o;Feldsalat|g|o;Lauch|Stk|o;Sellerie|Stk|o;Staudensellerie|Stk|o;Pilze|g|o;Champignons|g|o;Kürbis|Stk|o;Hokkaido|Stk|o;Rote Bete|Stk|o;Spargel|g|o;Grüne Bohnen|g|o;Erbsen|g|z;Mais|Dose|t;Rotkohl|Stk|o;Weißkohl|Stk|o;Wirsing|Stk|o;Rosenkohl|g|o;Fenchel|Stk|o;Radieschen|Bund|o;Pak Choi|Stk|o;Mangold|g|o;Pastinake|Stk|o;Petersilie|Bund|o;Basilikum|Bund|o;Koriander|Bund|o;Schnittlauch|Bund|o;Dill|Bund|o;Minze|Bund|o;Rosmarin|Bund|o;Thymian|Bund|o;Salbei|Bund|o;"
+"Milch|ml|k;Hafermilch|ml|k;Sahne|ml|k;Schmand|Becher|k;Saure Sahne|Becher|k;Crème fraîche|Becher|k;Butter|g|k;Joghurt|g|k;Griechischer Joghurt|g|k;Quark|g|k;Frischkäse|g|k;Mascarpone|g|k;Ricotta|g|k;Mozzarella|Stk|k;Burrata|Stk|k;Feta|g|k;Halloumi|g|k;Parmesan|g|k;Pecorino|g|k;Gouda|g|k;Emmentaler|g|k;Cheddar|g|k;Reibekäse|g|k;Eier|Stk|k;Tofu|g|k;Räuchertofu|g|k;Hefe|Packung|k;Blätterteig|Packung|k;Pizzateig|Packung|k;Gnocchi|g|k;Frische Pasta|g|k;Tortellini|g|k;Speck|g|k;Pancetta|g|k;Guanciale|g|k;Schinken|g|k;Salami|g|k;Chorizo|g|k;Würstchen|Stk|k;"
+"Hackfleisch|g|f;Rinderhack|g|f;Hähnchenbrust|g|f;Hähnchenschenkel|g|f;Putenbrust|g|f;Rindersteak|g|f;Rindergulasch|g|f;Schweinefilet|g|f;Schweinenacken|g|f;Lachs|g|f;Thunfisch|Dose|t;Garnelen|g|z;Kabeljau|g|f;Forelle|g|f;"
+"Spaghetti|g|t;Penne|g|t;Fusilli|g|t;Rigatoni|g|t;Tagliatelle|g|t;Linguine|g|t;Orzo|g|t;Lasagneplatten|g|t;Nudeln|g|t;Reis|g|t;Basmatireis|g|t;Jasminreis|g|t;Risottoreis|g|t;Sushireis|g|t;Couscous|g|t;Bulgur|g|t;Quinoa|g|t;Linsen|g|t;Rote Linsen|g|t;Kichererbsen|Dose|t;Kidneybohnen|Dose|t;Weiße Bohnen|Dose|t;Schwarze Bohnen|Dose|t;Haferflocken|g|t;Mehl|g|t;Zucker|g|t;Brauner Zucker|g|t;Puderzucker|g|t;Backpulver|Packung|t;Natron|TL|t;Vanillezucker|Packung|t;Speisestärke|g|t;Paniermehl|g|t;Gehackte Tomaten|Dose|t;Passierte Tomaten|g|t;Tomatenmark|EL|t;Kokosmilch|Dose|t;Gemüsebrühe|ml|t;Hühnerbrühe|ml|t;Rinderbrühe|ml|t;Mandeln|g|t;Walnüsse|g|t;Cashews|g|t;Erdnüsse|g|t;Pinienkerne|g|t;Sesam|g|t;Rosinen|g|t;Schokolade|g|t;Kakao|g|t;Honig|EL|t;Ahornsirup|EL|t;Marmelade|Glas|t;Erdnussbutter|g|t;Nutella|Glas|t;Ramen-Nudeln|g|t;Reisnudeln|g|t;Glasnudeln|g|t;Tortilla Wraps|Packung|b;Toastbrot|Packung|b;Brot|Stk|b;Baguette|Stk|b;Brötchen|Stk|b;Burger Buns|Stk|b;Pita|Stk|b;Naan|Stk|b;"
+"Salz|Prise|g;Pfeffer|Prise|g;Olivenöl|EL|g;Sonnenblumenöl|EL|g;Rapsöl|EL|g;Sesamöl|EL|g;Essig|EL|g;Balsamico|EL|g;Weißweinessig|EL|g;Sojasauce|EL|g;Fischsauce|EL|g;Worcestersauce|TL|g;Senf|TL|g;Dijon-Senf|TL|g;Ketchup|EL|g;Mayonnaise|EL|g;Sriracha|TL|g;Currypaste|EL|g;Pesto|Glas|g;Paprikapulver|TL|g;Geräuchertes Paprikapulver|TL|g;Currypulver|TL|g;Kreuzkümmel|TL|g;Kurkuma|TL|g;Zimt|TL|g;Oregano|TL|g;Chiliflocken|TL|g;Muskatnuss|Prise|g;Garam Masala|TL|g;Lorbeerblatt|Stk|g;Italienische Kräuter|TL|g;Gemüsebrühe Pulver|TL|g;Kapern|EL|g;Oliven|g|g;Getrocknete Tomaten|g|g;Weißwein|ml|d;Rotwein|ml|d;Wasser|ml|d;Bier|ml|d;Orangensaft|ml|d;Apfelsaft|ml|d;"
+"Tiefkühlspinat|g|z;Tiefkühlbeeren|g|z;Pommes|g|z;Tiefkühlgemüse|g|z";
const CATALOG = CATALOG_RAW.split(";").map(s => { const [name, unit, a] = s.split("|"); return { name, unit, aisle: AISLES[a] || AISLES.s }; });
const STAPLES = ["salz","pfeffer","wasser"];

/* ---------- Text-Helfer ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const fold = s => String(s || "").toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss").replace(/ae/g,"a").replace(/oe/g,"o").replace(/ue/g,"u").replace(/[éèê]/g,"e").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim();
const ALIAS = { eier:"ei", ei:"ei", tomat:"tomat", nudel:"nudel", karott:"karott", mohr:"karott", mohre:"karott", knoblauchzeh:"knoblauch" };
function stem(w) { w = fold(w); if (w.length > 4) { if (w.endsWith("en")) w = w.slice(0, -2); else if (/[ens]$/.test(w)) w = w.slice(0, -1); } return ALIAS[w] || w; }
const words = s => fold(s).split(" ").filter(Boolean).map(stem);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function base(qty, unit) {
  if (qty == null || isNaN(qty)) return null;
  if (unit === "g") return { v: qty, d: "m" };
  if (unit === "kg") return { v: qty * 1000, d: "m" };
  if (unit === "ml") return { v: qty, d: "v" };
  if (unit === "l") return { v: qty * 1000, d: "v" };
  return { v: qty, d: unit || "Stk" };
}
function fromBase(v, unit) { return unit === "kg" || unit === "l" ? v / 1000 : v; }
function roundQty(q, unit) {
  if (q == null || isNaN(q)) return null;
  if (unit === "g" || unit === "ml") return q >= 100 ? Math.round(q / 10) * 10 : Math.max(1, Math.round(q));
  if (unit === "kg" || unit === "l") return Math.round(q * 100) / 100;
  if (unit === "Prise") return Math.max(1, Math.round(q));
  return Math.max(0.5, Math.round(q * 2) / 2);
}
function fmtNum(q) { return String(q).replace(".", ","); }
function fmtQty(q, unit) {
  if (q == null || q === "" || isNaN(q)) return unit && unit !== "nach Geschmack" ? unit : "n. B.";
  if ((unit === "g" || unit === "ml") && q >= 1000) return fmtNum(Math.round(q / 100) / 10) + (unit === "g" ? " kg" : " l");
  const r = roundQty(q, unit);
  return fmtNum(r) + (unit ? " " + unit : "");
}
function stepFor(unit, q) {
  if (unit === "g" || unit === "ml") return q >= 500 ? 100 : 50;
  if (unit === "kg" || unit === "l") return 0.25;
  return 1;
}

/* ---------- Zustand ---------- */
const S = {
  pantry: [], shopping: [], recipes: {}, ideas: {},
  today: { steps: [], options: [], directions: [], shown: [], loading: false, error: "" },
  plan: { days: {} }, requests: [], pantryFilter: "alle", household: null, people: null, me: null, names: {}, planWeek: 0, planSpan: 1,
  push: null,
  ai: { provider: "gemini", keys: {}, models: {}, prices: {}, budget: 0 }, usage: { days: {} }, settingsOpen: false,
  queue: { items: [], running: false, stop: false }, queueSheet: null,
  drafts: {}, todayMode: "lust", howto: { q: "", options: [], loading: false, error: "" },
  ideaFilter: null, ideaQuery: "", ideaLoading: false, ideaError: "",
  tab: "plan", openRecipe: null, servings: {},
  recipeQuery: "", catFilter: null, seasonFilter: null, sort: "da",
  storeMode: "laden", storeNote: "", sample: null, sampleReady: false,
};

/* ---------- Speicher ---------- */
/* ---------- KI: Rezept-Schema und Prompts ---------- */
const RECIPE_SCHEMA = `{
  "title": "Kurzer deutscher Rezeptname",
  "servings": 2,
  "category": "eine aus: ${CATEGORIES.join(", ")}",
  "seasons": ["eine oder mehrere aus: ${SEASONS.join(", ")} (alle vier, wenn ganzjährig passend)"],
  "tags": ["8-14 Stichworte, klein: Stimmung/Charakter (leicht, frisch, deftig, wärmend, cremig, würzig, scharf, comfort food), Aufwand (schnell, unter 30 minuten, meal prep, einfach), Ernährung (vegetarisch, vegan, fleisch, fisch, proteinreich, low carb), Küche (italienisch, asiatisch, indisch, mexikanisch, deutsch, orientalisch), Anlass (feierabend, gäste, grillen, sonntag), Hauptzutaten"],
  "ingredients": [
    {"name": "Grundform im Singular wie im Supermarkt, z.B. Zwiebel, Knoblauch, Spaghetti, Passierte Tomaten, Parmesan", "qty": 1, "unit": "eine aus: ${UNITS.join(", ")} oder null", "note": "Zusatz wie 'fein gewürfelt' oder ''", "aisle": "eine aus: ${AISLE_ORDER.join(", ")}", "staple": false, "role": "haupt | neben"}
  ],
  "steps": ["Kurze, klare Arbeitsschritte auf Deutsch"],
  "time": {"prep": 15, "cook": 25, "total": 40, "stated": 25, "why": "Ein Satz, warum die realistische Zeit von der Angabe abweicht"},
  "diet": "vegan | vegetarisch | pescetarisch | mit Fleisch",
  "swaps": [{"original": "Speck", "alternatives": ["vegetarische Speckwürfel", "vegane Speckwürfel", "Halloumi-Würfel"], "tip": "Kurzer Tipp, wie der Ersatz am besten klappt"}],
  "confidence": "hoch | mittel | niedrig",
  "sourceNote": "Ein Satz, woher die Angaben stammen"
}
Regeln für die Zutaten:
- "role": "haupt" für alles, was das Gericht ausmacht (Gemüse, Fleisch, Fisch, Tofu, Halloumi, Nudeln, Reis, Käse, Sahne, Brühe, Dosentomaten …). "neben" für Öl, Butter zum Braten, Salz, Pfeffer, Gewürze, kleine Mengen Kräuter, Essig, Zucker, Senf zum Abschmecken.
- Fett, das nur zum Anbraten, Braten oder Einfetten dient (Öl, Butter, Ghee): "qty": null, "unit": null, "note": "zum Anbraten". Eine Menge nur angeben, wenn das Fett wesentlich ist (Dressing, Soße, Pesto, Marinade, Teig, Backen).`;
function importPrompt(url, text, note, canRead) {
  if (note) text = (text ? text + "\n\n" : "") + "WICHTIG – Anmerkung des Nutzers, unbedingt ins Rezept einarbeiten (Mengen anpassen, Zutaten ergänzen oder weglassen, Schritte und Zeiten entsprechend ändern): " + note;
  return `Du wandelst ein Rezept in strukturierte Daten für eine Koch-App um. Antworte NUR mit einem JSON-Objekt nach diesem Schema, ohne Erklärtext:
${RECIPE_SCHEMA}

Regeln:
- Alles auf Deutsch, metrische Einheiten (Cups, oz, lbs umrechnen). Mengen als Zahl für die angegebene Portionszahl; "servings" ist die Portionszahl des Originals (sonst 2).
- "staple": true nur für Salz, Pfeffer und Wasser.
- "swaps": Für jede Fleisch- oder Fisch-Zutat 2-3 konkrete vegetarische/vegane Alternativen (z. B. Speck → vegetarische Speckwürfel, vegane Speckwürfel, Halloumi-Würfel). Ist das Gericht vegetarisch, gib vegane Alternativen für Käse, Sahne, Ei usw. Ist es vegan: [].
- Zeiten in Minuten und REALISTISCH für einen normalen Hobbykoch: Schälen, Schneiden, Wasser aufkochen, Vorheizen, Anbraten in mehreren Portionen und Abwasch zwischendurch einrechnen. Rezeptangaben sind fast immer zu optimistisch. "prep" = Vorbereitung, "cook" = Garen/Backen, "total" = realistische Gesamtzeit bis zum Essen (inkl. Wartezeiten). "stated" = die in der Quelle genannte Gesamtzeit oder null.
${canRead ? `- Der Inhalt des Links ist dir zugänglich (das YouTube-Video ist beigefügt bzw. die Webseite kannst du über das URL-Tool lesen). Nimm Zutaten, Mengen, Schritte und Portionen genau daraus. "confidence" dann "hoch", "sourceNote" z. B. "Aus dem Video übernommen". Gib zusätzlich "imageUrl" an: die Adresse des Hauptbilds der Webseite (og:image), falls bekannt, sonst "".
- Falls du den Link trotzdem nicht lesen kannst:` : "- Du kannst Links NICHT öffnen und Videos nicht ansehen."} Wenn nur ein Link vorliegt: Steht der Name des Gerichts lesbar in der URL (z. B. chefkoch.de/rezepte/.../Lasagne-alla-Bolognese.html), erstelle ein typisches, gut kochbares Rezept dafür, setze "confidence" auf "niedrig" und schreibe in "sourceNote", dass die Angaben aus dem Link geschätzt sind.
- Steht das Gericht NICHT erkennbar in der URL (z. B. YouTube-, Shorts-, Instagram- oder TikTok-Links mit Nummern-IDs) und verraten weder Text, Anmerkung noch Foto, um welches Gericht es geht: ERFINDE NICHTS. Antworte dann nur mit {"error": "unbekannt"}.
- Wenn Text vorliegt (Webseite, Videobeschreibung, Transkript): halte dich genau an dessen Zutaten und Mengen.
- Wenn der Nutzer frei beschreibt, was er selbst gekocht hat (oft diktiert, umgangssprachlich, mit "so ungefähr"): mach daraus ein sauberes, nachkochbares Rezept mit seinen Zutaten, Mengen und Portionen; ergänze nur offensichtlich fehlende Schritte. "confidence" dann "hoch", "sourceNote" = "Selbst gekocht".
- Wenn Fotos dabei sind: Lies Screenshots von Rezepten/Zutatenlisten genau aus; Fotos vom fertigen Gericht nutze, um das Gericht und die Zutaten besser zu erkennen.

Link: ${url || "(keiner)"}
Eingefügter Text:
${text ? text.slice(0, 18000) : "(keiner)"}`;
}
function cleanRecipe(r, url) {
  if (!r || typeof r !== "object") throw new Error("leer");
  if (r.error) throw { code: "unknown_dish" };
  const unitOk = u => UNITS.includes(u) ? u : (u === "Stück" ? "Stk" : null);
  const n = v => (typeof v === "number" && isFinite(v)) ? v : (v != null && !isNaN(parseFloat(String(v).replace(",", "."))) ? parseFloat(String(v).replace(",", ".")) : null);
  const out = {
    title: String(r.title || "Neues Rezept").slice(0, 120),
    url: url || r.url || "",
    servings: Math.max(1, Math.round(n(r.servings) || 2)),
    category: CATEGORIES.includes(r.category) ? r.category : "Sonstiges",
    seasons: (Array.isArray(r.seasons) ? r.seasons : []).filter(s => SEASONS.includes(s)),
    tags: (Array.isArray(r.tags) ? r.tags : []).map(t => String(t).toLowerCase().slice(0, 40)).slice(0, 20),
    ingredients: (Array.isArray(r.ingredients) ? r.ingredients : []).map(i => ({
      name: String(i.name || "").slice(0, 60), qty: n(i.qty), unit: unitOk(i.unit), note: String(i.note || "").slice(0, 80),
      aisle: AISLE_ORDER.includes(i.aisle) ? i.aisle : (catalogFor(i.name)?.aisle || "Sonstiges"),
      staple: !!i.staple || STAPLES.includes(fold(i.name)),
      role: i.role === "haupt" || i.role === "neben" ? i.role : null,
    })).filter(i => i.name).map(i => { if (isFryFat(i)) { i.qty = null; i.unit = null; } if (!i.role) i.role = ingRole(i); return i; }),
    steps: (Array.isArray(r.steps) ? r.steps : []).map(s => String(s)).slice(0, 30),
    time: { prep: n(r.time?.prep), cook: n(r.time?.cook), total: n(r.time?.total), stated: n(r.time?.stated), why: String(r.time?.why || "") },
    confidence: ["hoch","mittel","niedrig"].includes(r.confidence) ? r.confidence : "mittel",
    sourceNote: String(r.sourceNote || ""),
    diet: ["vegan","vegetarisch","pescetarisch","mit Fleisch"].includes(r.diet) ? r.diet : null,
    swaps: (Array.isArray(r.swaps) ? r.swaps : []).filter(x => x && x.original).slice(0, 8).map(x => ({
      original: String(x.original).slice(0, 60), alternatives: (Array.isArray(x.alternatives) ? x.alternatives : []).map(a => String(a).slice(0, 60)).slice(0, 4), tip: String(x.tip || "").slice(0, 160) })),
  };
  if (!out.diet) out.diet = guessDiet(out.ingredients.map(i => i.name));
  if (!out.seasons.length) out.seasons = SEASONS.slice();
  if (out.time.total == null && (out.time.prep != null || out.time.cook != null)) out.time.total = (out.time.prep || 0) + (out.time.cook || 0);
  return out;
}
/* ---------- Diktieren ---------- */
/* Nutzt die Spracherkennung des Browsers, wenn sie hier erlaubt ist; sonst Diktieren über die Handy-Tastatur. */
function setupDictation(ta, btn, label, hint) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, on = false, baseText = "";
  const fallback = () => {
    on = false; btn.classList.remove("rec"); label.textContent = "Tippen und erzählen";
    hint.innerHTML = "<b>Sprechen:</b> Tipp ins Textfeld und dann auf das Mikrofon unten an deiner Tastatur. Danach einfach drauflos erzählen.";
    ta.focus();
  };
  const stop = () => { if (rec && on) { try { rec.stop(); } catch (e) {} } on = false; btn.classList.remove("rec"); label.textContent = "Tippen und erzählen"; };
  btn.onclick = () => {
    if (on) { stop(); return; }
    if (!SR) { fallback(); return; }
    try {
      rec = new SR(); rec.lang = "de-DE"; rec.continuous = true; rec.interimResults = true;
      baseText = ta.value ? ta.value.replace(/\s*$/, " ") : "";
      rec.onresult = e => {
        let fin = "", tmp = "";
        for (let i = 0; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) fin += t + " "; else tmp += t; }
        ta.value = baseText + fin + tmp;
      };
      rec.onerror = e => { if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") { rec = null; fallback(); } };
      rec.onend = () => { if (on) { baseText = ta.value.replace(/\s*$/, " "); try { rec.start(); } catch (e) { stop(); } } };
      rec.start(); on = true; btn.classList.add("rec"); label.textContent = "Hört zu … tippen zum Stoppen";
      hint.textContent = "Erzähl einfach drauflos: Zutaten, ungefähre Mengen, was du gemacht hast, wie viele Portionen.";
    } catch (e) { fallback(); }
  };
  return { stop };
}

/* ---------- Fotos ---------- */
function ytId(url) {
  const m = String(url || "").match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
function isVideoUrl(url) { return /(youtube\.com|youtu\.be|instagram\.com|tiktok\.com|facebook\.com\/reel|fb\.watch)/i.test(String(url || "")); }
function srcHost(url) { try { const h = new URL(url).hostname.replace(/^www\.|^m\./, ""); return h === "youtu.be" ? "youtube.com" : h; } catch (e) { return ""; } }
function ytThumb(url) { const id = ytId(url); return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null; }
function loadImage(file) {
  return new Promise((res, rej) => { const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { res(img); }; img.onerror = rej; img.src = url; });
}
function drawScaled(img, max) {
  const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c;
}
/* Kleines Vorschaubild zum Speichern (~40-70 KB) und größere Version, damit Claude Text lesen kann */
async function prepPhoto(file) {
  const img = await loadImage(file);
  const small = drawScaled(img, 720).toDataURL("image/jpeg", 0.68);
  const big = await new Promise(r => drawScaled(img, 1568).toBlob(r, "image/jpeg", 0.85));
  return { small, big };
}
function photoTag(r, cls) {
  if (r && (r.photo || r.photoUrl)) return `<img class="${cls}" src="${esc(r.photo || r.photoUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'${cls} ph',textContent:${JSON.stringify("Rezept")}}))">`;
  return `<div class="${cls} ph" aria-hidden="true">${esc((r && r.category) || "Rezept")}</div>`;
}
function pickPhotos(multiple) {
  return new Promise(res => {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.multiple = !!multiple; inp.className = "vh";
    inp.onchange = () => { res([...inp.files]); inp.remove(); };
    document.body.appendChild(inp); inp.click();
  });
}

/* ---------- Ernährung ---------- */
const MEAT = ["speck","hack","hahnchen","huhn","pute","rind","schwein","schinken","salami","chorizo","wurst","wurstchen","pancetta","guanciale","lamm","steak","gulasch","bacon","fleisch","ente","kalb","leberkas"];
const FISH = ["lachs","thunfisch","garnele","kabeljau","forelle","fisch","sardelle","shrimp","scampi","muschel","tintenfisch","sardine"];
const ANIMAL = ["milch","sahne","butter","kase","parmesan","pecorino","mozzarella","burrata","feta","halloumi","gouda","emmentaler","cheddar","ricotta","mascarpone","ei","eier","joghurt","quark","schmand","creme fraiche","saure sahne","honig","frischkase"];
function guessDiet(names) {
  const f = names.map(n => fold(n)).filter(n => !/vegan|vegetar|veggie|pflanzlich|ersatz|soja|tofu|seitan|hafer/.test(n));
  const has = list => f.some(n => list.some(w => n.split(" ").some(x => x === w || x.startsWith(w) || (w.length > 4 && x.endsWith(w)))));
  if (has(MEAT)) return "mit Fleisch";
  if (has(FISH)) return "pescetarisch";
  if (has(ANIMAL)) return "vegetarisch";
  return names.length ? "vegan" : null;
}
function baseDiet(r) { return r.diet || guessDiet((r.ingredients || []).map(i => i.name)); }
function dietOf(r) { return r.swapSel && Object.keys(r.swapSel).length ? guessDiet(ings(r).map(i => i.name)) : baseDiet(r); }
/* Zutaten mit gewählten Ersatz-Zutaten (z. B. Halloumi statt Speck) */
function ings(r) {
  const sel = r.swapSel || {};
  if (!r.swaps || !Object.keys(sel).length) return r.ingredients || [];
  return (r.ingredients || []).map(i => {
    const sw = r.swaps.find(x => sel[x.original] && matchesName(i.name, x.original));
    if (!sw) return i;
    const alt = sel[sw.original];
    return { ...i, name: alt, origName: i.name, aisle: catalogFor(alt)?.aisle || i.aisle, staple: false };
  });
}
function dietPill(d) {
  if (!d) return "";
  const map = { "vegan": ["Vegan", "good"], "vegetarisch": ["Vegetarisch", "good"], "pescetarisch": ["Fisch", "neutral"], "mit Fleisch": ["Fleisch", "neutral"] };
  const [l, c] = map[d] || [d, "neutral"];
  return `<span class="pill ${c}">${l}</span>`;
}

/* ---------- Vorrat-Abgleich ---------- */
function catalogFor(name) { const f = stem(name); return CATALOG.find(c => stem(c.name) === f) || null; }
function matchesName(a, b) {
  const fa = fold(a), fb = fold(b);
  if (!fa || !fb) return false;
  if (fa === fb || stem(fa) === stem(fb)) return true;
  const wa = words(a), wb = words(b);
  const ja = wa.join(" "), jb = wb.join(" ");
  if (wa.length === 1 && wb.includes(wa[0])) return true;
  if (wb.length === 1 && wa.includes(wb[0])) return true;
  return ja.length > 3 && jb.length > 3 && (jb.includes(ja) || ja.includes(jb));
}
/* Fächer: owner = Nutzer-ID (eigenes Fach) oder leer (gemeinsam). Nutzbar ist Gemeinsames und das eigene Fach. */
const usable = p => !p.owner || p.owner === S.me || !Store.shareMode();
function pantryMatches(name) { return S.pantry.filter(p => usable(p) && matchesName(p.name, name)); }
function othersHave(name, unit) {
  const d = base(1, unit)?.d;
  const by = {};
  S.pantry.filter(p => !usable(p) && matchesName(p.name, name) && p.qty > 0 && base(1, p.unit)?.d === d).forEach(p => {
    if (!by[p.owner]) by[p.owner] = { owner: p.owner, qty: 0, unit: p.unit, items: [] };
    const pb = base(p.qty, p.unit); by[p.owner].qty += fromBase(pb.v, by[p.owner].unit); by[p.owner].items.push(p.id);
  });
  return Object.values(by);
}
function defaultOwner(fromPlan) { return Store.shareMode() && S.household === "wg" && !fromPlan ? S.me : null; }
function ingStatus(ing, factor) {
  if (ing.staple) return { st: "staple" };
  const q = qtyOf(ing); const need = q != null ? q * factor : null;
  const m = pantryMatches(ing.name);
  if (!m.length) return { st: "missing", buy: need, have: null, others: Store.shareMode() ? othersHave(ing.name, ing.unit) : [] };
  if (need == null) return { st: "have", have: m };
  const nb = base(need, ing.unit);
  let haveV = 0, comparable = false;
  m.forEach(p => { const pb = base(p.qty, p.unit); if (pb && nb && pb.d === nb.d) { haveV += pb.v; comparable = true; } });
  if (!comparable) return { st: "check", have: m };
  if (haveV >= nb.v - 1e-9) return { st: "have", have: m };
  return { st: "partial", buy: fromBase(nb.v - haveV, ing.unit), have: m, others: Store.shareMode() ? othersHave(ing.name, ing.unit) : [] };
}
/* Haupt- und Nebenzutaten; Bratfett ohne Mengenangabe */
const FATS = ["ol", "olivenol", "sonnenblumenol", "rapsol", "butter", "ghee", "butterschmalz", "kokosol", "pflanzenol", "bratol"];
function isFat(name) { const w = fold(name).split(" "); return w.some(x => FATS.includes(x)); }
function isFryFat(i) { return isFat(i.name) && /anbrat|braten|einfett|pfanne|zum fetten|fur die form/.test(fold(i.note || "")); }
function qtyOf(i) { return isFryFat(i) ? null : i.qty; }
const NEBEN_AISLES = ["Gewürze, Öle & Saucen"];
function ingRole(i) {
  if (i.role === "haupt" || i.role === "neben") return i.role;
  if (i.staple || isFryFat(i) || isFat(i.name) && (i.qty == null || ["EL", "TL", "Prise"].includes(i.unit))) return "neben";
  const a = i.aisle || catalogFor(i.name)?.aisle;
  if (NEBEN_AISLES.includes(a) && !/tomat|kokosmilch|brühe|bruhe|pesto/.test(fold(i.name))) return "neben";
  return "haupt";
}
function availability(r) {
  const f = 1; let total = 0, ok = 0;
  ings(r).forEach(i => { if (i.staple || ingRole(i) === "neben") return; total++; const s = ingStatus(i, f).st; if (s === "have" || s === "check") ok++; });
  return { total, ok, frac: total ? ok / total : 1 };
}
function addToPantry(name, qty, unit, place, owner) {
  if (owner === undefined) owner = defaultOwner();
  const ex = S.pantry.find(p => fold(p.name) === fold(name) && (p.owner || null) === (owner || null) && (base(1, p.unit)?.d === base(1, unit)?.d));
  if (ex) {
    const a = base(ex.qty || 0, ex.unit), b = base(qty || 0, unit);
    ex.qty = roundQty(fromBase(a.v + b.v, ex.unit), ex.unit);
  } else S.pantry.push({ id: uid(), name, qty, unit, place: place || defaultPlace(name), owner: owner || null });
}
function defaultPlace(name) {
  const c = catalogFor(name); const a = c ? c.aisle : "";
  if (a === "Kühlregal" || a === "Fleisch & Fisch") return "Kühlschrank";
  if (a === "Tiefkühl") return "Tiefkühler";
  return "Vorrat";
}
function addToShopping(name, qty, unit, aisle, from, due) {
  const ex = S.shopping.find(s => !s.checked && matchesName(s.name, name) && ((qty == null && s.qty == null) || (base(1, s.unit)?.d === base(1, unit)?.d)));
  if (ex) {
    if (qty != null && ex.qty != null) { const a = base(ex.qty, ex.unit), b = base(qty, unit); ex.qty = roundQty(fromBase(a.v + b.v, ex.unit), ex.unit); }
    if (from && !(ex.from || []).includes(from)) ex.from = [...(ex.from || []), from];
    if (due && (!ex.due || due < ex.due)) ex.due = due;
  } else S.shopping.push({ id: uid(), name, qty: qty == null ? null : roundQty(qty, unit), unit, aisle: aisle || catalogFor(name)?.aisle || "Sonstiges", checked: false, from: from ? [from] : [], due: due || null, by: S.me || null });
}

/* ---------- Suche ---------- */
function suggestions(q) {
  const fq = fold(q); if (!fq) return [];
  const pool = new Map();
  CATALOG.forEach(c => pool.set(fold(c.name), c));
  S.pantry.forEach(p => { if (!pool.has(fold(p.name))) pool.set(fold(p.name), { name: p.name, unit: p.unit, aisle: catalogFor(p.name)?.aisle || "Sonstiges" }); });
  Object.values(S.recipes).forEach(r => r.ingredients.forEach(i => { if (!i.staple && !pool.has(fold(i.name))) pool.set(fold(i.name), { name: i.name, unit: i.unit || "Stk", aisle: i.aisle }); }));
  const scored = [];
  pool.forEach((c, k) => {
    let s = -1;
    if (k.startsWith(fq)) s = 0; else if (k.split(" ").some(w => w.startsWith(fq))) s = 1; else if (k.includes(fq)) s = 2;
    if (s >= 0) scored.push({ c, s, len: k.length });
  });
  scored.sort((a, b) => a.s - b.s || a.len - b.len || a.c.name.localeCompare(b.c.name, "de"));
  return scored.slice(0, 7).map(x => x.c);
}
const SEARCH_KEYS = { sommer:"sommer", winter:"winter", herbst:"herbst", fruhling:"fruhling", pasta:"pasta", nudel:"pasta", spaghetti:"pasta", suppe:"suppe", eintopf:"eintopf", salat:"salat", curry:"curry", auflauf:"auflauf", ofen:"ofen", vegan:"vegan", vegetarisch:"vegetarisch", veggie:"vegetarisch", schnell:"schnell", leicht:"leicht", deftig:"deftig", scharf:"scharf", cremig:"cremig", fisch:"fisch", fleisch:"fleisch", hahnchen:"hahnchen", huhn:"hahnchen", reis:"reis", bowl:"bowl", fruhstuck:"fruhstuck", dessert:"dessert", kuchen:"backen", wurzig:"wurzig", warmend:"warmend", frisch:"frisch" };
function queryTokens(q) {
  const out = [];
  fold(q).split(" ").filter(Boolean).forEach(w => {
    if (["mit","und","eine","ein","was","fur","ich","will","essen","gericht","rezept","rezepte","so","richtig","schone","schon","ganz"].includes(w)) return;
    w = w.replace(/lich(e|es|er|en)?$/, "").replace(/s$/, "");
    if (SEARCH_KEYS[w]) { out.push([SEARCH_KEYS[w]]); return; }
    const hits = Object.keys(SEARCH_KEYS).filter(k => w.includes(k));
    const cover = hits.reduce((n, k) => n + k.length, 0);
    if (hits.length && cover / w.length >= 0.45) hits.forEach(k => out.push([SEARCH_KEYS[k]]));
    else out.push([w.length > 4 ? stem(w) : w]);
  });
  return out;
}
function recipeHay(r) { return fold([r.title, r.category, ...(r.tags || []), ...(r.seasons || []), ...ings(r).map(i => i.name)].join(" ")); }
function filteredRecipes() {
  let list = Object.entries(S.recipes).map(([id, r]) => ({ id, r, av: availability(r) }));
  const toks = queryTokens(S.recipeQuery);
  if (toks.length) list = list.filter(({ r }) => { const h = recipeHay(r); return toks.every(alts => alts.some(t => h.includes(t))); });
  if (S.catFilter) list = list.filter(({ r }) => r.category === S.catFilter);
  if (S.seasonFilter) list = list.filter(({ r }) => (r.seasons || []).includes(S.seasonFilter));
  if (S.sort === "da") list.sort((a, b) => b.av.frac - a.av.frac || (a.r.time?.total || 999) - (b.r.time?.total || 999));
  else if (S.sort === "zeit") list.sort((a, b) => (a.r.time?.total || 999) - (b.r.time?.total || 999));
  else list.sort((a, b) => (b.r.createdAt || 0) - (a.r.createdAt || 0));
  return list;
}

/* ---------- UI-Helfer ---------- */
const $ = s => document.querySelector(s);
const ICON = {
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  cal: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  people: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14c2.4.2 4 1.7 4.5 4.5"/></svg>',
  spark: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3.5 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-2 1-3.2 2-4 .3 1.6 1 2.5 2 2.5 0-3 .5-5.5.5-8z"/><path d="M12 20.5c-1.4 0-2.3-1-2.3-2.3 0-1.5 1.3-2.2 2.3-3.7 1 1.5 2.3 2.2 2.3 3.7 0 1.3-.9 2.3-2.3 2.3z"/></svg>',
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>',
  mic: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  camera: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
  fridge: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M5 10h14M9 6v2M9 13v3"/></svg>',
  book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/><path d="M9 8h7"/></svg>',
  cart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2"/><circle cx="10" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
};
let toastTimer;
function toast(msg) {
  let t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 2600);
}
function openSheet(html, mount) {
  const o = $("#overlay");
  o.innerHTML = `<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  $("#scrim").addEventListener("click", e => { if (e.target.id === "scrim") closeSheet(); });
  if (mount) mount(o.querySelector(".sheet"));
}
function closeSheet() { $("#overlay").innerHTML = ""; S.queueSheet = null; }

/* ---------- Mehrere Links: Warteschlange ---------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
function extractUrls(t) { return [...new Set((String(t || "").match(/https?:\/\/[^\s<>"'„“]+/g) || []).map(u => u.replace(/[),.;!?]+$/, "")))]; }
function linkReadable(url) { return typeof AI !== "undefined" && (AI.canWatch(url) || AI.canRead(url)); }
const QSTATE = { wartet: ["Wartet", "neutral"], läuft: ["Läuft …", "warn"], fertig: ["Fertig", "good"], hinweis: ["Braucht Hinweis", "warn"], fehler: ["Fehler", "bad"], doppelt: ["Schon da", "neutral"] };
function queueAdd(urls, note) {
  urls.forEach(u => { if (!S.queue.items.some(x => x.url === u && x.status !== "fertig")) S.queue.items.push({ id: uid(), url: u, status: "wartet", note: note || "", msg: "" }); });
  queueRun();
}
function queueCounts() { const c = {}; S.queue.items.forEach(x => c[x.status] = (c[x.status] || 0) + 1); return c; }
function queueCardHtml() {
  const Q = S.queue; if (!Q.items.length) return `<div id="q-card"></div>`;
  const c = queueCounts(), total = Q.items.length, done = total - (c.wartet || 0) - (c["läuft"] || 0);
  const running = c.wartet || c["läuft"];
  return `<div id="q-card" class="profile" style="margin-bottom:12px">
    <div class="row" style="justify-content:space-between"><b>${running ? "Import läuft" : "Import fertig"}</b><span class="num small">${done} von ${total}</span></div>
    <div class="bar" aria-hidden="true"><i style="width:${Math.round(done / total * 100)}%"></i></div>
    <span class="small muted">${c.fertig || 0} fertig${c.hinweis ? ` · ${c.hinweis} brauchen einen Hinweis` : ""}${c.fehler ? ` · ${c.fehler} Fehler` : ""}${c.doppelt ? ` · ${c.doppelt} schon da` : ""}${running ? " · App bitte offen lassen" : ""}</span>
    <button class="btn" data-queue-open>Liste ansehen</button></div>`;
}
function queueRefresh() {
  if (S.queueSheet && document.contains(S.queueSheet)) drawQueue(S.queueSheet);
  const el = $("#q-card"); if (el) el.outerHTML = queueCardHtml();
}
document.addEventListener("click", e => { if (e.target.closest("[data-queue-open]")) queueSheet(); });
function queueSheet() { openSheet("", sh => { S.queueSheet = sh; drawQueue(sh); }); }
function drawQueue(sh) {
  const Q = S.queue, c = queueCounts();
  const keep = {}; sh.querySelectorAll("[data-qnote]").forEach(i => keep[i.dataset.qnote] = i.value);
  sh.innerHTML = `<h3>Import-Liste</h3>
    <div class="list">${Q.items.map(it => { const [l, cls] = QSTATE[it.status] || ["", "neutral"]; return `
      <div class="item" style="flex-direction:column;align-items:stretch;gap:6px">
        <div class="row" style="gap:10px">${it.status === "läuft" ? `<span class="spinner" style="color:var(--warm)"></span>` : ""}
          <span class="grow small" style="overflow-wrap:anywhere">${it.title ? `<b>${esc(it.title)}</b><br>` : ""}<span class="muted tiny">${esc(it.url)}</span></span>
          <span class="pill ${cls}">${l}</span></div>
        ${it.msg && it.status !== "fertig" ? `<span class="small muted">${esc(it.msg)}</span>` : ""}
        ${it.status === "fertig" ? `<button class="linkbtn small" data-qopen="${it.recipeId}" style="align-self:flex-start">Rezept öffnen</button>` : ""}
        ${it.status === "hinweis" || it.status === "fehler" ? `<div class="row"><input class="grow" data-qnote="${it.id}" value="${esc(keep[it.id] ?? it.note ?? "")}" placeholder="Was wird gekocht? z. B. Gnocchi mit Feta" style="border:1px solid var(--line);background:var(--bg);border-radius:10px;padding:9px 10px"><button class="btn" data-qretry="${it.id}">Nochmal</button></div>` : ""}
      </div>`; }).join("")}</div>
    <div class="row" style="flex-wrap:wrap">${c.wartet || c["läuft"] ? `<button class="btn grow" id="q-stop">Anhalten</button>` : Q.items.some(x => x.status === "wartet") ? "" : ""}
      ${!Q.running && c.wartet ? `<button class="btn primary grow" id="q-go">Weiter</button>` : ""}
      <button class="btn grow" id="q-clean">Erledigte entfernen</button><button class="btn grow" id="q-close">Schließen</button></div>`;
  sh.querySelectorAll("[data-qopen]").forEach(b => b.onclick = () => { closeSheet(); S.openRecipe = b.dataset.qopen; render(); window.scrollTo(0, 0); });
  sh.querySelectorAll("[data-qretry]").forEach(b => b.onclick = () => { const it = Q.items.find(x => x.id === b.dataset.qretry); const inp = sh.querySelector(`[data-qnote="${it.id}"]`); it.note = inp ? inp.value.trim() : it.note; it.status = "wartet"; it.msg = ""; it.retried = false; queueRun(); queueRefresh(); });
  const st = sh.querySelector("#q-stop"); if (st) st.onclick = () => { Q.stop = true; toast("Wird nach dem aktuellen Link angehalten"); };
  const go = sh.querySelector("#q-go"); if (go) go.onclick = () => queueRun();
  sh.querySelector("#q-clean").onclick = () => { Q.items = Q.items.filter(x => !["fertig", "doppelt"].includes(x.status)); queueRefresh(); if (!Q.items.length) { closeSheet(); render(); } };
  sh.querySelector("#q-close").onclick = () => { closeSheet(); render(); };
}
async function queueRun() {
  const Q = S.queue; if (Q.running) return; Q.running = true; Q.stop = false; queueRefresh();
  while (!Q.stop) {
    const it = Q.items.find(x => x.status === "wartet"); if (!it) break;
    it.status = "läuft"; it.msg = ""; queueRefresh();
    try {
      if (Object.values(S.recipes).some(r => r.url && r.url === it.url)) { it.status = "doppelt"; it.msg = "Ist schon in deinen Rezepten."; }
      else if (isVideoUrl(it.url) && !linkReadable(it.url) && !it.note) { it.status = "hinweis"; it.msg = "Das Video kann die KI hier nicht ansehen. Schreib kurz, was gekocht wird."; }
      else {
        const raw = await askClaudeJSON(importPrompt(it.url, "", it.note || "", linkReadable(it.url)), [], { link: it.url });
        const r = cleanRecipe(raw, it.url); if (!r.ingredients.length) throw new Error("leer");
        r.createdAt = Date.now();
        if (typeof AI !== "undefined") { if (ytThumb(it.url)) r.photoUrl = ytThumb(it.url); else if (raw && /^https:\/\//.test(raw.imageUrl || "")) r.photoUrl = raw.imageUrl; }
        const id = "r_" + uid(); S.recipes[id] = r; Store.save(id);
        it.status = "fertig"; it.recipeId = id; it.title = r.title;
        if (r.confidence === "niedrig") it.msg = "Nur aus dem Link geschätzt.";
        if (S.tab === "rezepte" && !S.openRecipe && !S.queueSheet && !S.settingsOpen && document.activeElement?.id !== "r-search" && !$("#overlay").innerHTML) render();
      }
    } catch (e) {
      if (e && e.code === "unknown_dish") { it.status = "hinweis"; it.msg = "Gericht nicht erkennbar. Schreib kurz, was gekocht wird."; }
      else if (e && e.code === "rate_limited" && !it.retried) { it.retried = true; it.status = "wartet"; it.msg = "Kurze Pause wegen Limit …"; queueRefresh(); await sleep(30000); continue; }
      else if (e && ["budget", "not_granted", "bad_key", "no_credit"].includes(e.code)) { it.status = "fehler"; it.msg = sampleErrorText(e); Q.stop = true; }
      else { it.status = "fehler"; it.msg = sampleErrorText(e); }
    }
    queueRefresh();
    if (Q.items.some(x => x.status === "wartet")) await sleep(typeof AI !== "undefined" && AI.provider() === "gemini" ? 4500 : 1500);
  }
  Q.running = false; queueRefresh();
  if (!Q.items.some(x => x.status === "wartet")) { const n = Q.items.filter(x => x.status === "fertig").length; toast(`Import fertig: ${n} ${n === 1 ? "Rezept" : "Rezepte"}`); if (S.tab === "rezepte" && !S.openRecipe && !S.queueSheet) render(); }
}
function confirmSheet(title, text, okLabel, onOk, danger) {
  openSheet(`<h3>${esc(title)}</h3><p class="muted" style="margin:0">${esc(text)}</p>
    <div class="row"><button class="btn grow" id="c-no">Abbrechen</button><button class="btn grow ${danger ? "danger" : "primary"}" id="c-ok">${esc(okLabel)}</button></div>`, sh => {
    sh.querySelector("#c-no").onclick = closeSheet;
    sh.querySelector("#c-ok").onclick = () => { closeSheet(); onOk(); };
  });
}

/* Mengen-Sheet: für Vorrat und Einkaufsliste */
function qtySheet({ title, name, qty, unit, place, showPlace, okLabel, onOk, onDelete, owner, showOwner }) {
  let st = { qty: qty ?? 1, unit: unit || "Stk", place: place || defaultPlace(name), owner: owner === undefined ? defaultOwner() : owner };
  showOwner = showOwner && Store.shareMode() && (!st.owner || st.owner === S.me);
  openSheet(`
    <h3>${esc(title)}</h3>
    <div class="field"><label for="qs-name">Name</label><input id="qs-name" value="${esc(name)}" autocomplete="off"></div>
    <div class="field"><label for="qs-qty">Menge</label>
      <div class="qtyrow"><button class="qtybtn" id="qs-minus" aria-label="weniger">−</button><input id="qs-qty" inputmode="decimal" value="${esc(fmtNum(st.qty))}"><button class="qtybtn" id="qs-plus" aria-label="mehr">+</button>
      <select id="qs-unit" aria-label="Einheit">${UNITS.map(u => `<option ${u === st.unit ? "selected" : ""}>${u}</option>`).join("")}</select></div></div>
    ${showPlace ? `<div class="field"><label>Wo?</label><div class="seg" id="qs-place">${PLACES.map(p => `<button type="button" data-p="${p}" aria-pressed="${p === st.place}">${p}</button>`).join("")}</div></div>` : ""}
    ${showOwner ? `<div class="field"><label>Wem gehört's?</label><div class="seg" id="qs-owner" style="grid-template-columns:1fr 1fr"><button type="button" data-o="me" aria-pressed="${st.owner === S.me}">Mein Fach</button><button type="button" data-o="" aria-pressed="${!st.owner}">Gemeinsam</button></div></div>` : ""}
    <div class="row">${onDelete ? `<button class="btn danger" id="qs-del">Entfernen</button>` : ""}<button class="btn primary grow" id="qs-ok">${esc(okLabel)}</button></div>`, sh => {
    const qi = sh.querySelector("#qs-qty"), ui = sh.querySelector("#qs-unit");
    const read = () => { const v = parseFloat(qi.value.replace(",", ".")); return isNaN(v) ? 0 : v; };
    sh.querySelector("#qs-minus").onclick = () => { const v = read(); qi.value = fmtNum(Math.max(0, Math.round((v - stepFor(ui.value, v)) * 100) / 100)); };
    sh.querySelector("#qs-plus").onclick = () => { const v = read(); qi.value = fmtNum(Math.round((v + stepFor(ui.value, v)) * 100) / 100); };
    if (showOwner) sh.querySelectorAll("#qs-owner button").forEach(b => b.onclick = () => { st.owner = b.dataset.o ? S.me : null; sh.querySelectorAll("#qs-owner button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
    if (showPlace) sh.querySelectorAll("#qs-place button").forEach(b => b.onclick = () => { st.place = b.dataset.p; sh.querySelectorAll("#qs-place button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
    sh.querySelector("#qs-ok").onclick = () => {
      const nm = sh.querySelector("#qs-name").value.trim(); if (!nm) return;
      closeSheet(); onOk({ name: nm, qty: read(), unit: ui.value, place: st.place, owner: st.owner });
    };
    if (onDelete) sh.querySelector("#qs-del").onclick = () => { closeSheet(); onDelete(); };
    qi.focus(); qi.select();
  });
}

/* Autovervollständigung */
function attachAutocomplete(input, box, onPick) {
  let hl = 0, items = [];
  const draw = () => {
    const q = input.value.trim();
    items = suggestions(q);
    if (!q) { box.hidden = true; box.innerHTML = ""; return; }
    const exact = items.some(i => fold(i.name) === fold(q));
    const fq = fold(q);
    const rows = items.map((c, i) => {
      const inP = pantryMatches(c.name).filter(p => fold(p.name) === fold(c.name))[0];
      const nm = esc(c.name); const k = fold(c.name).indexOf(fq);
      const label = k === 0 ? `<b>${esc(c.name.slice(0, q.length))}</b>${esc(c.name.slice(q.length))}` : nm;
      return `<button type="button" data-i="${i}" class="${i === hl ? "hl" : ""}"><span>${label}</span><span class="muted tiny">${inP ? "da: " + esc(fmtQty(inP.qty, inP.unit)) : esc(c.aisle)}</span></button>`;
    });
    if (!exact) rows.push(`<button type="button" data-new="1"><span>„${esc(q)}“ neu anlegen</span><span class="muted tiny">eigener Eintrag</span></button>`);
    box.innerHTML = rows.join(""); box.hidden = false;
    box.querySelectorAll("button").forEach(b => b.onmousedown = e => e.preventDefault());
    box.querySelectorAll("button").forEach(b => b.onclick = () => {
      const c = b.dataset.new ? { name: q.charAt(0).toUpperCase() + q.slice(1), unit: "Stk", aisle: "Sonstiges" } : items[+b.dataset.i];
      input.value = ""; box.hidden = true; onPick(c);
    });
  };
  input.addEventListener("input", () => { hl = 0; draw(); });
  input.addEventListener("focus", draw);
  input.addEventListener("blur", () => setTimeout(() => { box.hidden = true; }, 150));
  input.addEventListener("keydown", e => {
    if (box.hidden) return;
    const n = box.querySelectorAll("button").length;
    if (e.key === "ArrowDown") { hl = Math.min(n - 1, hl + 1); draw(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { hl = Math.max(0, hl - 1); draw(); e.preventDefault(); }
    else if (e.key === "Enter") { const b = box.querySelectorAll("button")[hl]; if (b) b.click(); e.preventDefault(); }
    else if (e.key === "Escape") { box.hidden = true; }
  });
}

/* ---------- Hell / Dunkel ---------- */
const THEMES = { auto: "Automatisch (wie dein Handy)", light: "Hell", dark: "Dunkel" };
let themeMode = "auto";
try { themeMode = localStorage.getItem("kuechenplan-theme") || "auto"; } catch (e) {}
function applyTheme() {
  const r = document.documentElement;
  r.classList.toggle("m-light", themeMode === "light");
  r.classList.toggle("m-dark", themeMode === "dark");
}
applyTheme();
function themeBtn() { return `<button class="themebtn" data-settings-btn aria-label="Einstellungen" title="Einstellungen"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button>` + themeToggleBtn(); }
function themeToggleBtn() {
  const ic = themeMode === "light" ? '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>'
    : themeMode === "dark" ? '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'
    : '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor"/>';
  return `<button class="themebtn" data-theme-btn aria-label="Darstellung: ${THEMES[themeMode]}. Tippen zum Wechseln" title="${THEMES[themeMode]}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic}</svg></button>`;
}
document.addEventListener("click", e => {
  if (e.target.closest("[data-settings-btn]")) { S.settingsOpen = true; S.openRecipe = null; render(); window.scrollTo(0, 0); return; }
  if (e.target.closest("[data-budgetbar]")) { S.settingsOpen = true; S.openRecipe = null; render(); window.scrollTo(0, 0); return; }
  const b = e.target.closest("[data-theme-btn]"); if (!b) return;
  themeMode = themeMode === "auto" ? "light" : themeMode === "light" ? "dark" : "auto";
  try { localStorage.setItem("kuechenplan-theme", themeMode); } catch (err) {}
  applyTheme(); render(); toast("Darstellung: " + THEMES[themeMode]);
});

/* ---------- Ansichten ---------- */
function render() {
  renderTabs();
  const app = $("#app");
  const banner = budgetBar() + (S.storeNote ? `<div class="banner">${esc(S.storeNote)}</div>` : "");
  if (S.settingsOpen) { app.innerHTML = banner + viewSettings(); mountSettings(); return; }
  if (S.openRecipe && getR(S.openRecipe)) { app.innerHTML = banner + viewRecipe(); mountRecipe(); return; }
  if (S.tab === "plan") { app.innerHTML = banner + viewPlan(); mountPlan(); }
  else if (S.tab === "heute") { app.innerHTML = banner + viewToday(); mountToday(); }
  else if (S.tab === "vorrat") { app.innerHTML = banner + viewPantry(); mountPantry(); }
  else if (S.tab === "rezepte") { app.innerHTML = banner + viewRecipes(); mountRecipes(); }
  else { app.innerHTML = banner + viewShopping(); mountShopping(); }
}
function renderTabs() {
  const open = S.shopping.filter(s => !s.checked).length;
  const todayMissing = planDue(todayKey()).filter(n => !n.asked).length + (Store.shareMode() ? (S.requests || []).filter(q => q.to === S.me && q.status === "offen").length : 0);
  const t = [["plan", "Plan", ICON.cal, todayMissing], ["heute", "Ideen", ICON.spark, 0], ["rezepte", "Rezepte", ICON.book, 0], ["vorrat", "Vorrat", ICON.fridge, 0], ["einkauf", "Einkauf", ICON.cart, open]];
  $("#tabs").innerHTML = t.map(([k, l, ic, n]) => `<button data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ""}>${ic}<span>${l}</span>${n ? `<span class="badge num"${k === "plan" ? ' style="background:var(--warm)"' : ""}>${n}</span>` : ""}</button>`).join("");
  $("#tabs").querySelectorAll("button").forEach(b => b.onclick = () => { S.tab = b.dataset.tab; S.openRecipe = null; S.settingsOpen = false; render(); window.scrollTo(0, 0); });
}

/* Vorrat */
function viewPantry() {
  const sh = Store.shareMode();
  const f = S.pantryFilter || "alle";
  const vis = S.pantry.filter(p => !sh || f === "alle" || (f === "mein" && p.owner === S.me) || (f === "gemeinsam" && !p.owner) || (f === "andere" && p.owner && p.owner !== S.me));
  if (sh) ensureNames(S.pantry.map(p => p.owner));
  const groups = PLACES.map(pl => ({ pl, items: vis.filter(p => (p.place || "Vorrat") === pl).sort((a, b) => a.name.localeCompare(b.name, "de")) }));
  return `
  <header class="top"><h1>Vorrat</h1><div class="hdr-r"><button class="btn" id="p-photo">${ICON.camera} Einkauf-Foto</button>${themeBtn()}</div></header>
  <div class="search">${ICON.search}<input id="p-search" placeholder="Was hast du da? z. B. „Ap“ für Apfel" autocomplete="off" aria-label="Zutat suchen und eintragen"><div class="suggest" id="p-sug" hidden></div></div>
  ${sh ? `<div class="chips" style="margin-top:10px">${[["alle","Alles"],["mein","Mein Fach"],["gemeinsam","Gemeinsam"],["andere","Die anderen"]].map(([k, l]) => `<button class="chip" data-pf="${k}" aria-pressed="${f === k}">${l}</button>`).join("")}</div>` : ""}
  ${vis.length ? groups.filter(g => g.items.length).map(g => `
    <div class="section-h"><h2>${g.pl}</h2><span class="muted small num">${g.items.length}</span></div>
    <div class="list">${g.items.map(p => `
      <div class="item" data-id="${p.id}">
        <span class="name">${esc(p.name)}${sh ? `<br><span class="muted tiny">${p.owner === S.me ? "mein Fach" : p.owner ? "Fach von " + esc(who(p.owner)) : "gemeinsam"}</span>` : ""}</span>
        <button class="qtybtn" data-act="minus" aria-label="${esc(p.name)} weniger">−</button>
        <button class="qty" data-act="edit" aria-label="${esc(p.name)} bearbeiten">${esc(fmtQty(p.qty, p.unit))}</button>
        <button class="qtybtn" data-act="plus" aria-label="${esc(p.name)} mehr">+</button>
      </div>`).join("")}</div>`).join("")
  : `<div class="empty" style="margin-top:16px">${S.pantry.length ? "Hier ist gerade nichts." : "Noch nichts eingetragen.<br>Tipp oben ein paar Buchstaben ein und wähl die Zutat aus."}</div>`}`;
}
function removeFromPantry(name, qty, unit) {
  let rest = base(qty, unit);
  S.pantry.filter(p => usable(p) && (fold(p.name) === fold(name) || matchesName(p.name, name))).forEach(p => {
    const pb = base(p.qty, p.unit); if (!pb || !rest || pb.d !== rest.d || rest.v <= 0) return;
    const take = Math.min(pb.v, rest.v); rest.v -= take; p.qty = pb.v - take <= 1e-6 ? 0 : roundQty(fromBase(pb.v - take, p.unit), p.unit);
  });
  S.pantry = S.pantry.filter(p => p.qty > 0);
}
/* Einkauf fotografieren: Claude erkennt Sachen und Mengen, du prüfst, dann ab in den Vorrat */
async function groceryPhotoFlow() {
  if (S.sampleReady && !S.sample) { toast(sampleErrorText({ code: "not_granted" })); return; }
  const files = await pickPhotos(true); if (!files.length) return;
  openSheet(`<h3>Einkauf erkennen</h3><div class="empty row" style="justify-content:center"><span class="spinner"></span> Die KI schaut sich deinen Einkauf an …</div>`);
  let found = [];
  try {
    const imgs = [];
    for (const f of files.slice(0, 4)) imgs.push((await prepPhoto(f)).big);
    const raw = await askClaudeJSON(`Auf den Fotos liegt ein Lebensmittel-Einkauf (oder ein Kassenbon). Liste jedes erkennbare Lebensmittel mit Menge auf. Nutze Packungsangaben (z. B. 500 g Nudeln, 1 l Milch); zähle Stückware. Namen in Grundform wie im Supermarkt (z. B. Spaghetti, Zwiebel, Milch, Mozzarella), keine Markennamen.
Antworte NUR mit JSON: {"items":[{"name":"Spaghetti","qty":500,"unit":"eine aus: ${UNITS.join(", ")}","place":"Kühlschrank | Vorrat | Tiefkühler"}]}`, imgs);
    found = (raw && Array.isArray(raw.items) ? raw.items : []).filter(i => i && i.name).map(i => ({
      name: String(i.name).slice(0, 60), qty: typeof i.qty === "number" ? i.qty : parseFloat(i.qty) || 1,
      unit: UNITS.includes(i.unit) ? i.unit : "Stk", place: PLACES.includes(i.place) ? i.place : defaultPlace(i.name), on: true }));
    if (!S.sample || !found.length) throw new Error("leer");
  } catch (e) {
    openSheet(`<h3>Nichts erkannt</h3><p class="muted" style="margin:0">${esc(e && e.code ? sampleErrorText(e) : "Auf dem Foto war nichts Eindeutiges zu sehen. Leg die Sachen nebeneinander, Etiketten nach oben, und versuch es nochmal.")}</p><button class="btn primary" id="g-ok">Okay</button>`, sh => sh.querySelector("#g-ok").onclick = closeSheet);
    return;
  }
  const draw = sh => {
    sh.innerHTML = `<h3>${found.length} Sachen erkannt</h3><p class="muted small" style="margin:0">Haken raus bei allem, was nicht stimmt. Tipp auf die Menge zum Ändern.</p>
      <div class="list">${found.map((f, i) => `<div class="item"><button class="check" data-t="${i}" role="checkbox" aria-checked="${f.on}" aria-label="${esc(f.name)}" style="${f.on ? "background:var(--accent2);border-color:var(--accent2);color:var(--accent2-ink)" : ""}">${f.on ? ICON.check : ""}</button>
        <span class="name">${esc(f.name)}<br><span class="muted tiny">${esc(f.place)}</span></span><button class="qty" data-e="${i}">${esc(fmtQty(f.qty, f.unit))}</button></div>`).join("")}</div>
      <div class="row"><button class="btn grow" id="g-cancel">Abbrechen</button><button class="btn primary grow" id="g-ok">${found.filter(f => f.on).length} in den Vorrat</button></div>`;
    sh.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { const f = found[+b.dataset.t]; f.on = !f.on; draw(sh); });
    sh.querySelectorAll("[data-e]").forEach(b => b.onclick = () => { const f = found[+b.dataset.e];
      qtySheet({ title: f.name, name: f.name, qty: f.qty, unit: f.unit, place: f.place, showPlace: true, okLabel: "Übernehmen",
        onOk: v => { Object.assign(f, v); openSheet("", draw); } }); });
    sh.querySelector("#g-cancel").onclick = closeSheet;
    sh.querySelector("#g-ok").onclick = () => {
      const on = found.filter(f => f.on);
      on.forEach(f => {
        addToPantry(f.name, f.qty, f.unit, f.place);
        const s = S.shopping.find(x => !x.checked && matchesName(x.name, f.name)); if (s) { s.checked = true; s.inPantry = true; }
      });
      Store.save("pantry"); Store.save("shopping"); closeSheet(); render(); toast(`${on.length} Sachen im Vorrat`);
    };
  };
  openSheet("", draw);
}
function mountPantry() {
  $("#p-photo").onclick = () => groceryPhotoFlow();
  document.querySelectorAll("[data-pf]").forEach(b => b.onclick = () => { S.pantryFilter = b.dataset.pf; render(); });
  attachAutocomplete($("#p-search"), $("#p-sug"), c => {
    const ex = S.pantry.find(p => usable(p) && fold(p.name) === fold(c.name));
    qtySheet({ title: ex ? `${c.name} nachfüllen` : `${c.name} eintragen`, name: c.name, qty: ex ? stepFor(ex.unit, ex.qty) : (c.unit === "g" || c.unit === "ml" ? 500 : 1), unit: ex ? ex.unit : c.unit, place: ex ? ex.place : defaultPlace(c.name), showPlace: true, showOwner: true, okLabel: "Eintragen",
      onOk: v => { if (v.qty <= 0) return; addToPantry(v.name, v.qty, v.unit, v.place, v.owner); Store.save("pantry"); render(); toast(`${v.name} eingetragen`); setTimeout(() => $("#p-search")?.focus(), 50); } });
  });
  document.querySelectorAll(".item[data-id]").forEach(row => {
    const p = S.pantry.find(x => x.id === row.dataset.id); if (!p) return;
    row.querySelectorAll("button").forEach(b => b.onclick = () => {
      const act = b.dataset.act;
      if (act === "edit") return qtySheet({ title: p.name, name: p.name, qty: p.qty, unit: p.unit, place: p.place, showPlace: true, owner: p.owner || null, showOwner: true, okLabel: "Speichern",
        onOk: v => { Object.assign(p, { name: v.name, qty: v.qty, unit: v.unit, place: v.place, owner: v.owner || null }); if (p.qty <= 0) S.pantry = S.pantry.filter(x => x !== p); Store.save("pantry"); render(); },
        onDelete: () => { S.pantry = S.pantry.filter(x => x !== p); Store.save("pantry"); render(); } });
      const st = stepFor(p.unit, p.qty);
      p.qty = Math.round(((p.qty || 0) + (act === "plus" ? st : -st)) * 100) / 100;
      if (p.qty <= 0) { S.pantry = S.pantry.filter(x => x !== p); toast(`${p.name} ist aufgebraucht`); }
      Store.save("pantry"); render();
    });
  });
}

/* Rezepte */
function timeLabel(r) { return r.time?.total ? `≈ ${Math.round(r.time.total)} Min` : "Zeit offen"; }
function viewRecipes() {
  const all = Object.values(S.recipes);
  const cats = CATEGORIES.filter(c => all.some(r => r.category === c));
  const list = filteredRecipes();
  return `
  <header class="top"><h1>Rezepte</h1><div class="hdr-r"><button class="btn primary" id="r-import">+ Neues Rezept</button>${themeBtn()}</div></header>
  ${queueCardHtml()}
  ${all.length ? `
  <div class="stack">
    <div class="search">${ICON.search}<input id="r-search" placeholder="z. B. Sommerpasta, Winteressen, schnell vegetarisch" value="${esc(S.recipeQuery)}" autocomplete="off" aria-label="Rezepte durchsuchen"></div>
    <div class="chips" role="group" aria-label="Jahreszeit">${SEASONS.map(s => `<button class="chip" data-season="${s}" aria-pressed="${S.seasonFilter === s}">${s}</button>`).join("")}</div>
    ${cats.length > 1 ? `<div class="chips" role="group" aria-label="Kategorie">${cats.map(c => `<button class="chip" data-cat="${esc(c)}" aria-pressed="${S.catFilter === c}">${esc(c)} <span class="num">${all.filter(r => r.category === c).length}</span></button>`).join("")}</div>` : ""}
    <div class="row small"><span class="muted grow num">${list.length} ${list.length === 1 ? "Rezept" : "Rezepte"}</span>
      <label class="muted" for="r-sort">Sortieren</label><select id="r-sort" class="chip">${[["da","Am meisten da"],["zeit","Am schnellsten"],["neu","Neueste"]].map(([k,l]) => `<option value="${k}" ${S.sort === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <div class="cards">${list.map(({ id, r, av }) => `
      <button class="card has-thumb" data-open="${id}">
        ${photoTag(r, "thumb")}
        <div class="body"><h3>${esc(r.title)}</h3>
        <div class="meta">${dietPill(dietOf(r))}<span class="pill neutral">${esc(r.category)}</span><span class="pill neutral num">${esc(timeLabel(r))}</span>
          <span class="pill ${av.ok === av.total ? "good" : av.frac >= 0.5 ? "warn" : "bad"} num">${av.ok}/${av.total} da</span></div>
        <div class="bar" aria-hidden="true"><i style="width:${Math.round(av.frac * 100)}%"></i></div></div>
      </button>`).join("") || `<div class="empty">Nichts gefunden. Probier ein anderes Wort oder nimm einen Filter raus.</div>`}</div>
  </div>` : `<div class="empty">Noch keine Rezepte.<br>Tippe auf <b>+ Neues Rezept</b>: Link einfügen oder erzählen, was du gekocht hast.</div>`}`;
}
function mountRecipes() {
  $("#r-import").onclick = importSheet;
  const s = $("#r-search");
  if (s) {
    s.oninput = () => { S.recipeQuery = s.value; const pos = s.selectionStart; render(); const n = $("#r-search"); n.focus(); n.setSelectionRange(pos, pos); };
    document.querySelectorAll("[data-season]").forEach(b => b.onclick = () => { S.seasonFilter = S.seasonFilter === b.dataset.season ? null : b.dataset.season; render(); });
    document.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { S.catFilter = S.catFilter === b.dataset.cat ? null : b.dataset.cat; render(); });
    $("#r-sort").onchange = e => { S.sort = e.target.value; render(); };
  }
  document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { S.openRecipe = b.dataset.open; render(); window.scrollTo(0, 0); });
}
function importSheet() {
  const unavailable = S.sampleReady && !S.sample;
  const photos = []; let mode = "link";
  openSheet(`
    <h3>Neues Rezept</h3>
    ${unavailable ? `<div class="banner bad">Verbinde zuerst eine KI: Zahnrad oben rechts → KI-Anbieter und Schlüssel.</div>` : ""}
    <div class="seg" id="i-mode" style="grid-template-columns:1fr 1fr"><button type="button" data-m="link" aria-pressed="true">Aus Link</button><button type="button" data-m="self" aria-pressed="false">Selbst gekocht</button></div>
    <div class="stack" id="i-link">
      <div class="field"><label for="i-url">Link – oder gleich mehrere</label><textarea id="i-url" inputmode="url" rows="1" placeholder="https://…" autocomplete="off" style="min-height:48px;resize:none"></textarea>
        <span class="muted tiny" id="i-urlhint">YouTube, Instagram, Chefkoch, Blogs … Mehrere Links einfach untereinander einfügen.</span></div>
      <div class="field"><label for="i-note">Anmerkung (optional)</label><input id="i-note" autocomplete="off" placeholder="z. B. Gnocchi mit Feta · 100 g mehr Nudeln · noch Spinat dazu">
        <span class="muted tiny">Bei Videos hilft der Name des Gerichts. Änderungswünsche werden direkt ins Rezept eingearbeitet.</span></div>
    </div>
    <div class="stack" id="i-self" hidden>
      <button type="button" class="btn primary block" id="i-mic" style="padding:16px">${ICON.mic} <span id="i-miclabel">Tippen und erzählen</span></button>
      <div class="field"><label for="i-text">Was hast du gekocht?</label><textarea id="i-text" placeholder="z. B. „Heute Kürbissuppe gemacht, ein halber Hokkaido, zwei Kartoffeln, eine Zwiebel, Ingwer, eine Dose Kokosmilch, alles angebraten, 20 Minuten gekocht, püriert, reicht für 3 Portionen.“"></textarea>
        <span class="muted tiny" id="i-michint">Erzähl einfach drauflos: Zutaten, ungefähre Mengen, was du gemacht hast, wie viele Portionen rauskommen.</span></div>
    </div>
    <div class="field"><label id="i-plabel">Bild vom Gericht (optional)</label><div class="photos" id="i-photos"></div>
      <span class="muted tiny" id="i-phint"></span></div>
    <div class="row"><button class="btn grow" id="i-cancel">Abbrechen</button><button class="btn primary grow" id="i-go" ${unavailable ? "disabled" : ""}>Rezept erstellen</button></div>
    <div id="i-status" class="small muted" role="status"></div>`, sh => {
    const drawPhotos = () => {
      const box = sh.querySelector("#i-photos");
      box.innerHTML = photos.map((p, i) => `<div class="p"><img src="${p.small}" alt="Foto ${i + 1}"><button class="x" data-x="${i}" aria-label="Foto entfernen">×</button></div>`).join("")
        + (photos.length < 4 ? `<button type="button" class="addphoto" id="i-add">+ Foto</button>` : "");
      box.querySelectorAll("[data-x]").forEach(b => b.onclick = () => { photos.splice(+b.dataset.x, 1); drawPhotos(); });
      const add = box.querySelector("#i-add");
      if (add) add.onclick = async () => {
        const files = await pickPhotos(true);
        for (const f of files.slice(0, 4 - photos.length)) { try { photos.push(await prepPhoto(f)); } catch (e) { toast("Ein Foto konnte nicht gelesen werden."); } }
        drawPhotos();
      };
    };
    const updHint = () => {
      const h = sh.querySelector("#i-phint"); if (!h) return;
      if (mode !== "link") { h.textContent = ""; return; }
      const yt = ytThumb(sh.querySelector("#i-url").value.trim());
      const url0 = sh.querySelector("#i-url").value.trim();
      if (isVideoUrl(url0) && !AI.canWatch(extractUrls(url0)[0] || url0)) { h.innerHTML = `Videos kann nur Gemini selbst ansehen. Mit ${esc(PROVIDERS[AI.provider()].name)} bitte einen Screenshot vom Video oder die Videobeschreibung dazugeben.`; return; }
      if (yt) { h.innerHTML = "Bild optional: Das Titelbild holt die App selbst."; return; }
      h.innerHTML = yt
        ? `Screenshot vom Video oder das Titelbild: <a href="${esc(yt)}" target="_blank" rel="noopener">Titelbild öffnen</a>, gedrückt halten, „Bild sichern“ und hier hinzufügen. Oder ein kopiertes Bild einfügen.`
        : "Screenshot von der Rezeptseite oder dem Video. Am Computer kannst du ein kopiertes Bild auch einfach einfügen (Strg+V).";
    };
    sh.querySelector("#i-url").addEventListener("input", updHint);
    const urlBox = sh.querySelector("#i-url");
    const updMany = () => {
      urlBox.style.height = "auto"; urlBox.style.height = Math.min(220, urlBox.scrollHeight + 2) + "px";
      const n = extractUrls(urlBox.value).length;
      const go = sh.querySelector("#i-go"); if (!go.disabled && mode === "link") go.textContent = n > 1 ? `${n} Rezepte importieren` : "Rezept erstellen";
      sh.querySelector("#i-urlhint").textContent = n > 1 ? `${n} Links erkannt. Sie werden nacheinander abgearbeitet; den Fortschritt siehst du unter Rezepte.` : "YouTube, Instagram, Chefkoch, Blogs … Mehrere Links einfach untereinander einfügen.";
    };
    urlBox.addEventListener("input", updMany);
    const onPaste = async e => {
      const files = [...(e.clipboardData?.files || [])].filter(f => f.type.startsWith("image/"));
      if (!files.length) return;
      e.preventDefault();
      for (const f of files.slice(0, 4 - photos.length)) { try { photos.push(await prepPhoto(f)); } catch (err) {} }
      drawPhotos(); toast("Bild eingefügt");
    };
    sh.addEventListener("paste", onPaste);
    const ta = sh.querySelector("#i-text");
    const mic = setupDictation(ta, sh.querySelector("#i-mic"), sh.querySelector("#i-miclabel"), sh.querySelector("#i-michint"));
    const setMode = m => {
      mode = m; mic.stop();
      sh.querySelectorAll("#i-mode button").forEach(b => b.setAttribute("aria-pressed", b.dataset.m === m));
      sh.querySelector("#i-link").hidden = m !== "link";
      sh.querySelector("#i-self").hidden = m !== "self";
      sh.querySelector("#i-plabel").textContent = m === "link" ? "Bild vom Gericht (optional)" : "Foto vom Gericht (optional)";
      updHint();
    };
    sh.querySelectorAll("#i-mode button").forEach(b => b.onclick = () => setMode(b.dataset.m));
    setMode("link"); drawPhotos();
    sh.querySelector("#i-cancel").onclick = () => { mic.stop(); closeSheet(); };
    sh.querySelector("#i-go").onclick = async () => {
      mic.stop();
      const urls = mode === "link" ? extractUrls(sh.querySelector("#i-url").value) : [];
      if (urls.length > 1) {
        const note = sh.querySelector("#i-note").value.trim();
        queueAdd(urls, note); closeSheet(); S.tab = "rezepte"; S.openRecipe = null; render(); window.scrollTo(0, 0);
        toast(`${urls.length} Links in der Warteschlange`); return;
      }
      const url = mode === "link" ? (urls[0] || sh.querySelector("#i-url").value.trim()) : "";
      const note = mode === "link" ? sh.querySelector("#i-note").value.trim() : "";
      const text = mode === "self" ? ta.value.trim() : "";
      const imgs = photos;
      const status = sh.querySelector("#i-status");
      if (mode === "link" && !url) { status.textContent = "Füge einen Link ein."; return; }
      if (mode === "link" && isVideoUrl(url) && !AI.canWatch(url) && !note && !imgs.length) { status.textContent = "Die App kann Videos nicht ansehen. Füge einen Screenshot vom Video (oder das Titelbild) hinzu oder schreib in die Anmerkung, was gekocht wird, z. B. „Gnocchi mit Tomaten und Feta“."; return; }
      if (mode === "self" && !text && !imgs.length) { status.textContent = "Erzähl kurz, was du gekocht hast, oder füge ein Foto hinzu."; return; }
      const go = sh.querySelector("#i-go"); go.disabled = true; go.innerHTML = `<span class="spinner"></span> Die KI schreibt das Rezept …`;
      status.textContent = "";
      try {
        const input = mode === "self" ? "[Der Nutzer beschreibt ein Gericht, das er selbst gekocht hat, oft diktiert.]\n" + text : "";
        const raw = await askClaudeJSON(importPrompt(url, input, note, AI.canWatch(url) || AI.canRead(url)), imgs.map(p => p.big), { link: url });
        const photos = imgs;
        const r = cleanRecipe(raw, url);
        if (!r.ingredients.length) throw new Error("keine Zutaten");
        r.createdAt = Date.now();
        if (photos[0]) r.photo = photos[0].small;
        else if (ytThumb(url)) r.photoUrl = ytThumb(url);
        else if (raw && /^https:\/\//.test(raw.imageUrl || "")) r.photoUrl = raw.imageUrl;
        const id = "r_" + uid();
        S.recipes[id] = r; Store.save(id);
        closeSheet(); S.tab = "rezepte"; S.openRecipe = id; render(); window.scrollTo(0, 0);
      } catch (e) {
        go.disabled = false; go.textContent = "Nochmal versuchen";
        status.textContent = sampleErrorText(e);
      }
    };
    sh.querySelector("#i-url").focus();
  });
}

function viewRecipe() {
  const r = getR(S.openRecipe);
  const sv = S.servings[S.openRecipe] || r.servings;
  const f = sv / r.servings;
  const rows = ings(r).map((i, idx) => ({ i, idx, s: ingStatus(i, f) }));
  const missing = rows.filter(x => ingRole(x.i) === "haupt" && (x.s.st === "missing" || x.s.st === "partial"));
  const t = r.time || {};
  const pillFor = s => s.st === "have" ? `<span class="pill good">da</span>` : s.st === "check" ? `<span class="pill good">da · Menge prüfen</span>` : s.st === "partial" ? `<span class="pill warn">fehlt ${esc(fmtQty(s.buy, null))}</span>` : s.st === "staple" ? `<span class="pill neutral">Grundzutat</span>` : `<span class="pill bad">fehlt</span>`;
  return `
  <div class="detail stack" style="padding-top:12px">
    <div><button class="linkbtn row" id="d-back">${ICON.back} Zurück</button></div>
    ${S.drafts[S.openRecipe] ? `<div class="banner row" style="justify-content:space-between;flex-wrap:wrap"><span>Vorschau, noch nicht gespeichert.</span><button class="btn primary" id="d-keep">In meine Rezepte</button></div>` : ""}
    ${r.url && ytId(r.url) && (r.photo || r.photoUrl) ? `<a class="herolink" href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="Video auf YouTube ansehen">${photoTag(r, "hero")}<span class="playbadge">${ICON.play}</span></a>` : photoTag(r, "hero")}
    <div class="row" style="flex-wrap:wrap"><button class="linkbtn" id="d-photo">${r.photo || r.photoUrl ? "Foto ändern" : "+ Foto hinzufügen"}</button>${r.photo || r.photoUrl ? `<button class="linkbtn" id="d-photo-del" style="color:var(--muted)">Foto entfernen</button>` : ""}${!r.photo && !r.photoUrl && ytThumb(r.url) ? `<a class="small" href="${esc(ytThumb(r.url))}" target="_blank" rel="noopener">YouTube-Titelbild öffnen</a>` : ""}</div>
    ${!r.photo && !r.photoUrl && ytThumb(r.url) ? `<p class="muted tiny" style="margin:0">Titelbild öffnen, gedrückt halten, „Bild sichern“, dann über „+ Foto hinzufügen“ einsetzen.</p>` : ""}
    <h2>${esc(r.title)}</h2>
    <div class="row small" style="flex-wrap:wrap;gap:6px">${dietPill(dietOf(r))}<span class="pill neutral">${esc(r.category)}</span></div>
    ${r.url ? `<a class="btn srcbtn" href="${esc(r.url)}" target="_blank" rel="noopener">${ytId(r.url) || /youtu|instagram|tiktok/i.test(r.url) ? ICON.play + " Video ansehen" : ICON.link + " Original-Rezept öffnen"}<span class="muted tiny" style="font-weight:500;margin-left:auto">${esc(srcHost(r.url))}</span></a>` : ""}
    ${r.confidence === "niedrig" ? `<div class="banner">${esc(r.sourceNote || "Aus dem Link geschätzt.")} Füge über „Mit KI anpassen“ den Originaltext ein, dann wird es genau.</div>` : ""}
    <div class="times">
      <div class="time"><span class="muted tiny">Vorbereitung</span><b>${t.prep != null ? Math.round(t.prep) : "–"}</b><span class="muted tiny">Min</span></div>
      <div class="time"><span class="muted tiny">Kochen</span><b>${t.cook != null ? Math.round(t.cook) : "–"}</b><span class="muted tiny">Min</span></div>
      <div class="time total"><span class="muted tiny">Realistisch gesamt</span><b>${t.total != null ? Math.round(t.total) : "–"}</b><span class="muted tiny">Min${t.stated ? ` · Quelle sagt ${Math.round(t.stated)}` : ""}</span></div>
    </div>
    ${t.why ? `<p class="muted small" style="margin:0">${esc(t.why)}</p>` : ""}
    <div class="servings"><span class="grow"><b>Portionen</b></span>
      <button class="qtybtn" id="sv-minus" aria-label="weniger Portionen">−</button><span class="num" style="min-width:28px;text-align:center;font-weight:700;font-size:18px">${sv}</span><button class="qtybtn" id="sv-plus" aria-label="mehr Portionen">+</button></div>
    <div class="section-h" style="margin:4px 0 0"><h2>Zutaten</h2><span class="small ${missing.length ? "muted" : ""}">${missing.length ? `${missing.length} fehlen` : `<span class="pill good">alles da</span>`}</span></div>
    <div class="list">${rows.filter(x => ingRole(x.i) === "haupt").map(({ i, s }) => `
      <div class="ing"><span class="amt">${esc(fmtQty(i.qty != null ? i.qty * f : null, i.unit))}</span>
        <span>${esc(i.name)}${i.origName ? ` <span class="pill good" style="font-size:11px">statt ${esc(i.origName)}</span>` : ""}${i.note ? `<br><span class="note">${esc(i.note)}</span>` : ""}${s.have && s.st !== "staple" ? `<br><span class="note">im Vorrat: ${s.have.map(p => esc(fmtQty(p.qty, p.unit))).join(" + ")}</span>` : ""}</span>
        ${pillFor(s)}${s.others && s.others.length ? `<span class="note" style="grid-column:2/4">Hat noch: ${s.others.map(o => esc(who(o.owner)) + " (" + esc(fmtQty(o.qty, o.unit)) + ")").join(", ")}</span>` : ""}</div>`).join("")}</div>
    ${rows.some(x => ingRole(x.i) === "neben") ? `<div class="section-h" style="margin:6px 0 0"><h2 style="font-size:16px">Gewürze &amp; Basics</h2></div>
    <div class="list">${rows.filter(x => ingRole(x.i) === "neben").map(({ i, s }) => { const q = qtyOf(i); return `
      <div class="ing" style="padding:7px 12px"><span class="amt muted small">${q != null ? esc(fmtQty(q * f, i.unit)) : ""}</span>
        <span class="small">${esc(i.name)}${i.note && !isFryFat(i) ? ` <span class="note">· ${esc(i.note)}</span>` : isFryFat(i) ? ` <span class="note">· zum Anbraten</span>` : ""}</span>
        ${s.st === "missing" ? `<span class="pill neutral">nicht im Vorrat</span>` : ""}</div>`; }).join("")}</div>
    <p class="muted tiny" style="margin:0">Gewürze und Basics kommen nicht automatisch auf die Einkaufsliste. Fehlt etwas, schreib es dort kurz dazu.</p>` : ""}
    ${swapsHtml(r)}
    ${r.steps.length ? `<div class="section-h" style="margin:8px 0 0"><h2>Zubereitung</h2></div><ol class="steps">${r.steps.map(s => `<li><span>${esc(s)}</span></li>`).join("")}</ol>` : ""}
    <div class="row" style="flex-wrap:wrap">
      <button class="btn grow" id="d-plan">${ICON.cal} In den Plan</button>
      <button class="btn grow" id="d-cooked">Gekocht: vom Vorrat abziehen</button>
      <button class="btn grow" id="d-adjust">Mit KI anpassen</button>
      <button class="btn danger" id="d-del">Löschen</button>
    </div>
    <div class="cta"><button class="btn primary block" id="d-cook">${missing.length ? `Das koche ich: ${missing.length} ${missing.length === 1 ? "Zutat" : "Zutaten"} auf die Einkaufsliste` : "Alles da, los geht's"}</button></div>
  </div>`;
}
function swapsHtml(r) {
  const d = baseDiet(r);
  if (d === "vegan") return "";
  const head = d === "vegetarisch" ? "Vegan machen" : "Vegetarisch machen";
  const sel = r.swapSel || {}, any = Object.keys(sel).length > 0;
  if (r.swaps && r.swaps.length) return `<div class="section-h" style="margin:8px 0 0"><h2>${head}</h2>${any ? `<button class="linkbtn" id="sw-reset">Original</button>` : ""}</div>
    ${!r.swaps.every(x => sel[x.original]) ? `<button class="btn block" id="sw-all">${d === "vegetarisch" ? "Komplett vegan machen" : "Komplett vegetarisch machen"}</button>` : ""}
    <div class="list">${r.swaps.map((x, xi) => `<div class="item" style="flex-direction:column;align-items:stretch;gap:6px"><span><b>${esc(x.original)}</b> <span class="muted">ersetzen durch</span></span>
      <div class="row" style="flex-wrap:wrap;gap:6px">${x.alternatives.map((a, ai) => `<button class="chip" data-swap="${xi}|${ai}" aria-pressed="${sel[x.original] === a}">${esc(a)}</button>`).join("")}</div>
      ${x.tip ? `<span class="muted small">${esc(x.tip)}</span>` : ""}</div>`).join("")}</div>`;
  if (r.swaps && !r.swaps.length && r.diet) return "";
  return `<div class="section-h" style="margin:8px 0 0"><h2>${head}</h2></div><button class="btn block" id="d-swaps">Alternativen vorschlagen lassen</button>`;
}
function mountRecipe() {
  const id = S.openRecipe, r = getR(id);
  const sv = S.servings[id] || r.servings, f = sv / r.servings;
  $("#d-back").onclick = () => { S.openRecipe = null; render(); };
  const kp = $("#d-keep"); if (kp) kp.onclick = () => { S.recipes[id] = r; delete S.drafts[id]; Store.save(id); render(); toast("In deinen Rezepten gespeichert"); };
  $("#d-plan").onclick = () => { if (S.drafts[id]) { S.recipes[id] = r; delete S.drafts[id]; Store.save(id); } planPickDaySheet(id); };
  document.querySelectorAll("[data-swap]").forEach(b => b.onclick = () => {
    const [xi, ai] = b.dataset.swap.split("|").map(Number); const x = r.swaps[xi]; const a = x.alternatives[ai];
    r.swapSel = { ...(r.swapSel || {}) };
    if (r.swapSel[x.original] === a) delete r.swapSel[x.original]; else r.swapSel[x.original] = a;
    Store.save(id); render(); toast(r.swapSel[x.original] ? `${a} statt ${x.original}` : `Wieder ${x.original}`);
  });
  const swAll = $("#sw-all"); if (swAll) swAll.onclick = () => { r.swapSel = {}; r.swaps.forEach(x => { if (x.alternatives[0]) r.swapSel[x.original] = x.alternatives[0]; }); Store.save(id); render(); toast("Zutaten getauscht"); };
  const swRes = $("#sw-reset"); if (swRes) swRes.onclick = () => { r.swapSel = {}; Store.save(id); render(); toast("Wieder das Original"); };
  const sw = $("#d-swaps");
  if (sw) sw.onclick = async () => {
    sw.disabled = true; sw.innerHTML = `<span class="spinner"></span> Die KI sucht Alternativen …`;
    try {
      const raw = await askClaudeJSON(`Zutaten eines Rezepts ("${r.title}"): ${r.ingredients.map(i => i.name).join(", ")}.
Bestimme die Ernährungsform und gib Ersatz-Vorschläge. Für jede Fleisch- oder Fisch-Zutat 2-3 konkrete vegetarische/vegane Alternativen (z. B. Speck → vegetarische Speckwürfel, vegane Speckwürfel, Halloumi-Würfel). Ist das Gericht schon vegetarisch, gib vegane Alternativen für Käse, Sahne, Ei usw. Antworte NUR mit JSON:
{"diet": "vegan | vegetarisch | pescetarisch | mit Fleisch", "swaps": [{"original": "Speck", "alternatives": ["…"], "tip": "kurzer Tipp"}]}`);
      const c = cleanRecipe({ ...r, ...raw, time: r.time }, r.url);
      r.diet = c.diet; r.swaps = c.swaps; Store.save(id); render();
    } catch (e) { sw.disabled = false; sw.textContent = "Nochmal versuchen"; toast(sampleErrorText(e)); }
  };
  $("#d-photo").onclick = async () => {
    const [f] = await pickPhotos(false); if (!f) return;
    try { r.photo = (await prepPhoto(f)).small; Store.save(id); render(); } catch (e) { toast("Das Foto konnte nicht gelesen werden."); }
  };
  const pd = $("#d-photo-del"); if (pd) pd.onclick = () => { delete r.photo; delete r.photoUrl; Store.save(id); render(); };
  $("#sv-minus").onclick = () => { S.servings[id] = Math.max(1, sv - 1); render(); };
  $("#sv-plus").onclick = () => { S.servings[id] = Math.min(20, sv + 1); render(); };
  $("#d-cook").onclick = () => {
    let n = 0;
    ings(r).forEach(i => { if (ingRole(i) === "neben") return; const s = ingStatus(i, f); if (s.st === "missing" || s.st === "partial") { addToShopping(i.name, s.buy, i.unit, i.aisle, r.title); n++; } });
    if (!n) { toast("Du hast alles da. Guten Appetit!"); return; }
    Store.save("shopping"); toast(`${n} ${n === 1 ? "Zutat" : "Zutaten"} auf der Einkaufsliste`); renderTabs(); render();
  };
  $("#d-cooked").onclick = () => confirmSheet("Gekocht?", `Die Zutaten für ${sv} ${sv === 1 ? "Portion" : "Portionen"} werden von deinem Vorrat abgezogen.`, "Abziehen", () => {
    ings(r).forEach(i => {
      if (i.staple || i.qty == null) return;
      let rest = base(i.qty * f, i.unit);
      pantryMatches(i.name).forEach(p => {
        const pb = base(p.qty, p.unit); if (!pb || !rest || pb.d !== rest.d || rest.v <= 0) return;
        const take = Math.min(pb.v, rest.v); rest.v -= take;
        p.qty = roundQty(fromBase(pb.v - take, p.unit), p.unit);
        if (pb.v - take <= 1e-6) p.qty = 0;
      });
    });
    S.pantry = S.pantry.filter(p => p.qty > 0);
    Store.save("pantry"); toast("Vorrat aktualisiert"); render();
  });
  $("#d-del").onclick = () => confirmSheet("Rezept löschen?", r.title, "Löschen", () => { delete S.recipes[id]; Store.save(id); S.openRecipe = null; render(); }, true);
  $("#d-adjust").onclick = () => {
    const unavailable = S.sampleReady && !S.sample;
    openSheet(`<h3>Mit KI anpassen</h3>
      ${unavailable ? `<div class="banner bad">Verbinde zuerst eine KI: Zahnrad oben rechts.</div>` : ""}
      <div class="field"><label for="a-text">Was soll sich ändern?</label><textarea id="a-text" placeholder="z. B. „Es sind 500 g Hack statt 400“, „mach es vegetarisch“, „das ist eher ein Herbstessen“ oder den Originaltext des Rezepts einfügen."></textarea></div>
      <div class="row"><button class="btn grow" id="a-cancel">Abbrechen</button><button class="btn primary grow" id="a-go" ${unavailable ? "disabled" : ""}>Anpassen</button></div>
      <div id="a-status" class="small muted" role="status"></div>`, sh => {
      sh.querySelector("#a-cancel").onclick = closeSheet;
      sh.querySelector("#a-go").onclick = async () => {
        const txt = sh.querySelector("#a-text").value.trim(); if (!txt) return;
        const go = sh.querySelector("#a-go"); go.disabled = true; go.innerHTML = `<span class="spinner"></span> Die KI passt an …`;
        try {
          const cur = { ...r }; delete cur.createdAt; delete cur.photo; delete cur.photoUrl;
          const raw = await askClaudeJSON(`Hier ist ein Rezept als JSON aus einer Koch-App:\n${JSON.stringify(cur)}\n\nÄnderungswunsch bzw. Originaltext vom Nutzer:\n${txt.slice(0, 18000)}\n\nGib das vollständige, aktualisierte Rezept zurück. Antworte NUR mit JSON nach diesem Schema:\n${RECIPE_SCHEMA}\nRegeln: Zeiten realistisch für Hobbyköche. Wenn Originaltext eingefügt wurde, übernimm dessen Zutaten und Mengen genau und setze "confidence" auf "hoch". Alles andere unverändert lassen.`);
          const nr = cleanRecipe(raw, r.url); nr.createdAt = r.createdAt || Date.now(); if (r.photo) nr.photo = r.photo; if (r.photoUrl) nr.photoUrl = r.photoUrl; if (r.fromIdea) nr.fromIdea = true;
          if (!nr.ingredients.length) throw new Error("leer");
          S.recipes[id] = nr; Store.save(id); closeSheet(); render(); toast("Rezept angepasst");
        } catch (e) { go.disabled = false; go.textContent = "Nochmal versuchen"; sh.querySelector("#a-status").textContent = sampleErrorText(e); }
      };
      sh.querySelector("#a-text").focus();
    });
  };
}

/* Für dich */
function currentSeason() { const m = new Date().getMonth(); return m >= 2 && m <= 4 ? "Frühling" : m >= 5 && m <= 7 ? "Sommer" : m >= 8 && m <= 10 ? "Herbst" : "Winter"; }
function tasteProfile() {
  const rs = Object.values(S.recipes);
  const count = arr => { const m = {}; arr.forEach(x => { if (x) m[x] = (m[x] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(e => e[0]); };
  return {
    n: rs.length,
    cats: count(rs.map(r => r.category)),
    tags: count(rs.flatMap(r => r.tags || [])),
    ings: count(rs.flatMap(r => r.ingredients.filter(i => !i.staple).map(i => i.name))),
  };
}
function ideaFilters() {
  const p = tasteProfile();
  const f = [{ k: "mix", l: "Alles" }, { k: "s:" + currentSeason(), l: currentSeason() }];
  SEASONS.filter(s => s !== currentSeason()).forEach(s => f.push({ k: "s:" + s, l: s }));
  const cats = [...new Set([...p.cats.slice(0, 4), "Pasta", "Suppe & Eintopf", "Curry & Pfanne", "Salat", "Ofen & Auflauf"])];
  cats.forEach(c => f.push({ k: "c:" + c, l: c }));
  [["t:schnell", "Schnell"], ["t:vegetarisch", "Vegetarisch"], ["t:vorrat", "Mit meinem Vorrat"]].forEach(([k, l]) => f.push({ k, l }));
  return f;
}
function filterLabel(k) { if (k.startsWith("q:")) return k.slice(2); const f = ideaFilters().find(x => x.k === k); return f ? f.l : k; }
function filterQueryText(k) {
  if (k === "mix") return "";
  if (k.startsWith("s:")) return k.slice(2);
  if (k.startsWith("c:")) return k.slice(2);
  if (k === "t:schnell") return "schnell"; if (k === "t:vegetarisch") return "vegetarisch"; if (k === "t:vorrat") return "";
  return k.slice(2);
}
function ownMatches(k) {
  let list = Object.entries(S.recipes);
  if (k.startsWith("s:")) list = list.filter(([, r]) => (r.seasons || []).includes(k.slice(2)));
  else if (k.startsWith("c:")) list = list.filter(([, r]) => r.category === k.slice(2));
  else if (k === "t:vorrat") list = list.filter(([, r]) => availability(r).frac >= 0.6);
  else if (k !== "mix") { const toks = queryTokens(filterQueryText(k)); list = list.filter(([, r]) => { const h = recipeHay(r); return toks.every(a => a.some(t => h.includes(t))); }); }
  return list.sort((a, b) => availability(b[1]).frac - availability(a[1]).frac).slice(0, 12);
}
function ideaHave(idea) { const ks = idea.keyIngredients || []; return { ok: ks.filter(n => pantryMatches(n).length).length, total: ks.length }; }
function ideaPrompt(k) {
  const p = tasteProfile();
  const own = Object.values(S.recipes).slice(-40).map(r => `- ${r.title} (${r.category}; ${(r.tags || []).slice(0, 6).join(", ")})`).join("\n") || "(noch keine)";
  const nope = (S.ideas._nope?.items || []).slice(-30).join(", ") || "(nichts)";
  const want = k === "mix" ? "eine bunte Mischung, die zur aktuellen Jahreszeit (" + currentSeason() + ") passt"
    : k.startsWith("s:") ? "Gerichte, die richtig nach " + k.slice(2) + " schmecken (saisonale Zutaten)"
    : k.startsWith("c:") ? "Gerichte der Kategorie " + k.slice(2)
    : k === "t:schnell" ? "schnelle Gerichte, realistisch unter 30 Minuten"
    : k === "t:vegetarisch" ? "vegetarische Gerichte"
    : k === "t:vorrat" ? "Gerichte, die möglichst viel aus dem aktuellen Vorrat nutzen"
    : "passend zu diesem Wunsch: " + k.slice(2);
  return `Du bist die Empfehlungs-Funktion einer Koch-App. Analysiere die gespeicherten Rezepte des Nutzers und schlag 6 NEUE Gerichte vor, die ihm gefallen könnten: ${want}.
Gespeicherte Rezepte:
${own}
Häufige Kategorien: ${p.cats.slice(0, 5).join(", ") || "-"}; häufige Stichworte: ${p.tags.slice(0, 12).join(", ") || "-"}; häufige Zutaten: ${p.ings.slice(0, 12).join(", ") || "-"}
Aktueller Vorrat: ${S.pantry.map(x => x.name).join(", ") || "(leer)"}
Nicht vorschlagen (abgelehnt): ${nope}

Keine Gerichte, die schon gespeichert sind. Mischung aus Sicherem und etwas Neuem, alltagstauglich. Antworte NUR mit JSON:
{"profile": "1-2 Sätze auf Deutsch, per du, was für ein Esser der Nutzer ist (bei 0 Rezepten: dass die Vorschläge besser werden, je mehr er speichert)",
 "ideas": [{"title": "Name", "category": "eine aus: ${CATEGORIES.join(", ")}", "seasons": ["aus ${SEASONS.join(", ")}"], "tags": ["5-8 stichworte, klein"], "time": 35, "why": "1 Satz per du, warum es passt", "keyIngredients": ["4-6 Hauptzutaten, Grundform"], "diet": "vegan | vegetarisch | pescetarisch | mit Fleisch"}]}
"time" = realistische Gesamtzeit in Minuten für Hobbyköche.`;
}
async function loadIdeas(k) {
  S.ideaLoading = k; S.ideaError = ""; render();
  try {
    const raw = await askClaudeJSON(ideaPrompt(k));
    const items = (raw && Array.isArray(raw.ideas) ? raw.ideas : []).filter(i => i && i.title).slice(0, 8).map(i => ({
      id: uid(), title: String(i.title).slice(0, 100), category: CATEGORIES.includes(i.category) ? i.category : "Sonstiges",
      seasons: (i.seasons || []).filter(s => SEASONS.includes(s)), tags: (i.tags || []).map(t => String(t).toLowerCase()).slice(0, 10),
      time: typeof i.time === "number" ? i.time : null, why: String(i.why || ""), keyIngredients: (i.keyIngredients || []).map(String).slice(0, 8), diet: ["vegan","vegetarisch","pescetarisch","mit Fleisch"].includes(i.diet) ? i.diet : null,
    }));
    if (!items.length) throw new Error("leer");
    S.ideas[k] = { at: Date.now(), profile: String(raw.profile || ""), items };
    const keys = Object.keys(S.ideas).filter(x => x !== "_nope").sort((a, b) => (S.ideas[b].at || 0) - (S.ideas[a].at || 0));
    keys.slice(12).forEach(x => delete S.ideas[x]);
    Store.save("ideas");
  } catch (e) { S.ideaError = e && e.code ? sampleErrorText(e) : "Gerade keine Vorschläge bekommen. Versuch es nochmal."; }
  S.ideaLoading = false; render();
}
function viewForYou(embedded) {
  const k = S.ideaFilter || "s:" + currentSeason();
  const p = tasteProfile();
  const cache = S.ideas[k];
  const prof = cache?.profile || Object.values(S.ideas).find(v => v && v.profile)?.profile || "";
  const own = ownMatches(k);
  const unavailable = S.sampleReady && !S.sample;
  const filters = ideaFilters();
  if (k.startsWith("q:")) filters.splice(1, 0, { k, l: k.slice(2) });
  return `
  ${embedded ? "" : `<header class="top"><h1>Für dich</h1><div class="hdr-r">${themeBtn()}</div></header>`}
  <div class="stack">
    <form class="search" id="f-form">${ICON.search}<input id="f-search" placeholder="Worauf hast du Lust? z. B. cremige Herbstpasta" value="${esc(S.ideaQuery)}" autocomplete="off" aria-label="Vorschläge suchen"></form>
    <div class="chips" role="group" aria-label="Themen">${filters.map(f => `<button class="chip" data-f="${esc(f.k)}" aria-pressed="${f.k === k}">${esc(f.l)}</button>`).join("")}</div>
    ${p.n || prof ? `<div class="profile"><span class="muted tiny" style="font-weight:600">DEIN GESCHMACK</span>
      ${prof ? `<p>${esc(prof)}</p>` : ""}
      ${p.n ? `<p class="small muted">Am häufigsten: ${esc(p.cats.slice(0, 3).join(", "))}${p.tags.length ? " · " + esc(p.tags.slice(0, 4).join(", ")) : ""}</p>` : ""}</div>` : ""}
    ${own.length ? `<div class="section-h" style="margin:6px 0 0"><h2>Aus deiner Sammlung</h2><span class="muted small num">${own.length}</span></div>
      <div class="hscroll">${own.map(([id, r]) => { const av = availability(r); return `<button class="mini" data-open="${id}">${photoTag(r, "")}<span class="t">${esc(r.title)}<br><span class="muted tiny num">${esc(timeLabel(r))} · ${av.ok}/${av.total} da</span></span></button>`; }).join("")}</div>` : ""}
    <div class="section-h" style="margin:6px 0 0"><h2>Könnte dir gefallen</h2>${cache && !S.ideaLoading ? `<button class="linkbtn" id="f-more">Neue Vorschläge</button>` : ""}</div>
    ${unavailable ? `<div class="banner">Vorschläge kommen von der KI. Verbinde sie über das Zahnrad oben rechts.</div>` : ""}
    ${S.ideaError ? `<div class="banner bad">${esc(S.ideaError)}</div>` : ""}
    ${S.ideaLoading === k ? `<div class="empty row" style="justify-content:center"><span class="spinner"></span> Die KI sucht Gerichte für „${esc(filterLabel(k))}“ …</div>`
      : cache ? cache.items.map(i => { const h = ideaHave(i); return `
      <div class="idea">
        <h3>${esc(i.title)}</h3>
        <span class="why">${esc(i.why)}</span>
        <div class="meta row" style="flex-wrap:wrap;gap:6px">${dietPill(i.diet)}<span class="pill neutral">${esc(i.category)}</span>${i.time ? `<span class="pill neutral num">≈ ${Math.round(i.time)} Min</span>` : ""}${h.total ? `<span class="pill ${h.ok === h.total ? "good" : h.ok ? "warn" : "neutral"} num">${h.ok}/${h.total} Hauptzutaten da</span>` : ""}</div>
        <div class="row"><button class="btn primary grow" data-save="${i.id}">Als Rezept speichern</button><button class="btn" data-nope="${i.id}" aria-label="Nicht mein Ding">Nicht mein Ding</button></div>
      </div>`; }).join("")
      : !unavailable ? `<div class="empty">Noch keine Vorschläge für „${esc(filterLabel(k))}“.<div style="margin-top:10px"><button class="btn primary" id="f-load">Vorschläge holen</button></div></div>` : ""}
  </div>`;
}
function mountForYou() {
  const k = S.ideaFilter || "s:" + currentSeason();
  document.querySelectorAll("[data-f]").forEach(b => b.onclick = () => {
    S.ideaFilter = b.dataset.f; S.ideaError = "";
    if (!b.dataset.f.startsWith("q:")) S.ideaQuery = "";
    render();
    if (!S.ideas[b.dataset.f] && S.sample && !S.ideaLoading) loadIdeas(b.dataset.f);
  });
  $("#f-form").onsubmit = e => {
    e.preventDefault(); const q = $("#f-search").value.trim(); if (!q) return;
    S.ideaQuery = q; S.ideaFilter = "q:" + q; render(); if (!S.ideaLoading) loadIdeas("q:" + q);
  };
  const ld = $("#f-load"); if (ld) ld.onclick = () => loadIdeas(k);
  const mr = $("#f-more"); if (mr) mr.onclick = () => loadIdeas(k);
  document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { S.openRecipe = b.dataset.open; render(); window.scrollTo(0, 0); });
  document.querySelectorAll("[data-nope]").forEach(b => b.onclick = () => {
    const c = S.ideas[k]; const i = c.items.find(x => x.id === b.dataset.nope); if (!i) return;
    c.items = c.items.filter(x => x !== i);
    S.ideas._nope = { at: 0, items: [...(S.ideas._nope?.items || []), i.title].slice(-40) };
    Store.save("ideas"); render(); toast("Merk ich mir");
  });
  document.querySelectorAll("[data-save]").forEach(b => b.onclick = async () => {
    const c = S.ideas[k]; const i = c.items.find(x => x.id === b.dataset.save); if (!i) return;
    b.disabled = true; b.innerHTML = `<span class="spinner"></span> Rezept wird geschrieben …`;
    try {
      const id = await ideaToRecipe(i);
      c.items = c.items.filter(x => x !== i); Store.save("ideas");
      S.openRecipe = id; render(); window.scrollTo(0, 0); toast("Gespeichert. Ein Foto kannst du nach dem Kochen ergänzen.");
    } catch (e) { b.disabled = false; b.textContent = "Nochmal versuchen"; toast(sampleErrorText(e)); }
  });
}

function getR(id) { return S.recipes[id] || S.drafts[id]; }
async function ideaToRecipe(i, draft) {
  const raw = await askClaudeJSON(`Schreib ein vollständiges, gut nachkochbares Rezept für 2 Portionen zu dieser Idee. Antworte NUR mit JSON nach diesem Schema:\n${RECIPE_SCHEMA}\nRegeln: Zeiten realistisch für Hobbyköche (Schneiden, Vorheizen usw. eingerechnet), "stated": null, "confidence": "mittel", "sourceNote": "Vorschlag passend zu deinem Geschmack". "staple": true nur für Salz, Pfeffer, Wasser. "swaps": für jede Fleisch-/Fisch-Zutat 2-3 vegetarische/vegane Alternativen; bei vegetarischen Gerichten vegane Alternativen; bei veganen [].\nIdee: ${JSON.stringify({ title: i.title, category: i.category, seasons: i.seasons, tags: i.tags, keyIngredients: i.keyIngredients, why: i.why })}`);
  const r = cleanRecipe(raw, ""); if (!r.ingredients.length) throw new Error("leer");
  r.createdAt = Date.now(); r.fromIdea = true;
  const id = "r_" + uid();
  if (draft) { S.drafts[id] = r; return id; }
  S.recipes[id] = r; Store.save(id);
  return id;
}

/* Heute: Worauf hast du Lust? */
const MOODS = ["Was Warmes", "Was Leichtes", "Comfort Food", "Schnell und einfach", "Was mit Nudeln", "Scharf", "Was Frisches", "Überrasch mich"];
function todayHistoryText() {
  return S.today.steps.map((st, n) => `${n + 1}. ${st.kind === "start" ? "Lust auf: " + st.text : st.kind === "dir" ? "Richtung: " + st.text : st.kind === "like" ? "mehr in Richtung „" + st.text + "“" : "ganz was anderes als: " + st.text}`).join("\n");
}
function todayPrompt() {
  const own = Object.entries(S.recipes).slice(-60).map(([id, r]) => `${id} | ${r.title} | ${r.category} | ${dietOf(r) || ""} | ${(r.tags || []).slice(0, 6).join(", ")}`).join("\n") || "(keine)";
  const nope = (S.ideas._nope?.items || []).slice(-30).join(", ") || "(nichts)";
  return `Du hilfst in einer Koch-App bei der Frage "Was koche ich heute?". Der Nutzer sagt, worauf er Lust hat, und verfeinert dann Schritt für Schritt.
Verlauf (der letzte Schritt zählt am meisten, frühere bleiben gültig):
${todayHistoryText()}

Gespeicherte Rezepte (id | Titel | Kategorie | Ernährung | Stichworte):
${own}
Aktueller Vorrat: ${S.pantry.map(x => x.name).join(", ") || "(leer)"}
Jahreszeit: ${currentSeason()}. Nicht vorschlagen: ${nope}
Schon gezeigt (nicht wiederholen, außer es passt perfekt): ${S.today.shown.slice(-16).join(", ") || "-"}

Schlage GENAU 4 Gerichte vor, die gut zum Verlauf passen und sich deutlich voneinander unterscheiden. Passende gespeicherte Rezepte gern mit ihrer id als "ownId" (höchstens 2), sonst neue Ideen mit "ownId": null. Bevorzuge, was mit dem Vorrat geht.
Gib außerdem 5 kurze Richtungen (1-3 Wörter, z. B. "leichter", "mehr Gemüse", "asiatischer", "schneller", "mit Käse überbacken"), in die man von diesen Vorschlägen aus weitergehen könnte.
Antworte NUR mit JSON:
{"options": [{"title": "Name", "ownId": null, "why": "1 kurzer Satz per du", "category": "eine aus: ${CATEGORIES.join(", ")}", "time": 30, "diet": "vegan | vegetarisch | pescetarisch | mit Fleisch", "keyIngredients": ["4-6 Hauptzutaten"], "tags": ["…"], "seasons": ["…"]}], "directions": ["…"]}
"time" = realistische Gesamtzeit in Minuten für Hobbyköche.`;
}
async function todayRun(step) {
  if (step.kind === "start") S.today = { steps: [], options: [], directions: [], shown: [], loading: false, error: "" };
  S.today.steps.push(step); S.today.loading = true; S.today.error = ""; render();
  try {
    const raw = await askClaudeJSON(todayPrompt());
    const opts = (raw && Array.isArray(raw.options) ? raw.options : []).filter(o => o && o.title).slice(0, 5).map(o => ({
      id: uid(), title: String(o.title).slice(0, 100), ownId: o.ownId && S.recipes[o.ownId] ? o.ownId : null, why: String(o.why || ""),
      category: CATEGORIES.includes(o.category) ? o.category : "Sonstiges", time: typeof o.time === "number" ? o.time : null,
      diet: ["vegan","vegetarisch","pescetarisch","mit Fleisch"].includes(o.diet) ? o.diet : null,
      keyIngredients: (o.keyIngredients || []).map(String).slice(0, 8), tags: (o.tags || []).map(String).slice(0, 10), seasons: (o.seasons || []).filter(x => SEASONS.includes(x)) }));
    if (!opts.length) throw new Error("leer");
    S.today.options = opts;
    S.today.directions = (raw.directions || []).map(String).filter(Boolean).slice(0, 6);
    S.today.shown.push(...opts.map(o => o.title));
  } catch (e) { S.today.steps.pop(); S.today.error = e && e.code ? sampleErrorText(e) : "Gerade keine Vorschläge bekommen. Versuch es nochmal."; }
  S.today.loading = false; render();
}
function viewToday() {
  const T = S.today, unavailable = S.sampleReady && !S.sample;
  const crumbs = T.steps.map(st => st.kind === "start" ? st.text : st.kind === "dir" ? st.text : st.kind === "like" ? "mehr wie „" + st.text + "“" : "was anderes");
  return `
  <header class="top"><h1>Ideen</h1><div class="hdr-r">${themeBtn()}</div></header>
  <div class="seg" id="h-mode" style="margin-bottom:12px"><button type="button" data-hm="lust" aria-pressed="${S.todayMode === "lust"}">Lust auf …</button><button type="button" data-hm="howto" aria-pressed="${S.todayMode === "howto"}">Wie macht man …?</button><button type="button" data-hm="fuerdich" aria-pressed="${S.todayMode === "fuerdich"}">Für dich</button></div>
  ${S.todayMode === "fuerdich" ? viewForYou(true) : S.todayMode === "howto" ? viewHowto() : `<div class="stack">
    <form class="search" id="h-form">${ICON.search}<input id="h-in" placeholder="Worauf hast du heute Lust?" autocomplete="off" aria-label="Worauf hast du heute Lust?"></form>
    ${unavailable ? `<div class="banner">Das kommt von der KI. Verbinde sie über das Zahnrad oben rechts.</div>` : ""}
    ${!T.steps.length && !T.loading ? `<div class="chips" style="flex-wrap:wrap">${MOODS.map(m => `<button class="chip" data-mood="${esc(m)}">${esc(m)}</button>`).join("")}</div>` : ""}
    ${T.steps.length ? `<div class="row" style="flex-wrap:wrap;gap:6px"><span class="muted small">Dein Weg:</span>${crumbs.map((c, n) => `<span class="pill ${n === crumbs.length - 1 ? "good" : "neutral"}">${esc(c)}</span>`).join("")}<button class="linkbtn small" id="h-reset">Neu starten</button></div>` : ""}
    ${T.error ? `<div class="banner bad">${esc(T.error)}</div>` : ""}
    ${T.loading ? `<div class="empty row" style="justify-content:center"><span class="spinner"></span> Die KI überlegt, was passt …</div>` : ""}
    ${!T.loading && T.options.length ? T.options.map(o => { const own = o.ownId ? S.recipes[o.ownId] : null; const av = own ? availability(own) : null; const h = own ? null : ideaHave(o); return `
      <div class="idea">
        <div class="row" style="align-items:flex-start;gap:12px">${own ? photoTag(own, "thumb") : ""}<div class="grow" style="display:flex;flex-direction:column;gap:6px">
          <h3>${esc(own ? own.title : o.title)}</h3>
          <span class="why">${esc(o.why)}</span>
          <div class="meta row" style="flex-wrap:wrap;gap:6px">${own ? `<span class="pill neutral">Aus deiner Sammlung</span>` : ""}${dietPill(own ? dietOf(own) : o.diet)}${(own ? own.time?.total : o.time) ? `<span class="pill neutral num">≈ ${Math.round(own ? own.time.total : o.time)} Min</span>` : ""}
            ${own ? `<span class="pill ${av.ok === av.total ? "good" : av.frac >= 0.5 ? "warn" : "bad"} num">${av.ok}/${av.total} da</span>` : h.total ? `<span class="pill ${h.ok === h.total ? "good" : h.ok ? "warn" : "neutral"} num">${h.ok}/${h.total} Hauptzutaten da</span>` : ""}</div>
        </div></div>
        <div class="row"><button class="btn primary grow" data-take="${o.id}">${own ? "Öffnen" : "Nehm ich"}</button><button class="btn grow" data-like="${o.id}">Mehr davon</button></div>
      </div>`; }).join("") : ""}
    ${!T.loading && T.options.length ? `<div class="section-h" style="margin:4px 0 0"><h2>In welche Richtung?</h2></div>
      <div class="chips" style="flex-wrap:wrap">${T.directions.map(d => `<button class="chip" data-dir="${esc(d)}">${esc(d)}</button>`).join("")}<button class="chip" id="h-away">Ganz was anderes</button></div>
      <form class="search" id="h-form2">${ICON.search}<input id="h-in2" placeholder="Eigene Richtung, z. B. mit Kartoffeln" autocomplete="off" aria-label="Eigene Richtung"></form>` : ""}
  </div>`}`;
}
function viewHowto() {
  const H = S.howto, unavailable = S.sampleReady && !S.sample;
  return `<div class="stack">
    <form class="search" id="w-form">${ICON.search}<input id="w-in" value="${esc(H.q)}" placeholder="z. B. Lasagne, Pad Thai, Käsespätzle" autocomplete="off" aria-label="Welches Gericht?"></form>
    ${unavailable ? `<div class="banner">Das kommt von der KI. Verbinde sie über das Zahnrad oben rechts.</div>` : ""}
    ${H.error ? `<div class="banner bad">${esc(H.error)}</div>` : ""}
    ${H.loading ? `<div class="empty row" style="justify-content:center"><span class="spinner"></span> Die KI sucht Rezepte für „${esc(H.q)}“ …</div>` : ""}
    ${!H.loading && !H.options.length && !H.error ? `<p class="muted small" style="margin:0">Sag, worauf du Lust hast, und du bekommst ein paar Rezepte dazu: klassisch, schnell und eine besondere Variante. Antippen zeigt das ganze Rezept.</p>` : ""}
    ${!H.loading ? H.options.map(o => { const h = ideaHave(o); return `
      <div class="idea">
        <h3>${esc(o.title)}</h3>
        <span class="why">${esc(o.why)}</span>
        <div class="meta row" style="flex-wrap:wrap;gap:6px">${dietPill(o.diet)}${o.time ? `<span class="pill neutral num">≈ ${Math.round(o.time)} Min</span>` : ""}${h.total ? `<span class="pill ${h.ok === h.total ? "good" : h.ok ? "warn" : "neutral"} num">${h.ok}/${h.total} Hauptzutaten da</span>` : ""}</div>
        <button class="btn primary block" data-how="${o.id}">${o.recipeId && getR(o.recipeId) ? "Rezept öffnen" : "Rezept ansehen"}</button>
      </div>`; }).join("") : ""}
    ${!H.loading && H.options.length ? `<button class="btn block" id="w-more">Andere Varianten</button>` : ""}
  </div>`;
}
async function howtoRun(q, more) {
  const H = S.howto;
  const prev = more ? H.options.map(o => o.title) : [];
  H.q = q; H.loading = true; H.error = ""; render();
  try {
    const raw = await askClaudeJSON(`Der Nutzer einer Koch-App möchte wissen, wie man "${q}" macht. Gib 3 deutlich unterschiedliche Rezept-Varianten dafür: z. B. klassisch/original, eine schnelle Alltagsversion und eine vegetarische oder besondere Variante (wenn das Gericht schon vegetarisch ist, eine andere Abwandlung).${prev.length ? " Nicht wiederholen: " + prev.join(", ") + "." : ""}
Vorrat des Nutzers: ${S.pantry.map(x => x.name).join(", ") || "(leer)"}
Antworte NUR mit JSON:
{"options": [{"title": "Name der Variante", "why": "1 Satz, was diese Variante ausmacht", "category": "eine aus: ${CATEGORIES.join(", ")}", "time": 45, "diet": "vegan | vegetarisch | pescetarisch | mit Fleisch", "keyIngredients": ["4-6 Hauptzutaten"], "tags": ["…"], "seasons": ["…"]}]}
"time" = realistische Gesamtzeit in Minuten für Hobbyköche.`);
    const opts = (raw && Array.isArray(raw.options) ? raw.options : []).filter(o => o && o.title).slice(0, 4).map(o => ({
      id: uid(), title: String(o.title).slice(0, 100), why: String(o.why || ""), category: CATEGORIES.includes(o.category) ? o.category : "Sonstiges",
      time: typeof o.time === "number" ? o.time : null, diet: ["vegan","vegetarisch","pescetarisch","mit Fleisch"].includes(o.diet) ? o.diet : null,
      keyIngredients: (o.keyIngredients || []).map(String).slice(0, 8), tags: (o.tags || []).map(String).slice(0, 10), seasons: (o.seasons || []).filter(x => SEASONS.includes(x)) }));
    if (!opts.length) throw new Error("leer");
    H.options = opts;
  } catch (e) { H.error = e && e.code ? sampleErrorText(e) : "Gerade keine Rezepte bekommen. Versuch es nochmal."; }
  H.loading = false; render();
}
function mountHowto() {
  const H = S.howto;
  $("#w-form").onsubmit = e => { e.preventDefault(); const v = $("#w-in").value.trim(); if (v && !H.loading) howtoRun(v); };
  const mo = $("#w-more"); if (mo) mo.onclick = () => { if (!H.loading) howtoRun(H.q, true); };
  document.querySelectorAll("[data-how]").forEach(b => b.onclick = async () => {
    const o = H.options.find(x => x.id === b.dataset.how); if (!o) return;
    if (o.recipeId && getR(o.recipeId)) { S.openRecipe = o.recipeId; render(); window.scrollTo(0, 0); return; }
    b.disabled = true; b.innerHTML = `<span class="spinner"></span> Rezept wird geschrieben …`;
    try { o.recipeId = await ideaToRecipe(o, true); S.openRecipe = o.recipeId; render(); window.scrollTo(0, 0); }
    catch (e) { b.disabled = false; b.textContent = "Nochmal versuchen"; toast(sampleErrorText(e)); }
  });
}
function mountToday() {
  document.querySelectorAll("[data-hm]").forEach(b => b.onclick = () => { S.todayMode = b.dataset.hm; render(); });
  if (S.todayMode === "howto") { mountHowto(); return; }
  if (S.todayMode === "fuerdich") { mountForYou(); return; }
  const T = S.today;
  $("#h-form").onsubmit = e => { e.preventDefault(); const v = $("#h-in").value.trim(); if (v && !T.loading) todayRun({ kind: "start", text: v }); };
  document.querySelectorAll("[data-mood]").forEach(b => b.onclick = () => { if (!T.loading) todayRun({ kind: "start", text: b.dataset.mood }); });
  const rs = $("#h-reset"); if (rs) rs.onclick = () => { S.today = { steps: [], options: [], directions: [], shown: [], loading: false, error: "" }; render(); };
  document.querySelectorAll("[data-dir]").forEach(b => b.onclick = () => { if (!T.loading) todayRun({ kind: "dir", text: b.dataset.dir }); });
  const aw = $("#h-away"); if (aw) aw.onclick = () => { if (!T.loading) todayRun({ kind: "away", text: T.options.map(o => o.title).join(", ") }); };
  const f2 = $("#h-form2"); if (f2) f2.onsubmit = e => { e.preventDefault(); const v = $("#h-in2").value.trim(); if (v && !T.loading) todayRun({ kind: "dir", text: v }); };
  document.querySelectorAll("[data-like]").forEach(b => b.onclick = () => { const o = T.options.find(x => x.id === b.dataset.like); if (o && !T.loading) todayRun({ kind: "like", text: o.ownId ? S.recipes[o.ownId].title : o.title }); });
  document.querySelectorAll("[data-take]").forEach(b => b.onclick = async () => {
    const o = T.options.find(x => x.id === b.dataset.take); if (!o) return;
    if (o.ownId && S.recipes[o.ownId]) { S.openRecipe = o.ownId; render(); window.scrollTo(0, 0); return; }
    b.disabled = true; b.innerHTML = `<span class="spinner"></span> Rezept wird geschrieben …`;
    try { const id = await ideaToRecipe(o); o.ownId = id; S.openRecipe = id; render(); window.scrollTo(0, 0); toast("Gespeichert. Mit „Das koche ich“ kommt alles Fehlende auf die Liste."); }
    catch (e) { b.disabled = false; b.textContent = "Nochmal versuchen"; toast(sampleErrorText(e)); }
  });
}

/* ---------- Wochenplan ---------- */
const pad2 = n => String(n).padStart(2, "0");
const dkey = d => d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
const todayKey = () => dkey(new Date());
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function mondayOf(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
const WD = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WDL = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
function parseKey(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
function shortDay(k) { const d = parseKey(k); return WD[(d.getDay() + 6) % 7] + " " + d.getDate() + "." + (d.getMonth() + 1) + "."; }
function longDay(k) { const d = parseKey(k); const rel = k === todayKey() ? "Heute" : k === dkey(addDays(new Date(), 1)) ? "Morgen" : WDL[(d.getDay() + 6) % 7]; return { rel, date: d.getDate() + "." + (d.getMonth() + 1) + "." }; }
const HOUSE = { solo: "Nur ich", paar: "Zu zweit", wg: "WG" };
const nameReq = new Set();
async function ensureNames(ids) {
  if (!Store.user) return;
  const need = [...new Set(ids)].filter(i => i && i !== S.me && !(i in S.names) && !nameReq.has(i));
  if (!need.length) return;
  need.forEach(i => nameReq.add(i));
  try { const ps = await Store.user.profiles(need); need.forEach(i => { S.names[i] = (ps && ps[i] && ps[i].name) || ""; }); }
  catch (e) { need.forEach(i => { S.names[i] = ""; }); }
  render();
}
function who(id) { if (!id) return ""; if (id === S.me) return "dir"; return (S.names[id] || "").split(" ")[0] || "jemand"; }
function entriesOn(k) { return (S.plan.days && S.plan.days[k]) || []; }
function defaultServings() { return S.people || (S.household === "paar" ? 2 : S.household === "wg" ? 3 : 2); }
function savePlan() {
  const cut = dkey(addDays(new Date(), -21));
  Object.keys(S.plan.days).forEach(k => { if (k < cut || !S.plan.days[k].length) delete S.plan.days[k]; });
  Store.save("plan");
}
/* Was fehlt für eine Liste von Plan-Einträgen: Bedarf summieren, Vorrat und offene Einkaufsliste abziehen */
function planNeeds(entries) {
  const need = new Map();
  entries.forEach(({ e, day }) => {
    const r = e.recipeId && S.recipes[e.recipeId]; if (!r) return;
    const f = (e.servings || r.servings) / r.servings;
    ings(r).forEach(i => {
      if (i.staple || ingRole(i) === "neben") return;
      const b = base(qtyOf(i) != null ? qtyOf(i) * f : null, i.unit);
      const key = stem(i.name) + "|" + (b ? b.d : "x");
      const cur = need.get(key) || { name: i.name, unit: i.unit, aisle: i.aisle, v: 0, unknown: false, from: new Set(), due: day };
      if (b) cur.v += b.v; else cur.unknown = true;
      cur.from.add(r.title); if (day < cur.due) cur.due = day;
      need.set(key, cur);
    });
  });
  const out = [];
  need.forEach(n => {
    const m = pantryMatches(n.name);
    const d = base(1, n.unit)?.d;
    let have = 0, any = m.length > 0;
    m.forEach(p => { const pb = base(p.qty, p.unit); if (pb && pb.d === d) have += pb.v; });
    const onList = S.shopping.filter(s => !s.checked && matchesName(s.name, n.name));
    let listed = 0; onList.forEach(s => { const sb = base(s.qty, s.unit); if (sb && sb.d === d) listed += sb.v; });
    if (n.unknown || !n.v) { if (!any && !onList.length) out.push({ ...n, buy: null, from: [...n.from], offers: Store.shareMode() ? othersHave(n.name, n.unit) : [], asked: false }); return; }
    const missing = n.v - have - listed;
    if (missing > 1e-6) {
      let buy = fromBase(missing, n.unit); if (!["g","kg","ml","l"].includes(n.unit)) buy = Math.ceil(buy - 1e-6);
      const asked = (S.requests || []).find(q => q.from === S.me && q.status === "offen" && matchesName(q.name, n.name));
      const offers = Store.shareMode() ? othersHave(n.name, n.unit) : [];
      out.push({ ...n, buy, from: [...n.from], partialListed: listed > 0, offers, asked: !!asked });
    }
  });
  return out;
}
function planDue(k) { return planNeeds(entriesOn(k).map(e => ({ e, day: k }))); }
function addNeedsToShopping(needs) {
  needs.filter(n => !n.asked).forEach(n => addToShopping(n.name, n.buy, n.unit, n.aisle, n.from.join(", "), n.due));
  Store.save("shopping");
}
function saveRequests() {
  const cut = Date.now() - 7 * 864e5;
  S.requests = (S.requests || []).filter(q => q.status === "offen" || q.at > cut);
  Store.save("requests");
}
function askFor(n, o) {
  const qty = Math.min(o.qty, n.buy || o.qty);
  S.requests.push({ id: uid(), from: S.me, to: o.owner, name: n.name, qty: n.buy == null ? null : qty, unit: o.unit, forTitle: n.from.join(", "), day: n.due, status: "offen", at: Date.now(), seen: false });
  saveRequests(); toast(`${who(o.owner)} gefragt`); render();
}
function answerRequest(q, yes) {
  q.status = yes ? "ja" : "nein"; q.at = Date.now();
  if (yes) {
    /* Menge aus meinem Fach in "gemeinsam" verschieben, damit sie fürs Essen zählt */
    let rest = q.qty != null ? base(q.qty, q.unit) : null;
    S.pantry.filter(p => p.owner === S.me && matchesName(p.name, q.name)).forEach(p => {
      const pb = base(p.qty, p.unit); if (!pb) return;
      const take = rest ? Math.min(pb.v, rest.v) : pb.v; if (take <= 0) return;
      if (rest) rest.v -= take;
      p.qty = pb.v - take <= 1e-6 ? 0 : roundQty(fromBase(pb.v - take, p.unit), p.unit);
      addToPantry(p.name, fromBase(take, p.unit), p.unit, p.place, null);
    });
    S.pantry = S.pantry.filter(p => p.qty > 0);
    Store.save("pantry");
  } else {
    addToShopping(q.name, q.qty, q.unit, catalogFor(q.name)?.aisle, q.forTitle, q.day);
    Store.save("shopping");
  }
  saveRequests(); render();
}
function viewPlan() {
  const start = addDays(mondayOf(new Date()), S.planWeek * 7);
  const days = Array.from({ length: S.planSpan * 7 }, (_, i) => dkey(addDays(start, i)));
  const tk = todayKey(), tmk = dkey(addDays(new Date(), 1));
  ensureNames(days.flatMap(k => entriesOn(k).map(e => e.by)));
  const remind = [tk, tmk].map(k => { const all = planDue(k); return { k, list: entriesOn(k), needs: all.filter(n => !n.asked && !(n.offers && n.offers.length)), offered: all.filter(n => !n.asked && n.offers && n.offers.length).length, asked: all.filter(n => n.asked).length }; }).filter(x => x.list.length);
  const listedToday = S.shopping.filter(s => !s.checked && s.due && s.due <= tk);
  const shared = Store.shareMode();
  const allNeeds = planNeeds(days.filter(k => k >= tk).flatMap(k => entriesOn(k).map(e => ({ e, day: k })))).filter(n => !n.asked && !(n.offers && n.offers.length));
  const rangeLabel = shortDay(days[0]) + " – " + shortDay(days[days.length - 1]);
  const inbox = shared ? (S.requests || []).filter(q => q.to === S.me && q.status === "offen") : [];
  const answers = shared ? (S.requests || []).filter(q => q.from === S.me && q.status !== "offen" && !q.seen) : [];
  const offerNeeds = shared ? planNeeds(Array.from({ length: 14 }, (_, i) => dkey(addDays(new Date(), i))).flatMap(k => entriesOn(k).map(e => ({ e, day: k })))).filter(n => n.offers.length && !n.asked) : [];
  ensureNames([...inbox.map(q => q.from), ...answers.map(q => q.to), ...offerNeeds.flatMap(n => n.offers.map(o => o.owner))]);
  return `
  <header class="top"><h1>Wochenplan</h1><div class="hdr-r"><button class="chip" id="pl-house">${ICON.people} ${esc(HOUSE[S.household] || "Wer isst mit?")}</button>${themeBtn()}</div></header>
  <div class="stack">
    ${!S.household ? `<div class="profile"><span class="muted tiny" style="font-weight:600">WER NUTZT DIE APP?</span><p>Allein, zu zweit oder in der WG? Danach richten sich die Portionen im Plan.</p>
      <div class="seg">${Object.entries(HOUSE).map(([k, l]) => `<button type="button" data-house="${k}">${l}</button>`).join("")}</div></div>` : ""}
    ${shared && Store.canWriteShared === false ? `<div class="banner bad">Du kannst den Haushalt gerade nur ansehen. Die Person, der die App gehört, muss dich beim Teilen mit Bearbeitungsrecht einladen.</div>` : ""}
    ${inbox.map(q => `<div class="idea" style="border-left-color:var(--accent2)">
        <span class="muted tiny" style="font-weight:600">ANFRAGE AN DEIN FACH</span>
        <span><b>${esc(who(q.from))}</b> fragt: Kann ${q.qty != null ? esc(fmtQty(q.qty, q.unit)) + " " : ""}<b>${esc(q.name)}</b> aus deinem Fach für ${esc(q.forTitle)} (${esc(shortDay(q.day))}) genommen werden?</span>
        <div class="row"><button class="btn primary grow" data-yes="${q.id}">Klar, nehmt es</button><button class="btn grow" data-no="${q.id}">Lieber neu kaufen</button></div>
      </div>`).join("")}
    ${answers.map(q => `<div class="banner row" style="justify-content:space-between;gap:8px"><span>${esc(who(q.to))}: ${q.status === "ja" ? `${esc(q.name)} könnt ihr nehmen.` : `${esc(q.name)} lieber kaufen, steht jetzt auf der Liste.`}</span><button class="linkbtn" data-seen="${q.id}">OK</button></div>`).join("")}
    ${offerNeeds.length ? `<div class="profile"><span class="muted tiny" style="font-weight:600">HABEN ANDERE NOCH DA</span>
      ${offerNeeds.map(n => `<div style="display:flex;flex-direction:column;gap:6px;padding:6px 0;border-top:1px solid var(--line)">
        <span><b>${esc(n.name)}</b>${n.buy != null ? " · fehlt " + esc(fmtQty(n.buy, n.unit)) : ""} <span class="muted small">für ${esc(n.from.join(", "))}, ${esc(shortDay(n.due))}</span></span>
        <div class="row" style="flex-wrap:wrap;gap:6px">${n.offers.map((o, i) => `<button class="btn" data-ask="${esc(n.name)}|${i}">${esc(who(o.owner))} fragen (hat ${esc(fmtQty(o.qty, o.unit))})</button>`).join("")}<button class="btn" data-buy="${esc(n.name)}">Kaufen</button></div>
      </div>`).join("")}</div>` : ""}
    ${remind.map(x => { const L = longDay(x.k); const today = x.k === tk; return `
      <div class="idea" style="border-left-color:${today ? "var(--warm)" : "var(--accent2)"}">
        <span class="muted tiny" style="font-weight:600">${today ? "HEUTE ABEND" : "MORGEN ABEND"}</span>
        <h3>${x.list.map(e => esc(e.title)).join(" + ")}</h3>
        ${x.needs.length ? `<span class="why">Noch einkaufen: ${x.needs.slice(0, 6).map(n => esc(n.name)).join(", ")}${x.needs.length > 6 ? " …" : ""}</span>
          <button class="btn primary" data-addday="${x.k}">${x.needs.length} ${x.needs.length === 1 ? "Sache" : "Sachen"} auf die Einkaufsliste</button>`
        : x.offered || x.asked ? "" : `<span class="why">${today && listedToday.length ? `${listedToday.length} ${listedToday.length === 1 ? "Sache steht" : "Sachen stehen"} noch auf der Einkaufsliste.` : "Alles da oder schon auf der Einkaufsliste."}</span>`}
        ${x.offered ? `<span class="why">${x.offered} ${x.offered === 1 ? "Sache haben" : "Sachen haben"} andere im Fach, siehe oben.</span>` : ""}
        ${x.asked ? `<span class="why">Warte auf Antwort für ${x.asked} ${x.asked === 1 ? "Sache" : "Sachen"}.</span>` : ""}
      </div>`; }).join("")}
    <div class="row" style="justify-content:space-between">
      <button class="qtybtn" id="pl-prev" aria-label="Woche zurück">‹</button>
      <span class="small num" style="font-weight:600">${esc(rangeLabel)}</span>
      <button class="qtybtn" id="pl-next" aria-label="Woche vor">›</button>
    </div>
    <div class="seg" style="grid-template-columns:1fr 1fr"><button type="button" data-span="1" aria-pressed="${S.planSpan === 1}">1 Woche</button><button type="button" data-span="2" aria-pressed="${S.planSpan === 2}">2 Wochen</button></div>
    <div class="list">${days.map(k => { const d = parseKey(k); const list = entriesOn(k); const past = k < tk; return `
      <div class="item" style="align-items:flex-start;${k === tk ? "background:var(--accent-soft);" : ""}${past ? "opacity:.6;" : ""}">
        <div style="width:46px;flex:none;line-height:1.15"><b style="font-family:var(--font-display)">${WD[(d.getDay() + 6) % 7]}</b><br><span class="muted tiny num">${d.getDate()}.${d.getMonth() + 1}.</span></div>
        <div class="grow" style="display:flex;flex-direction:column;gap:6px">
          ${list.map(e => { const r = e.recipeId && S.recipes[e.recipeId]; const nd = r ? planNeeds([{ e, day: k }]).length : 0; return `
            <button class="row" data-entry="${k}|${e.id}" style="border:0;background:none;padding:0;text-align:left;gap:10px;width:100%">
              ${r ? photoTag(r, "thumb") .replace('class="thumb', 'style="width:44px;height:44px;font-size:9px" class="thumb') : ""}
              <span class="grow"><span style="font-weight:600">${esc(e.title)}</span><br><span class="muted tiny">${e.servings ? e.servings + " Port." : ""}${shared && e.by ? " · von " + esc(who(e.by)) : ""}${e.note ? " · " + esc(e.note) : ""}</span></span>
              ${r && !past ? (nd ? `<span class="pill warn num">${nd} fehlt</span>` : `<span class="pill good">da</span>`) : ""}
            </button>`; }).join("")}
          ${!past ? `<button class="linkbtn small" data-addto="${k}" style="align-self:flex-start">+ Essen eintragen</button>` : ""}
        </div>
      </div>`; }).join("")}</div>
    ${allNeeds.length ? `<button class="btn primary block" id="pl-shopall">${ICON.cart} Alles Fehlende (${allNeeds.length}) auf die Einkaufsliste</button>` : ""}
    ${shared ? `<p class="muted tiny" style="margin:0">Plan, Einkaufsliste, Vorrat und Rezepte teilt ihr. Änderungen sehen alle sofort.</p>` : ""}
  </div>`;
}
function mountPlan() {
  $("#pl-house").onclick = householdSheet;
  document.querySelectorAll("[data-house]").forEach(b => b.onclick = () => householdSheet(b.dataset.house));
  $("#pl-prev").onclick = () => { S.planWeek--; render(); };
  $("#pl-next").onclick = () => { S.planWeek++; render(); };
  document.querySelectorAll("[data-span]").forEach(b => b.onclick = () => { S.planSpan = +b.dataset.span; render(); });
  document.querySelectorAll("[data-addto]").forEach(b => b.onclick = () => planAddSheet(b.dataset.addto));
  document.querySelectorAll("[data-entry]").forEach(b => b.onclick = () => { const [k, id] = b.dataset.entry.split("|"); planEntrySheet(k, id); });
  const offerNeeds = Store.shareMode() ? planNeeds(Array.from({ length: 14 }, (_, i) => dkey(addDays(new Date(), i))).flatMap(k => entriesOn(k).map(e => ({ e, day: k })))).filter(n => n.offers.length && !n.asked) : [];
  document.querySelectorAll("[data-ask]").forEach(b => b.onclick = () => { const [nm, i] = b.dataset.ask.split("|"); const n = offerNeeds.find(x => x.name === nm); if (n) askFor(n, n.offers[+i]); });
  document.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => { const n = offerNeeds.find(x => x.name === b.dataset.buy); if (n) { addToShopping(n.name, n.buy, n.unit, n.aisle, n.from.join(", "), n.due); Store.save("shopping"); toast(`${n.name} auf der Einkaufsliste`); render(); } });
  document.querySelectorAll("[data-yes]").forEach(b => b.onclick = () => { const q = S.requests.find(x => x.id === b.dataset.yes); if (q) { answerRequest(q, true); toast("Danke! Ist jetzt gemeinsam fürs Essen."); } });
  document.querySelectorAll("[data-no]").forEach(b => b.onclick = () => { const q = S.requests.find(x => x.id === b.dataset.no); if (q) { answerRequest(q, false); toast("Steht auf der Einkaufsliste"); } });
  document.querySelectorAll("[data-seen]").forEach(b => b.onclick = () => { const q = S.requests.find(x => x.id === b.dataset.seen); if (q) { q.seen = true; saveRequests(); render(); } });
  document.querySelectorAll("[data-addday]").forEach(b => b.onclick = () => { const n = planDue(b.dataset.addday).filter(x => !(x.offers && x.offers.length)); addNeedsToShopping(n); toast(`${n.length} Sachen auf der Einkaufsliste`); render(); });
  const all = $("#pl-shopall"); if (all) all.onclick = () => {
    const start = addDays(mondayOf(new Date()), S.planWeek * 7), tk = todayKey();
    const days = Array.from({ length: S.planSpan * 7 }, (_, i) => dkey(addDays(start, i))).filter(k => k >= tk);
    const n = planNeeds(days.flatMap(k => entriesOn(k).map(e => ({ e, day: k })))).filter(x => !(x.offers && x.offers.length)); addNeedsToShopping(n); toast(`${n.length} Sachen auf der Einkaufsliste`); render();
  };
}
function householdSheet(preset) {
  let mode = typeof preset === "string" ? preset : (S.household || "solo");
  let people = S.people || (mode === "paar" ? 2 : mode === "wg" ? 3 : 1);
  const draw = sh => {
    sh.innerHTML = `<h3>Wer nutzt die App?</h3>
      <div class="seg">${Object.entries(HOUSE).map(([k, l]) => `<button type="button" data-m="${k}" aria-pressed="${k === mode}">${l}</button>`).join("")}</div>
      ${mode === "wg" ? `<div class="field"><label>Wie viele esst ihr meistens zusammen?</label><div class="servings"><span class="grow">Personen</span><button class="qtybtn" id="hh-m">−</button><b class="num" style="min-width:24px;text-align:center">${people}</b><button class="qtybtn" id="hh-p">+</button></div></div>` : ""}
      ${mode !== "solo" ? `<div class="banner bad small">Das Teilen zwischen mehreren Handys kommt mit der Synchronisierung im nächsten Schritt. Bis dahin passt die App nur die Portionen an.</div>` : ""}
      <div class="row"><button class="btn grow" id="hh-x">Abbrechen</button><button class="btn primary grow" id="hh-ok">Übernehmen</button></div>`;
    sh.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { mode = b.dataset.m; people = mode === "paar" ? 2 : mode === "wg" ? Math.max(3, people) : 1; draw(sh); });
    const m = sh.querySelector("#hh-m"), pl = sh.querySelector("#hh-p");
    if (m) m.onclick = () => { people = Math.max(2, people - 1); draw(sh); };
    if (pl) pl.onclick = () => { people = Math.min(12, people + 1); draw(sh); };
    sh.querySelector("#hh-x").onclick = closeSheet;
    sh.querySelector("#hh-ok").onclick = () => { closeSheet(); setHousehold(mode, mode === "solo" ? 1 : people); toast(mode === "solo" ? "Nur für dich" : "Haushalt aktiv: " + HOUSE[mode]); };
  };
  openSheet("", draw);
}
function planAddSheet(day) {
  let q = "", serv = defaultServings();
  const draw = sh => {
    const L = longDay(day);
    const fq = fold(q);
    const list = Object.entries(S.recipes).filter(([, r]) => !fq || fold(r.title).includes(fq) || fold(r.category).includes(fq)).sort((a, b) => availability(b[1]).frac - availability(a[1]).frac).slice(0, 8);
    sh.innerHTML = `<h3>${esc(L.rel)} ${esc(L.date)}: Was gibt's?</h3>
      <div class="search">${ICON.search}<input id="pa-q" value="${esc(q)}" placeholder="Rezept suchen oder Gericht eintippen" autocomplete="off"></div>
      <div class="servings"><span class="grow">Portionen</span><button class="qtybtn" id="pa-m">−</button><b class="num" style="min-width:24px;text-align:center">${serv}</b><button class="qtybtn" id="pa-p">+</button></div>
      <div class="list">${list.map(([id, r]) => { const av = availability(r); return `<button class="item" data-pick="${id}" style="width:100%;border-left:0;border-right:0;border-top:0;background:none;text-align:left">${photoTag(r, "thumb").replace('class="thumb', 'style="width:40px;height:40px;font-size:9px" class="thumb')}<span class="name">${esc(r.title)}<br><span class="muted tiny num">${esc(timeLabel(r))} · ${av.ok}/${av.total} da</span></span></button>`; }).join("") || `<div class="item muted small">Kein passendes Rezept gespeichert.</div>`}</div>
      ${q.trim() ? `<button class="btn block" id="pa-free">„${esc(q.trim())}“ ohne Rezept eintragen</button>` : ""}
      <button class="linkbtn" id="pa-ideas">Keine Idee? Zu „Lust auf …“</button>`;
    const inp = sh.querySelector("#pa-q");
    inp.oninput = () => { q = inp.value; const pos = inp.selectionStart; draw(sh); const n = sh.querySelector("#pa-q"); n.focus(); n.setSelectionRange(pos, pos); };
    sh.querySelector("#pa-m").onclick = () => { serv = Math.max(1, serv - 1); draw(sh); };
    sh.querySelector("#pa-p").onclick = () => { serv = Math.min(20, serv + 1); draw(sh); };
    sh.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { addPlanEntry(day, { recipeId: b.dataset.pick, title: S.recipes[b.dataset.pick].title, servings: serv }); closeSheet(); });
    const fr = sh.querySelector("#pa-free"); if (fr) fr.onclick = () => { addPlanEntry(day, { recipeId: null, title: q.trim(), servings: serv }); closeSheet(); };
    sh.querySelector("#pa-ideas").onclick = () => { closeSheet(); S.tab = "heute"; S.todayMode = "lust"; render(); window.scrollTo(0, 0); };
  };
  openSheet("", draw);
}
function addPlanEntry(day, e) {
  if (!S.plan.days[day]) S.plan.days[day] = [];
  S.plan.days[day].push({ id: uid(), recipeId: e.recipeId, title: e.title, servings: e.servings, by: S.me || null, note: e.note || "" });
  savePlan(); render(); toast(`${e.title} am ${shortDay(day)} eingetragen`);
}
function planEntrySheet(day, id) {
  const e = entriesOn(day).find(x => x.id === id); if (!e) return;
  const r = e.recipeId && S.recipes[e.recipeId];
  let move = false;
  const draw = sh => {
    const needs = r ? planNeeds([{ e, day }]) : [];
    const days = Array.from({ length: 14 }, (_, i) => dkey(addDays(new Date(), i)));
    sh.innerHTML = `<h3>${esc(e.title)}</h3>
      <span class="muted small">${esc(longDay(day).rel)} ${esc(longDay(day).date)}${e.by && Store.shareMode() ? " · eingetragen von " + esc(who(e.by)) : ""}</span>
      <div class="servings"><span class="grow">Portionen</span><button class="qtybtn" id="pe-m">−</button><b class="num" style="min-width:24px;text-align:center">${e.servings || "–"}</b><button class="qtybtn" id="pe-p">+</button></div>
      <div class="field"><label for="pe-note">Notiz (z. B. wer kocht)</label><input id="pe-note" value="${esc(e.note || "")}" placeholder="Louis kocht, Anna kauft ein"></div>
      ${r ? (needs.length ? `<button class="btn primary block" id="pe-shop">${needs.length} fehlende ${needs.length === 1 ? "Sache" : "Sachen"} auf die Liste</button>` : `<span class="pill good" style="align-self:flex-start">Alles da oder auf der Liste</span>`) : ""}
      ${move ? `<div class="chips" style="flex-wrap:wrap">${days.map(k => `<button class="chip" data-mv="${k}" aria-pressed="${k === day}">${esc(shortDay(k))}</button>`).join("")}</div>` : ""}
      <div class="row" style="flex-wrap:wrap">${r ? `<button class="btn grow" id="pe-open">Rezept öffnen</button>` : ""}<button class="btn grow" id="pe-move">Verschieben</button><button class="btn danger" id="pe-del">Entfernen</button></div>
      <button class="btn block" id="pe-done">Fertig</button>`;
    const saveNote = () => { const v = sh.querySelector("#pe-note").value.trim(); if (v !== (e.note || "")) { e.note = v; savePlan(); } };
    sh.querySelector("#pe-m").onclick = () => { saveNote(); e.servings = Math.max(1, (e.servings || 2) - 1); savePlan(); draw(sh); };
    sh.querySelector("#pe-p").onclick = () => { saveNote(); e.servings = Math.min(20, (e.servings || 2) + 1); savePlan(); draw(sh); };
    const shp = sh.querySelector("#pe-shop"); if (shp) shp.onclick = () => { saveNote(); addNeedsToShopping(needs); toast(`${needs.length} Sachen auf der Einkaufsliste`); draw(sh); render(); };
    const op = sh.querySelector("#pe-open"); if (op) op.onclick = () => { saveNote(); closeSheet(); S.openRecipe = e.recipeId; render(); window.scrollTo(0, 0); };
    sh.querySelector("#pe-move").onclick = () => { saveNote(); move = !move; draw(sh); };
    sh.querySelectorAll("[data-mv]").forEach(b => b.onclick = () => {
      const to = b.dataset.mv; if (to === day) return;
      S.plan.days[day] = entriesOn(day).filter(x => x.id !== e.id);
      if (!S.plan.days[to]) S.plan.days[to] = []; S.plan.days[to].push(e);
      savePlan(); closeSheet(); render(); toast(`Verschoben auf ${shortDay(to)}`);
    });
    sh.querySelector("#pe-del").onclick = () => { S.plan.days[day] = entriesOn(day).filter(x => x.id !== e.id); savePlan(); closeSheet(); render(); };
    sh.querySelector("#pe-done").onclick = () => { saveNote(); closeSheet(); render(); };
  };
  openSheet("", draw);
}
function planPickDaySheet(recipeId) {
  const r = S.recipes[recipeId]; if (!r) return;
  let serv = defaultServings();
  const days = Array.from({ length: 14 }, (_, i) => dkey(addDays(new Date(), i)));
  const draw = sh => {
    sh.innerHTML = `<h3>${esc(r.title)}: an welchem Abend?</h3>
      <div class="servings"><span class="grow">Portionen</span><button class="qtybtn" id="pp-m">−</button><b class="num" style="min-width:24px;text-align:center">${serv}</b><button class="qtybtn" id="pp-p">+</button></div>
      <div class="chips" style="flex-wrap:wrap">${days.map(k => `<button class="chip" data-day="${k}">${esc(k === todayKey() ? "Heute" : k === dkey(addDays(new Date(), 1)) ? "Morgen" : shortDay(k))}${entriesOn(k).length ? " ·" : ""}</button>`).join("")}</div>
      <p class="muted tiny" style="margin:0">Ein Punkt heißt: An dem Abend steht schon etwas drin.</p>
      <button class="btn" id="pp-x">Abbrechen</button>`;
    sh.querySelector("#pp-m").onclick = () => { serv = Math.max(1, serv - 1); draw(sh); };
    sh.querySelector("#pp-p").onclick = () => { serv = Math.min(20, serv + 1); draw(sh); };
    sh.querySelector("#pp-x").onclick = closeSheet;
    sh.querySelectorAll("[data-day]").forEach(b => b.onclick = () => { closeSheet(); addPlanEntry(b.dataset.day, { recipeId, title: r.title, servings: serv }); });
  };
  openSheet("", draw);
}

/* Einkauf */
function viewShopping() {
  const open = S.shopping.filter(s => !s.checked), done = S.shopping.filter(s => s.checked);
  const groups = AISLE_ORDER.map(a => ({ a, items: open.filter(s => (s.aisle || "Sonstiges") === a).sort((x, y) => (x.due || "9999").localeCompare(y.due || "9999")) })).filter(g => g.items.length);
  const itemHtml = s => `<button class="shop-item" role="checkbox" aria-checked="${s.checked}" data-sid="${s.id}">
      <span class="check">${s.checked ? ICON.check : ""}</span>
      <span class="name grow">${esc(s.name)}${s.from && s.from.length ? `<span class="from">für ${esc(s.from.join(", "))}</span>` : ""}</span>
      ${s.due && !s.checked ? `<span class="pill ${s.due <= todayKey() ? "warn" : "neutral"}">${s.due < todayKey() ? "überfällig" : s.due === todayKey() ? "bis heute" : s.due === dkey(addDays(new Date(), 1)) ? "bis morgen" : "bis " + esc(shortDay(s.due))}</span>` : ""}
      <span class="num small" style="font-weight:600">${s.qty != null ? esc(fmtQty(s.qty, s.unit)) : ""}</span></button>`;
  return `
  <header class="top"><h1>Einkaufsliste</h1><div class="hdr-r"><span class="sub num">${open.length} offen</span>${themeBtn()}</div></header>
  <div class="search">${ICON.search}<input id="s-search" placeholder="Etwas dazuschreiben …" autocomplete="off" aria-label="Zur Einkaufsliste hinzufügen"><div class="suggest" id="s-sug" hidden></div></div>
  ${!S.shopping.length ? `<div class="empty" style="margin-top:16px">Die Liste ist leer.<br>Öffne ein Rezept und tippe auf <b>Das koche ich</b>, dann landet alles Fehlende hier.</div>` : ""}
  ${groups.map(g => `<div class="section-h"><h2>${esc(g.a)}</h2></div><div class="list">${g.items.map(itemHtml).join("")}</div>`).join("")}
  ${!open.length && done.length ? `<div class="banner" style="margin-top:16px">Alles eingekauft.</div>` : ""}
  ${done.length ? `
    <div class="section-h"><h2>Eingekauft · schon im Vorrat</h2><button class="linkbtn" id="s-clear">Abgehakte ausblenden</button></div>
    <div class="list">${done.map(itemHtml).join("")}</div>` : ""}
  <div style="margin-top:16px"><button class="btn block" id="s-photo">${ICON.camera} Einkauf fotografieren und eintragen</button></div>
  <p class="muted tiny" style="margin:8px 0 0">Abhaken trägt die Sache sofort in den Vorrat ein, wieder anklicken nimmt sie raus. Lange drücken zum Ändern.</p>`;
}
function mountShopping() {
  attachAutocomplete($("#s-search"), $("#s-sug"), c => {
    qtySheet({ title: `${c.name} auf die Liste`, name: c.name, qty: c.unit === "g" || c.unit === "ml" ? 500 : 1, unit: c.unit, okLabel: "Hinzufügen",
      onOk: v => { addToShopping(v.name, v.qty || null, v.unit, c.aisle); Store.save("shopping"); render(); setTimeout(() => $("#s-search")?.focus(), 50); } });
  });
  document.querySelectorAll("[data-sid]").forEach(b => {
    const s = S.shopping.find(x => x.id === b.dataset.sid);
    b.onclick = () => {
      s.checked = !s.checked;
      const q = s.qty == null ? 1 : s.qty, u = s.qty == null ? "Stk" : s.unit;
      if (s.checked && !s.inPantry) { addToPantry(s.name, q, u, defaultPlace(s.name), defaultOwner(s.from && s.from.length)); s.inPantry = true; toast(`${s.name} ist jetzt im Vorrat`); }
      else if (!s.checked && s.inPantry) { removeFromPantry(s.name, q, u); s.inPantry = false; }
      Store.save("pantry"); Store.save("shopping"); render();
    };
    let t; b.addEventListener("contextmenu", e => { e.preventDefault(); editShop(s); });
    b.addEventListener("touchstart", () => { t = setTimeout(() => editShop(s), 550); }, { passive: true });
    b.addEventListener("touchend", () => clearTimeout(t)); b.addEventListener("touchmove", () => clearTimeout(t), { passive: true });
  });
  const cl = $("#s-clear");
  if (cl) cl.onclick = () => { S.shopping = S.shopping.filter(s => !s.checked); Store.save("shopping"); render(); };
  $("#s-photo").onclick = () => groceryPhotoFlow();
}
function editShop(s) {
  qtySheet({ title: s.name, name: s.name, qty: s.qty ?? 1, unit: s.unit || "Stk", okLabel: "Speichern",
    onOk: v => { Object.assign(s, { name: v.name, qty: v.qty || null, unit: v.unit }); Store.save("shopping"); render(); },
    onDelete: () => { S.shopping = S.shopping.filter(x => x !== s); Store.save("shopping"); render(); } });
}

/* ---------- Budget-Balken (immer oben sichtbar, wenn ein Wochenlimit gesetzt ist) ---------- */
const eur = v => (Math.round(v * 100) / 100).toFixed(2).replace(".", ",") + " €";
function budgetBar() {
  const b = +S.ai?.budget || 0;
  if (!b) return "";
  const w = AI.week(), frac = Math.min(1, w.cost / b);
  const col = frac >= 1 ? "var(--bad)" : frac >= 0.8 ? "var(--warm)" : "var(--accent2)";
  return `<button class="budgetbar" data-budgetbar aria-label="KI-Budget diese Woche: ${eur(w.cost)} von ${eur(b)}">
    <span class="bb-track"><i style="width:${Math.max(2, Math.round(frac * 100))}%;background:${col}"></i></span>
    <span class="bb-label num">${eur(w.cost)} / ${eur(b)} diese Woche</span></button>`;
}

/* ---------- Einstellungen ---------- */
function viewSettings() {
  const p = AI.provider(), P = PROVIDERS[p];
  const w = AI.week(), t = AI.today();
  const model = AI.model(p);
  const price = AI.price(model);
  const b = +S.ai.budget || 0;
  return `
  <header class="top"><h1>Einstellungen</h1><div class="hdr-r">${themeToggleBtn()}</div></header>
  <div class="stack">
    <div><button class="linkbtn row" id="st-back">${ICON.back} Zurück</button></div>
    <div class="section-h" style="margin:4px 0 0"><h2>KI-Anbieter</h2></div>
    <div class="seg">${Object.entries(PROVIDERS).map(([k, v]) => `<button type="button" data-prov="${k}" aria-pressed="${k === p}">${k === "gemini" ? "Gemini" : k === "claude" ? "Claude" : "ChatGPT"}</button>`).join("")}</div>
    ${capsTable(p)}
    <div class="profile">
      <span class="small">${esc(P.keyHint)} <a href="${P.keyUrl}" target="_blank" rel="noopener">Schlüssel holen</a></span>
      <div class="field"><label for="st-key">API-Schlüssel ${esc(P.name)}</label><input id="st-key" type="password" autocomplete="off" value="${esc(AI.key(p))}" placeholder="Schlüssel hier einfügen"></div>
      <div class="field"><label for="st-model">Modell</label>
        ${P.models.length ? `<select id="st-model">${P.models.map(m => `<option value="${m.id}" ${m.id === model ? "selected" : ""}>${esc(m.label)}</option>`).join("")}<option value="__own" ${P.models.some(m => m.id === model) ? "" : "selected"}>Anderes Modell …</option></select>` : ""}
        <input id="st-model-own" autocomplete="off" placeholder="Modell-Name, z. B. vom Anbieter kopiert" value="${P.models.some(m => m.id === model) ? "" : esc(model)}" ${P.models.length && P.models.some(m => m.id === model) ? "hidden" : ""}></div>
      ${p === "gemini" ? `<label class="row small"><input type="checkbox" id="st-gpaid" ${S.ai.geminiPaid ? "checked" : ""}> Ich nutze Gemini kostenpflichtig (sonst zählt es als 0 €)</label>` : ""}
      <div class="row"><button class="btn primary grow" id="st-save">Speichern</button><button class="btn" id="st-test">Testen</button></div>
      <span class="small muted" id="st-status" role="status">${AI.ready() ? "Verbunden: " + esc(P.name) : "Noch nicht verbunden"}</span>
      <span class="tiny muted">Der Schlüssel bleibt nur auf diesem Gerät und wird direkt an ${esc(P.name)} geschickt.</span>
    </div>

    <div class="section-h" style="margin:8px 0 0"><h2>Verbrauch</h2></div>
    <div class="profile">
      <div class="row" style="justify-content:space-between"><span>Heute</span><span class="num"><b>${t.req}</b> Anfragen · ${eur(t.cost)}</span></div>
      <div class="row" style="justify-content:space-between"><span>Diese Woche</span><span class="num"><b>${w.req}</b> Anfragen · ${eur(w.cost)}</span></div>
      <div class="row" style="justify-content:space-between"><span class="muted small">Tokens diese Woche</span><span class="num small muted">${Math.round(w.in / 1000)}k rein · ${Math.round(w.out / 1000)}k raus</span></div>
      <span class="tiny muted">${price[0] || price[1] ? `Gerechnet mit ${String(price[0]).replace(".", ",")} $ / ${String(price[1]).replace(".", ",")} $ pro 1 Mio. Tokens (rein/raus), grob 1 $ ≈ 1 €. Eine Schätzung aus den Zahlen, die die KI bei jeder Antwort mitschickt, kein Kontoauszug.` : p === "gemini" ? "Gratis-Kontingent: es gibt Tageslimits pro Modell. Ist es aufgebraucht, meldet die App das." : "Für dieses Modell ist kein Preis hinterlegt. Trag ihn unten ein, dann rechnet die App mit."}</span>
      <div class="field"><label for="st-budget">Wochenlimit in € (0 = kein Limit)</label><input id="st-budget" inputmode="decimal" value="${b ? String(b).replace(".", ",") : ""}" placeholder="z. B. 1,00"></div>
      <span class="tiny muted">Mit Limit siehst du oben immer einen schmalen Balken. Ist es erreicht, macht die App keine KI-Anfragen mehr bis Montag.</span>
      <details><summary class="small">Eigene Preise für „${esc(model || "Modell")}“</summary>
        <div class="row" style="margin-top:8px"><div class="field grow"><label for="st-pin">$ pro 1 Mio. rein</label><input id="st-pin" inputmode="decimal" value="${(S.ai.prices[model] || [])[0] ?? ""}"></div><div class="field grow"><label for="st-pout">$ pro 1 Mio. raus</label><input id="st-pout" inputmode="decimal" value="${(S.ai.prices[model] || [])[1] ?? ""}"></div></div>
      </details>
      <button class="btn" id="st-save2">Limit und Preise speichern</button>
    </div>

    ${pushSettingsHtml()}

    <div class="section-h" style="margin:8px 0 0"><h2>Deine Daten</h2></div>
    <div class="profile">
      <span class="small">Alles liegt nur auf diesem Gerät. Mach ab und zu eine Sicherung, z. B. bevor du das Handy wechselst.</span>
      <div class="row" style="flex-wrap:wrap"><button class="btn grow" id="st-export">Sicherung herunterladen</button><button class="btn grow" id="st-import">Sicherung einspielen</button></div>
      <button class="btn" id="st-kp">Aus dem Küchenplan (Claude) übernehmen</button>
    </div>
    <p class="muted tiny" style="margin:0">Essens-App · Version ${APP_VERSION}</p>
  </div>`;
}
/* Was welcher Anbieter kann */
const CAPS = [
  ["YouTube-Videos ansehen", { gemini: 1, claude: 0, openai: 0 }],
  ["Rezept-Webseiten lesen", { gemini: 1, claude: 1, openai: 0 }],
  ["Fotos: Einkauf, Screenshots, Gerichte", { gemini: 1, claude: 1, openai: 1 }],
  ["Erzählen, Ideen, Anpassen, Vorschläge", { gemini: 1, claude: 1, openai: 1 }],
];
function capsTable(sel) {
  const cols = [["gemini", "Gemini"], ["claude", "Claude"], ["openai", "ChatGPT"]];
  const mark = v => v ? `<span style="color:var(--accent2);font-weight:700">✓</span>` : `<span class="muted">–</span>`;
  return `<div class="profile" style="gap:4px;padding:10px 12px">
    <div style="display:grid;grid-template-columns:1fr repeat(3,56px);gap:6px 4px;align-items:center;font-size:13px">
      <span></span>${cols.map(([k, l]) => `<b style="text-align:center;font-size:12px;${k === sel ? "color:var(--accent2)" : ""}">${l}</b>`).join("")}
      ${CAPS.map(([l, v]) => `<span>${l}</span>${cols.map(([k]) => `<span style="text-align:center">${mark(v[k])}</span>`).join("")}`).join("")}
    </div>
    <span class="tiny muted">Nur Gemini kann Videos ansehen. Bei Claude und ChatGPT brauchen YouTube-, Instagram- und TikTok-Links einen Screenshot oder die Videobeschreibung.</span>
  </div>`;
}
function readNum(v) { const n = parseFloat(String(v || "").replace(",", ".")); return isNaN(n) ? 0 : n; }
function mountSettings() {
  const p = AI.provider();
  mountPushSettings();
  $("#st-back").onclick = () => { S.settingsOpen = false; render(); };
  document.querySelectorAll("[data-prov]").forEach(b => b.onclick = () => { S.ai.provider = b.dataset.prov; Store.save("ai"); AI.init(); render(); });
  const sel = $("#st-model"), own = $("#st-model-own");
  if (sel) sel.onchange = () => { own.hidden = sel.value !== "__own"; if (!own.hidden) own.focus(); };
  const saveAI = () => {
    S.ai.keys[p] = $("#st-key").value.trim();
    S.ai.models[p] = sel && sel.value !== "__own" ? sel.value : own.value.trim();
    const gp = $("#st-gpaid"); if (gp) S.ai.geminiPaid = gp.checked;
    Store.save("ai"); AI.init();
  };
  $("#st-save").onclick = () => { saveAI(); render(); toast(AI.ready() ? "Gespeichert" : "Gespeichert, aber Schlüssel oder Modell fehlt"); };
  $("#st-test").onclick = async () => {
    saveAI(); const st = $("#st-status"); st.textContent = "Teste …";
    try { await AI.test(); st.textContent = "Klappt! " + PROVIDERS[p].name + " antwortet."; }
    catch (e) { st.textContent = sampleErrorText(e); }
  };
  $("#st-save2").onclick = () => {
    S.ai.budget = readNum($("#st-budget").value);
    const m = AI.model(p), pi = $("#st-pin").value.trim(), po = $("#st-pout").value.trim();
    if (pi || po) S.ai.prices[m] = [readNum(pi), readNum(po)]; else delete S.ai.prices[m];
    Store.save("ai"); render(); toast("Gespeichert");
  };
  $("#st-export").onclick = async () => {
    const data = await Store.exportAll();
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `essensapp-sicherung-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };
  $("#st-import").onclick = async () => {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/json,.json";
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      try { const json = JSON.parse(await f.text()); confirmSheet("Sicherung einspielen?", "Deine jetzigen Daten werden durch die Sicherung ersetzt.", "Ersetzen", async () => { await Store.importAll(json, true); AI.init(); render(); toast("Sicherung eingespielt"); }, true); }
      catch (e) { toast("Diese Datei ist keine Sicherung der Essens-App."); }
    };
    inp.click();
  };
  $("#st-kp").onclick = () => openSheet(`<h3>Aus dem Küchenplan übernehmen</h3>
    <p class="small" style="margin:0">Öffne den Küchenplan in Claude, geh dort in den Vorrat und tippe auf <b>Daten kopieren</b>. Dann hier einfügen:</p>
    <div class="field"><textarea id="kp-text" placeholder="Hier einfügen"></textarea></div>
    <div class="row"><button class="btn grow" id="kp-x">Abbrechen</button><button class="btn primary grow" id="kp-ok">Übernehmen</button></div>
    <span class="small muted" id="kp-st"></span>`, sh => {
    sh.querySelector("#kp-x").onclick = closeSheet;
    sh.querySelector("#kp-ok").onclick = async () => {
      try {
        const json = JSON.parse(sh.querySelector("#kp-text").value.trim());
        const d = json.data || json; const out = {};
        if (d.recipes) Object.entries(d.recipes).forEach(([k, v]) => out[k] = v);
        if (d.pantry) out.pantry = { items: d.pantry };
        if (d.shopping) out.shopping = { items: d.shopping };
        if (d.plan) out.plan = d.plan;
        await Store.importAll({ data: out }, false); AI.init(); closeSheet(); render();
        toast(`${Object.keys(d.recipes || {}).length} Rezepte übernommen`);
      } catch (e) { sh.querySelector("#kp-st").textContent = "Das sieht nicht nach Küchenplan-Daten aus. Bitte komplett kopieren und einfügen."; }
    };
  });
}

/* ---------- Start ---------- */
function startApp() {
  if (location.hash === "#einkauf") S.tab = "einkauf";
  render();
  Store.init().then(() => { AI.init(); render(); Push.changed(); });
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
}
