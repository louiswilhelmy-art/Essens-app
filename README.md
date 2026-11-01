# Essens-App

Persönliche Koch-App: Vorrat, Rezepte (aus Links, YouTube-Videos oder selbst erzählt), Ideen, Wochenplan und Einkaufsliste. Die KI-Funktionen laufen über einen eigenen API-Schlüssel: standardmäßig **Gemini**, wahlweise **Claude** oder **ChatGPT**.

Die App ist eine Web-App (PWA). Sie läuft im Browser und lässt sich wie eine normale App aufs Handy installieren.

## Online stellen (einmalig, kostenlos über GitHub Pages)

1. Im Repository auf **Settings → Pages**.
2. Bei „Build and deployment“ → **Source: Deploy from a branch**.
3. **Branch: `main`**, Ordner **`/ (root)`** → **Save**.
4. Nach 1–2 Minuten ist die App erreichbar unter
   `https://louiswilhelmy-art.github.io/essens-app/`

## Aufs Handy holen

- **Android (Chrome):** Adresse öffnen → Menü ⋮ → **App installieren** bzw. „Zum Startbildschirm hinzufügen“.
- **iPhone (Safari):** Adresse öffnen → Teilen-Symbol → **Zum Home-Bildschirm**.

## KI verbinden

In der App oben rechts auf das **Zahnrad**:

| Anbieter | Schlüssel holen | Kosten |
|---|---|---|
| Gemini (Standard) | https://aistudio.google.com/apikey | Gratis-Kontingent mit Tageslimits |
| Claude | https://console.anthropic.com/settings/keys | pro Nutzung, getrennt vom Claude-Abo |
| ChatGPT | https://platform.openai.com/api-keys | pro Nutzung, getrennt von ChatGPT Plus |

Der Schlüssel bleibt nur auf dem eigenen Gerät. Nur Gemini kann YouTube-Videos und Webseiten selbst lesen; bei Claude und ChatGPT helfen Screenshots oder eingefügter Text.

**Verbrauch und Wochenlimit:** In den Einstellungen lässt sich ein Wochenlimit in € setzen. Dann zeigt ein schmaler Balken oben, wie viel davon schon verbraucht ist. Die Beträge sind Schätzungen aus den Token-Zahlen, die die KI bei jeder Antwort mitschickt.

## Daten

Alles liegt lokal im Browser (IndexedDB). Unter Einstellungen → **Sicherung herunterladen / einspielen** lassen sich die Daten sichern oder auf ein anderes Gerät bringen. API-Schlüssel werden nie mit gesichert.

## Aufbau

```
index.html            Grundgerüst
css/app.css           Design (Sand/Koralle/Petrol, hell + dunkel)
js/app.js             Oberfläche und Logik (Plan, Ideen, Rezepte, Vorrat, Einkauf, Einstellungen)
js/store.js           Speicher (IndexedDB), Sicherung
js/ai.js              KI-Anbindung (Gemini, Claude, ChatGPT), Verbrauch und Budget
sw.js                 Offline-Cache (bei Änderungen VERSION hochzählen)
manifest.webmanifest  App-Name und Symbole für die Installation
```

Kein Build-Schritt: Dateien ändern, hochladen, fertig.

## Nächste Schritte (geplant)

- Synchronisierung zwischen Geräten und gemeinsamer Haushalt (Partner:in / WG) mit eigenen Fächern
- Push-Benachrichtigungen („heute Abend fehlt noch …“)
- Titelbilder von Rezept-Webseiten automatisch laden
