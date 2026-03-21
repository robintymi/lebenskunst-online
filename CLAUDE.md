# Lebenskunst Online - Coding Rules

## Projekt

- **Zweck**: Plattform fuer lebenskunstonline.de - Unified Shop, Podcast, Mitgliederbereich
- **Betreiberin**: Susanne (nicht-technisch, nutzt nur Payload CMS Admin UI)
- **Stack**: Next.js 15 + Payload CMS 3 + MongoDB + Stripe
- **Sprache**: Deutsche UI, englischer Code (Variablen, Kommentare)
- **Repo**: https://github.com/robintymi/lebenskunst-online

## Architektur

- `src/app/(frontend)/` = Oeffentliche Website (Shop, Podcast, Mitglieder, Checkout)
- `src/app/(payload)/` = CMS Admin (auto-generiert von Payload, NICHT manuell aendern)
- `src/collections/` = Payload Collections (Datenmodelle)
- `src/components/` = Wiederverwendbare React-Komponenten
- `src/lib/` = Utilities, Context, Helpers
- `src/styles/` = Globale CSS-Styles
- Route Group `(frontend)` hat eigenes Layout mit Header/Footer
- Route Group `(payload)` hat Payload-eigenes Admin-Layout

## Tech-Regeln

### Next.js & React
- Next.js 15 mit App Router (NICHT Pages Router)
- React 19 - Server Components als Default, `'use client'` nur wenn noetig
- Immer `Link` aus `next/link` fuer Navigation, nie `<a>` Tags
- Immer `Image` aus `next/image` fuer Bilder wenn moeglich
- API Routes in `src/app/(frontend)/api/` — verwende Route Handlers (`route.ts`)
- Keine `use` Hook Workarounds — saubere async/await in Server Components

### Payload CMS 3
- Collections definieren in `src/collections/` mit TypeScript
- Access Control immer explizit setzen (read, create, update, delete)
- Hooks nutzen fuer Business-Logik (afterChange, beforeValidate etc.)
- Payload REST API wird automatisch unter `/api/[...slug]` bereitgestellt
- Auth-Endpunkte (`/api/users/login`, `/api/users/logout`, `/api/users/me`) kommen von Payload
- NIEMALS Payload-generierte Dateien in `(payload)/` manuell editieren ohne Grund
- `payload.config.ts` ist die zentrale Konfiguration — Aenderungen hier sind kritisch

### Stripe
- API Version muss zum installierten `stripe` npm-Paket passen
- Webhooks MUESSEN Signatur verifizieren (`stripe.webhooks.constructEvent`)
- Checkout Sessions fuer Einmalzahlungen, Subscriptions fuer Ratenzahlung
- Betraege immer in Cent (Math.round(preis * 100))
- Zahlungsmethoden: `card` + `sepa_debit`
- Webhook-Secret als Env-Variable, nie hardcoden

### Styling
- CSS Modules (`.module.css`) fuer Komponenten-Styles
- Globale Styles nur in `src/styles/globals.css`
- Design-System basiert auf CSS Custom Properties in `:root`
- Farbpalette: Rose/Pink (#BE465A primary, #D4707A secondary, #8B3A47 text, #FFF5F5 bg)
- Fonts: Cormorant Garamond (Headings), Quicksand (Body)
- KEINE Tailwind, KEIN styled-components — nur CSS Modules + globale Klassen
- Responsive Breakpoint: 768px (mobile)
- Buttons: `border-radius: 999px` (Pill-Shape), Gradient-Backgrounds
- Animations: Sparsam einsetzen (float, pulse-soft, fade-in-up)

### TypeScript
- Strict Mode — keine `any` Types ausser bei Payload Query Results wo unvermeidbar
- Interfaces fuer alle Props und Datenstrukturen
- Payload-generierte Types nutzen (`payload generate:types`)
- Keine `@ts-ignore` oder `@ts-nocheck`

## Konventionen

### Dateibenennung
- React-Komponenten: PascalCase (`Header.tsx`, `ShopFilters.tsx`)
- CSS Modules: PascalCase passend zur Komponente (`Header.module.css`)
- Pages/Routes: kebab-case Ordner (`shop/`, `mitglieder/`)
- Utilities: camelCase (`cart-context.tsx`, `utils.ts`)
- Collections: PascalCase (`ShopItems.ts`, `Orders.ts`)

### Code-Stil
- Funktionale Komponenten, keine Klassen
- Named Exports fuer Komponenten, Default Export fuer Pages
- Destructuring fuer Props
- Fruehe Returns fuer Error Cases
- Keine verschachtelten Ternaries — if/else oder fruehe Returns
- Deutsche Strings in der UI, englische Variablennamen

### Git
- Commit Messages auf Englisch
- Format: `<type>: <description>` (fix, feat, refactor, style, docs, chore)
- Immer auf `master` Branch (kein develop/feature-Branch-Workflow noetig)

## Deployment

### Aktuell: Docker auf VPS
- `Dockerfile` = Multi-stage Build (Node Alpine)
- `docker-compose.yml` = App + MongoDB + Nginx + Certbot
- `nginx.conf` = Reverse Proxy mit SSL
- Output: `standalone` in `next.config.ts`
- Deploy via `deploy.sh` (git pull + docker rebuild)

### Umgebungsvariablen (NIEMALS committen!)
- `MONGODB_URI` — MongoDB Connection String
- `PAYLOAD_SECRET` — Muss sicher generiert sein (min. 32 Zeichen)
- `STRIPE_SECRET_KEY` — Stripe Secret Key (sk_live_...)
- `STRIPE_WEBHOOK_SECRET` — Stripe Webhook Signing Secret (whsec_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe Public Key (pk_live_...)
- `NEXT_PUBLIC_SERVER_URL` — Produktions-URL (https://lebenskunstonline.de)
- `RESEND_API_KEY` — E-Mail Service API Key (wenn implementiert)

## Wichtige Hinweise

- Susanne ist nicht-technisch: Alles muss ueber Payload Admin UI verwaltbar sein
- Shop ist UNIFIED: Ein Shop fuer alle Item-Typen, keine separaten Shops
- Bundles sind Themenbundles mit Rabatt, enthalten mehrere ShopItems
- Ratenzahlung = Stripe Subscription (monatliche Abbuchung, begrenzte Laufzeit)
- Events haben maxParticipants — Kapazitaet muss geprueft werden
- Trainings haben durationWeeks — Zugang ist zeitlich begrenzt
- Deutsche Datenschutz/Impressum-Seiten sind rechtlich Pflicht (DSGVO)
- Media-Uploads: Payload speichert lokal unter `/media` — Volume in Docker mounten

## Known Issues / TODOs

- [ ] Stripe Webhook Handler implementieren (`/api/webhooks/stripe`)
- [ ] Order-Fulfillment nach Zahlung (Order erstellen, User updaten)
- [ ] E-Mail-Service integrieren (Resend empfohlen)
- [ ] Auth-Flow testen (Payload REST API fuer Login/Register)
- [ ] SEO (sitemap.xml, robots.txt, Open Graph)
- [ ] Error Pages (404, 500)
- [ ] Event-Kapazitaet enforcing
- [ ] Ratenzahlung komplett (paidInstallments tracken)
- [ ] Rate Limiting auf Checkout API
- [ ] MongoDB Backup-Strategie
- [ ] Impressum & Datenschutz Seiten
