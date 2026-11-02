# Push-Erinnerungen einrichten (einmalig, ca. 10 Minuten, kostenlos)

Die Essens-App erinnert dich am Vorabend und am Tag selbst, wenn für ein geplantes Abendessen noch etwas fehlt. Dafür braucht sie einen kleinen Server, der zur richtigen Uhrzeit beim Handy „anklopft“. Den richtest du kostenlos bei **Cloudflare** ein.

Der Server kennt nur Uhrzeiten, keine Rezepte und keine Einkaufslisten. Die Texte bleiben auf deinem Handy.

## 1. Cloudflare-Konto

1. Auf **dash.cloudflare.com** kostenlos registrieren (E-Mail bestätigen).

## 2. Worker anlegen

1. Links **Workers & Pages** (bzw. „Compute“ → „Workers & Pages“) → **Create** → **Create Worker** („Hello World“-Vorlage).
2. Name: `essensapp-push` → **Deploy**.
3. **Edit code** öffnen, den gesamten Inhalt löschen und den Inhalt von [`worker.js`](worker.js) aus diesem Ordner einfügen → **Deploy**.

## 3. Speicher (KV) verbinden

1. Links **Storage & Databases → KV** → **Create** → Name `essensapp-push` → anlegen.
2. Zurück zum Worker `essensapp-push` → **Settings → Bindings** → **Add** → **KV namespace**.
3. **Variable name: `KV`** (genau so, Großbuchstaben) → Namespace `essensapp-push` auswählen → speichern / deployen.

## 4. Zeitplan (Cron) einstellen

1. Im Worker → **Settings → Trigger Events** (bzw. „Triggers“) → **Add** → **Cron Triggers**.
2. „Alle 15 Minuten“ wählen oder als Ausdruck `*/15 * * * *` eintragen → speichern.

## 5. In der App eintragen

1. Oben im Worker steht seine Adresse, z. B. `https://essensapp-push.DEINNAME.workers.dev`. Kopieren.
2. In der Essens-App: **Zahnrad → Erinnerungen** → Adresse einfügen → Uhrzeiten wählen → **Erinnerungen aktivieren** → Benachrichtigungen erlauben.
3. **Testnachricht** antippen. Nach ein paar Sekunden sollte sie ankommen.

## Gut zu wissen

- **iPhone:** Push geht nur, wenn die App über Safari → Teilen → „Zum Home-Bildschirm“ installiert ist (iOS 16.4 oder neuer), und man sie von dort öffnet.
- **Android:** Am zuverlässigsten, wenn die App über Chrome installiert ist.
- Der Server prüft alle 15 Minuten. Eine Erinnerung für 18:00 kommt also zwischen 18:00 und 18:15.
- Kosten: Das kostenlose Cloudflare-Kontingent reicht für eine private App bei Weitem.
