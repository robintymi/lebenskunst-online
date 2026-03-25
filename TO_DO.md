# TO-DO

## ❓ Offene Fragen – Antwort von Susanne holen

- [ ] **Kleinunternehmerregelung (§ 19 UStG):** Ist Susanne Kleinunternehmerin?
  - Wenn JA (Jahresumsatz unter ~22.000 €): Rechnungen dürfen **keine MwSt** ausweisen → Rechnungsvorlage muss angepasst werden
  - Wenn NEIN (umsatzsteuerpflichtig): aktuelle Rechnung mit 19% MwSt ist korrekt
  - **Ohne diese Info darf die Seite nicht live gehen** – falscher MwSt-Ausweis ist ein rechtliches Problem

## 💳 Stripe – noch ausstehend

- [ ] Stripe-Konto erstellen → [stripe.com](https://stripe.com)
- [ ] API-Keys in Serverumgebungsvariablen eintragen:
  - `STRIPE_SECRET_KEY=sk_live_...`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- [ ] Nach Deployment: Stripe Webhook registrieren
  - stripe.com → Developers → Webhooks → "Add endpoint"
  - URL: `https://lebenskunstonline.de/api/webhooks/stripe`
  - Event: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`
  - `STRIPE_WEBHOOK_SECRET=whsec_...` in Serverumgebungsvariablen eintragen

## 📧 Resend – Domain verifizieren

- [ ] resend.com → **Domains** → "Add Domain" → `lebenskunstonline.de` eintragen
- [ ] DNS-Einträge beim Hoster (Hostinger) setzen
- [ ] Danach `FROM_EMAIL=buchung@lebenskunstonline.de` in den Serverumgebungsvariablen setzen

## 🚀 Deployment – Hostinger KVM 1

- [ ] Hostinger KVM 1 kaufen + Ubuntu auswählen
- [ ] Server einrichten (Claude Code hilft Schritt für Schritt)
- [ ] Domain auf Server zeigen lassen
- [ ] Alle Umgebungsvariablen auf Server eintragen
- [ ] SSL-Zertifikat via Certbot einrichten

## 🖼️ Inhalte

- [ ] Produktbilder in `/public/images/` hochladen
- [ ] Logo (`logo.png`) und Susanne-Bild (`susanne.jpg`) in `/public/images/` hochladen
- [ ] Impressum: Susannes vollständige Adresse prüfen (ist sie korrekt?)
