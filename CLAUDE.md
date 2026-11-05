# Hinweise für Claude

- Besitzer: Louis. Antworten und Texte in der App auf Deutsch, per „du“.
- Reine statische Web-App ohne Build-Schritt; läuft über GitHub Pages. Keine Frameworks einführen, ohne zu fragen.
- Ladereihenfolge in `index.html`: `js/app.js` → `js/store.js` → `js/ai.js` → `js/push.js` → `startApp()`. Alles sind klassische Skripte mit globalen Funktionen.
- Zustand liegt im globalen Objekt `S`; Änderungen speichern mit `Store.save("<schlüssel>")` (pantry, shopping, plan, requests, ideas, settings, ai, usage, push, queue, r_<id>).
- KI-Aufrufe immer über `askClaudeJSON(prompt, bilder, { link })` (Name historisch, ruft den gewählten Anbieter auf). Fehlertexte über `sampleErrorText(e)`.
- Design-Wünsche: Akzente Koralle (Hauptaktionen) und Petrol (Häkchen, Filter, „da“); heller Modus Sand statt Weiß, dunkler Modus warmes Grau. Kein Grün, Tomatenrot, Safran, Aubergine oder Beere als Akzent.
- Bei jeder Änderung an Dateien, die offline gecacht werden, `VERSION` in `sw.js` und `APP_VERSION` in `js/app.js` hochzählen.
- API-Schlüssel nie ins Repository schreiben.
- Push: `push-server/worker.js` (Cloudflare Worker, schickt leere Pushes zu Zeitpunkten); Texte berechnet `js/push.js` lokal und legt sie in IndexedDB unter `reminders` ab, `sw.js` zeigt sie an. In Block-Kommentaren kein `*/` (z. B. Cron-Ausdrücke) schreiben.
- Varianten: Ein Rezept hat oben die aktive Variante (Name in `variantName`), weitere liegen in `variants[]`; `switchVariant()` tauscht sie. Ähnliche Rezepte erkennt `findSimilar()`, Unterschiede zeigt `compareSheet()`.
- Import-Warteschlange wird gespeichert (`queue`); bei Tageslimit pausiert sie (`pausedUntil`) und läuft beim nächsten Öffnen bzw. automatisch weiter.
