# TO-DO – Lebenskunst Online

---

## 🔴 Blocker – Seite darf NICHT live gehen ohne das

- [ ] **Kleinunternehmerregelung (§ 19 UStG) klären** – Antwort von Susanne holen
  - Wenn JA (Kleinunternehmerin): Serverumgebungsvariable **nicht setzen** → Rechnung zeigt automatisch "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet"
  - Wenn NEIN (umsatzsteuerpflichtig): `INVOICE_SHOW_VAT=true` in Serverumgebungsvariablen setzen → Rechnung zeigt dann 19% MwSt-Aufschlüsselung
  - Falscher MwSt-Ausweis = Steuerproblem

- [ ] **Steuernummer ins Impressum eintragen**
  - Impressum → "Steuerliche Angaben" → Steuernummer vom Finanzamt eintragen
  - Gesetzliche Pflicht nach § 5 TMG

---

## 🟡 Wichtig – vor Go-Live erledigen

### 💳 Stripe
- [x] Stripe-Keys bereits eingetragen
- [ ] Nach Deployment: **Stripe Webhook registrieren**
  - stripe.com → Developers → Webhooks → "Add endpoint"
  - URL: `https://lebenskunstonline.de/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`
  - `STRIPE_WEBHOOK_SECRET=whsec_...` in Serverumgebungsvariablen eintragen

### 📧 Resend – Domain verifizieren (sonst landen Mails im Spam)
- [ ] resend.com → **Domains** → "Add Domain" → `lebenskunstonline.de` eintragen
- [ ] DNS-Einträge bei Hostinger setzen
- [ ] Danach `FROM_EMAIL=buchung@lebenskunstonline.de` in Serverumgebungsvariablen setzen

### 🚀 Deployment – Hostinger KVM 1
- [ ] Hostinger KVM 1 kaufen + Ubuntu auswählen
- [ ] Server einrichten (Claude Code hilft Schritt für Schritt)
- [ ] Domain `lebenskunstonline.de` auf Server zeigen lassen
- [ ] `.env.example` als `.env` kopieren + alle Werte ausfüllen (siehe `.env.example`)
- [ ] SSL-Zertifikat via Certbot einrichten (automatisch in setup-server.sh)
- [ ] MongoDB-Backup einrichten: `chmod +x scripts/backup.sh` → Cron eintragen (täglich 3 Uhr)
- [ ] Nach erstem erfolgreichen Monat: manuell `DELETE /api/admin/cleanup-orders` aufrufen (räumt abgebrochene Bestellungen auf)

---

## 🖼️ Inhalte & Medien
- [x] Einige Produktbilder bereits hochgeladen
- [ ] Restliche Produktbilder in `/public/images/` hochladen
- [ ] Logo (`logo.png`) in `/public/images/` prüfen/hochladen
- [ ] Susanne-Foto (`susanne.jpg`) in `/public/images/` prüfen/hochladen
- [ ] Impressum: Adresse nochmal prüfen – ist sie korrekt? (Schweriner Straße 44, 15757 Halbe)

---

## ✅ Erledigt (Übersicht was alles gebaut wurde)

### Kritische Bugs
- [x] Falsche Stripe API-Version → alle Zahlungen hätten fehlgeschlagen
- [x] Falscher Raten-Webhook-Pfad → Rate 2+ wäre nie abgebucht worden
- [x] Bundle-Käufe ohne Zugangsvergabe → Käufer hätten keinen Zugang bekommen
- [x] Seed-Endpoint offen in Produktion → Sicherheitslücke
- [x] Passwort-Änderung ohne Verifikation des alten Passworts
- [x] Content-Ordner fehlte im Dockerfile → Datei-Uploads hätten fehlgeschlagen
- [x] `payment_failed` Status fehlte in Orders-Collection → Webhook hätte bei 2. Zahlungsfehler gecrasht
- [x] Rabattcode-UI fehlte komplett (Endpoint war gebaut aber nie verwendbar)
- [x] `usedCount` bei Rabattcodes wurde nie erhöht → Codes wären unbegrenzt nutzbar gewesen
- [x] Bundle-Namen zeigten "Artikel" statt echtem Bundle-Namen in Bestellungen
- [x] Rechnung zeigte immer 19% MwSt ohne Rücksicht auf Kleinunternehmerregelung
- [x] Webhook-Idempotenz: gleicher Webhook doppelt → Event-Teilnehmer wäre 2x hochgezählt worden
- [x] Inhalte-Seite: "Ansehen"-Link zeigte JSON statt Datei (Link → a-Tag + ?serve=1 Parameter)
- [x] Content-Route: Unterstützt jetzt X-Accel-Redirect (Nginx, sicher) + Redirect-Fallback
- [x] FROM_EMAIL war hardcoded – jetzt per Env-Variable konfigurierbar
- [x] DSGVO Art. 17: Kunden können ihr Konto selbst löschen (mit Passwort-Bestätigung)
- [x] .env.example vollständig (alle Variablen dokumentiert inkl. INVOICE_SHOW_VAT, FROM_EMAIL)
- [x] MongoDB Backup-Skript (scripts/backup.sh) mit 14-Tage-Rotation
- [x] Abgebrochene Bestellungen Cleanup-Route (DELETE /api/admin/cleanup-orders)
- [x] Health-Check Route (/api/health) für Docker/Monitoring

### Neue Features
- [x] Rechnungsgenerierung (druckbares HTML, MwSt-Aufschlüsselung, downloadbar)
- [x] Rabattcodes (Prozent/Festbetrag, Verfallsdatum, Max-Nutzungen)
- [x] Versandstatus für physische Produkte (Sendungsnummer, Versanddatum)
- [x] CSV-Export aller Bestellungen mit Datumsfilter (für Steuerberater)
- [x] Admin-Dashboard mit Live-Statistiken (Einnahmen, Events, Zahlungsfehler)
- [x] Event-Absage mit automatischer Mail an alle Buchenden
- [x] Manuelle Zugangsverwaltung im Admin (User-Zugang geben/entziehen)
- [x] Kundenkontakt direkt aus dem Admin
- [x] Passwort-vergessen Flow
- [x] Warenkorb-Persistenz (bleibt nach Browser-Schließen erhalten)
- [x] Shop-Suche mit Suchfeld
- [x] "Bereits gekauft" Badge im Shop
- [x] Ausgebucht-Overlay auf vollen Events
- [x] Direkter Link zu Inhalten nach Zahlung
- [x] Ratenzahlung-Berechnung bei mehreren Artikeln korrigiert
- [x] Zahlungsfehler-Mail an Kunden bei gescheiterter Rate
- [x] "X von Y Raten bezahlt" Anzeige in Bestellungen

### Rechtliches
- [x] Impressum (§ 5 TMG)
- [x] Datenschutzerklärung (Hostinger, MongoDB, Stripe, Resend eingetragen)
- [x] AGB (Widerrufsrecht für digital/Events/physisch)
- [x] Widerrufsrecht-Pflichtcheckbox im Checkout (gesetzlich vorgeschrieben)
- [x] Alle Seiten im Footer verlinkt

### Technisches
- [x] 404 und 500-Fehlerseiten mit Lebenskunst-Design
- [x] Sitemap.xml + robots.txt für SEO
- [x] Bessere Fehlermeldungen statt stiller Fehler im Dashboard
- [x] Passwort-Änderung prüft jetzt altes Passwort
- [x] Reviews erfordern jetzt manuelle Freigabe durch Susanne
- [x] Seed-Endpoint in Produktion gesperrt
- [x] MongoDB ohne Auth-Problem in docker-compose dokumentiert
