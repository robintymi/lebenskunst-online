# Lebenskunst Online – Anleitung für die Betreiberin (Admin)

Stand: 20. April 2026

## 1) Zugänge (Übersicht)

### Website
- Öffentliche Website: `https://lebenskunstonline.de`

### Admin (Payload CMS)
- Admin-Login: `https://lebenskunstonline.de/admin`
- Anmeldung: E-Mail + Passwort (im Passwort-Manager der Betreiberin/Agentur)
- Rollen:
  - `admin`: darf Inhalte, Einstellungen, Bestellungen, Media verwalten
  - `member`: Kundenkonto (Mitgliederbereich), keine Admin-Rechte

**Erst-Einrichtung (nur wenn noch kein Admin existiert):**
- Standard: Beim ersten Aufruf erscheint `.../admin/create-first-user`. Dort wird der **erste User automatisch als Admin** angelegt (nur E-Mail + Passwort erforderlich).
- Optional (Technik/Agentur): Admin kann auch automatisch beim Start angelegt werden über `.env` (`BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`).

### Technische Zugänge (für Betreuung/Agentur)
- GitHub-Repository: `robintymi/lebenskunst-online`
- Server/VPS, MongoDB, Stripe, E-Mail (Resend): Zugangsdaten liegen **nicht** im Repo und sollten getrennt (Passwort-Manager) gepflegt werden.

## 2) Wichtigste Funktionen im Admin

### Dashboard („Übersicht“)
- Kennzahlen: Einnahmen, Bestellungen, neue Mitglieder, Events
- CSV-Export: Bestellungen als CSV herunterladen (optional Zeitraum „Von/Bis“)
- Startseite: Shortcut zu den Seiteneinstellungen (inkl. Startseiten-Bild)

### Seiteneinstellungen (Startseite & allgemeine Inhalte)
Menüpunkt: **Verwaltung → Seiteneinstellungen**

Hier steuerst du u.a.:
- **Startseiten-Bild** (Portrait im Kreis auf der Startseite)
- **Überschrift** und **Untertitel**
- **Zitat**
- **Kundenstimmen** (Name, Text, Sterne, Kontext)

### Seitentexte (alle öffentlichen Website-Texte)
Menüpunkt: **Verwaltung → Seitentexte**

Hier kannst du (als Admin) zentrale Texte der öffentlichen Website ändern, ohne Code anzufassen, z.B.:
- **Header**: Navigation, Beschriftungen, Suche-Placeholder/Labels
- **Footer**: Spaltentitel/Links, Tagline/Beschreibung, Copyright-Text
- **Cookie-Banner**: Text + Button
- **Startseite**: Hero-Kicker + Buttons, Trust-Bar, Intro-Texte, Feature-Kacheln, CTA
- **Leistungen**: Hero-Text + die drei Räume inkl. Texte/Listen/Beispiele
- **Rechtliches**: Impressum/Datenschutz/AGB/Widerruf (RichText-Inhalte)

Hinweis: Bei den Rechtstexten gilt: **Wenn das RichText-Feld leer bleibt**, wird die im Code hinterlegte Standard-Version angezeigt.

### Inhalte / Shop
Je nach Menüpunkt kannst du verwalten:
- **Shop-Items**: einzelne Angebote/Produkte (Preis, Beschreibung, Bilder, Kategorie, „featured“)
- **Bundles**: Pakete/Bundle-Angebote mit Rabatt
- **Podcasts**: Podcast-Episoden (Titel, Beschreibung, Medien/Dateien)
- **Kategorien**: Shop-Kategorien
- **Rabatte**: Discount-Codes/Regeln
- **Reviews**: (falls genutzt) Bewertungen im System

### Bestellungen & Nutzer
- **Orders**: Bestellungen einsehen, Status prüfen, Export möglich
- **Users**: Admin- und Mitgliederkonten verwalten

### Media (Bilder/Uploads)
- **Media** ist der zentrale Ort für Bilder-Uploads.
- Jedes Bild braucht eine **Bildbeschreibung (Alt-Text)** (wichtig für Barrierefreiheit/SEO).

## 3) Startseiten-Bild ändern (Schritt für Schritt)

1. Öffne `https://lebenskunstonline.de/admin` und melde dich an.
2. Gehe ins Dashboard „Übersicht“.
3. Im Kasten **Startseite** klicke auf **„Seiteneinstellungen öffnen“**.
4. Im Feld **„Startseiten-Bild“**:
   - Bild auswählen/hochladen (ggf. wird automatisch ein Eintrag in **Media** erstellt).
   - Achte darauf, dass eine **Bildbeschreibung (Alt-Text)** vorhanden ist.
5. **Speichern**.
6. Prüfe die Startseite in einem neuen Tab: `https://lebenskunstonline.de`

Tipp: Gute Ergebnisse liefern quadratische oder leicht hochformatige Portraits (das Bild wird als Kreis angezeigt).

## 4) Sicherheit & gute Praxis

- Admin-Passwort: stark wählen und nur im Passwort-Manager speichern.
- Nur Bilder hochladen, an denen du die Rechte hast.
- Alt-Texte kurz und beschreibend halten (z.B. „Susanne Sturm – Portrait“).

## 5) Falls etwas nicht klappt

- Login-Probleme: „Passwort vergessen“ nutzen (falls aktiv) oder die technische Betreuung kontaktieren.
- Bild wird nicht angezeigt: Seite hart neu laden (Cache) und prüfen, ob das Bild in **Media** vorhanden ist.
- Änderungen erscheinen nicht: Speichern prüfen und danach die Website neu laden.
