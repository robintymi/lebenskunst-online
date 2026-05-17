# Lebenskunst Online – Anleitung für die Betreiberin (Admin)

Stand: Mai 2026

## 1) Zugänge (Übersicht)

### Website
- Öffentliche Website: `https://lebenskunstonline.de`

### Admin (Payload CMS)
- Admin-Login: `https://lebenskunstonline.de/admin`
- Anmeldung: E-Mail + Passwort (im Passwort-Manager)
- Rollen:
  - `admin`: darf Inhalte, Einstellungen, Bestellungen, Media verwalten
  - `member`: Kundenkonto (Mitgliederbereich), keine Admin-Rechte

**Erst-Einrichtung (nur wenn noch kein Admin existiert):**
- Beim ersten Aufruf erscheint `.../admin/create-first-user`. Nur E-Mail + Passwort eingeben — der erste User wird automatisch als Admin angelegt.

### Technische Zugänge (für Betreuung/Agentur)
- GitHub-Repository: `robintymi/lebenskunst-online`
- Server/VPS, MongoDB, Stripe, E-Mail (Resend): Zugangsdaten liegen **nicht** im Repo und sollten getrennt (Passwort-Manager) gepflegt werden.

---

## 2) Dashboard (Übersicht)

Menüpunkt: **Übersicht** (Startseite des Admin-Panels)

- **Kennzahlen**: Einnahmen heute/Monat, Bestellungen gesamt/ausstehend, neue Mitglieder, nächste Events
- **CSV-Export**: Bestellungen als CSV herunterladen (optional Zeitraum „Von/Bis" angeben)
- **Startseite-Shortcut**: Direktlink zu den Seiteneinstellungen

---

## 3) Seiteneinstellungen

Menüpunkt: **Verwaltung → Seiteneinstellungen**

Hier steuerst du:
- **Startseiten-Bild** (Portrait im Kreis)
- **Überschrift** und **Untertitel**
- **Zitat**
- **Kundenstimmen** (Name, Text, Sterne 1–5, Kontext)

### Startseiten-Bild ändern
1. Admin öffnen → Dashboard → **„Seiteneinstellungen öffnen"**
2. Im Feld **„Startseiten-Bild"**: Bild auswählen oder neu hochladen
3. Bildbeschreibung (Alt-Text) eintragen
4. **Speichern** → Website in neuem Tab prüfen

> **Tipp:** Quadratische oder hochformatige Portraits (Bild wird als Kreis angezeigt)

---

## 4) Shop-Items anlegen & bearbeiten

Menüpunkt: **Shop → Shop-Items → „Neu erstellen"**

| Feld | Bedeutung |
|------|-----------|
| **Titel** | Name des Angebots |
| **Slug** | URL-Kürzel — **wird automatisch aus dem Titel generiert** |
| **Typ** | Seminar, Workshop, Vortrag, Einzeltraining, Video, Audio, Begleitmaterial, Buch, Kunstwerk |
| **Beschreibung** | Ausführlicher Text (Rich-Text) |
| **Kurzbeschreibung** | 1–2 Sätze für die Shop-Übersicht |
| **Preis** | In Euro |
| **Kategorien** | Thematische Zuordnung |
| **Bild / Galerie** | Haupt- und Galeriebilder |
| **Status** | Entwurf / Veröffentlicht / Ausverkauft / Abgesagt |
| **Featured** | Hervorgehobene Items erscheinen prominent |

> **Slug:** Einfach Titel eingeben und speichern — Slug wird automatisch erzeugt. Beispiel: „Breathwork Workshop März" → `breathwork-workshop-maerz`

### Veranstaltungs-Felder (Seminar, Workshop, Vortrag)
- Datum & Uhrzeit, Ort (Name + Adresse) oder Online-Veranstaltung
- Max. Teilnehmer (Kapazität), Stornierungsfrist

### Ratenzahlung aktivieren
Im Bereich **Preisgestaltung**: „Ratenzahlung aktivieren" → Anzahl Raten + Ratenbetrag eingeben.

---

## 5) Media (Bilder)

Menüpunkt: **Verwaltung → Media**

- Alle hochgeladenen Bilder (inkl. 32 vorinstallierter Kunst-Fotos)
- **Hochladen**: „Neu erstellen" → Bild per Drag & Drop hochladen
- **Alt-Text**: Pflichtfeld — kurze Beschreibung für SEO und Barrierefreiheit
- Payload erstellt automatisch 3 Größen: Thumbnail (300×300), Card (600×400), Hero (1200×600)

---

## 6) Bundles (Themenpakete)

Menüpunkt: **Shop → Bundles → „Neu erstellen"**

- **Name**, **enthaltene Items**, **Bundle-Preis**, **Ersparnis-Text**
- Bundles bündeln mehrere Items zu einem vergünstigten Preis

---

## 7) Bestellungen

Menüpunkt: **Shop → Bestellungen**

- Status: Bezahlt, Ausstehend, Ratenzahlung aktiv, Storniert, Erstattet
- CSV-Export für Buchhaltung (auch im Dashboard verfügbar)
- **Widerruf-Anfragen**: Wenn ein Kunde den Widerruf eingelegt hat → Status wird „Storniert" → Erstattung manuell im **Stripe-Dashboard** veranlassen

---

## 8) Widerrufsrecht (gesetzlich vorgeschrieben, ab Mai 2026)

### Wie Kunden den Widerruf einlegen
1. Mitgliederbereich → **„Meine Bestellungen"**
2. Bestellung innerhalb von 14 Tagen → Button **„Widerruf einlegen"**
3. Formular ausfüllen → Bestätigung per E-Mail an Kund:in und an dich

### Was du als Betreiberin tust
- Du erhältst automatisch eine E-Mail mit Widerruf-Details
- Erstatte den Betrag im **Stripe-Dashboard**
- Ändere den Bestellstatus im Admin auf „Erstattet"

Widerrufsseite für Kunden: `https://lebenskunstonline.de/widerruf`

---

## 9) Nutzer & Mitglieder

Menüpunkt: **Verwaltung → Users**

- Alle Admin- und Mitgliederkonten verwalten
- Mitglieder-Details: Vorname, Nachname, Telefon, gekaufte Items, Trainings-Zugang
- Rolle Admin ↔ Mitglied ändern (nur als Admin sichtbar)

---

## 10) Kategorien & Rabatte

**Kategorien** (Shop → Kategorien): Thematische Filter für den Shop (Name + Slug)

**Rabatte** (Shop → Rabatte): Discount-Codes mit Prozent- oder Festbetrag, Gültigkeitszeitraum, Einzel- oder Mehrfachverwendung

---

## 11) Suche & Empfehlungen (automatisch)

Laufen vollautomatisch — keine Konfiguration nötig:

- **Suchleiste im Header** (Lupe-Symbol): Besucher können nach Angeboten suchen. Zuletzt gesuchte Begriffe erscheinen als Vorschläge.
- **Personalisierte Empfehlungen** auf Shop- und Produktseiten: „Passend für dich" / „Das könnte dich auch interessieren" — passt sich automatisch an das Surfverhalten der Besucherin an.

---

## 12) Rechtliche Pflichtseiten

| Seite | URL |
|-------|-----|
| Impressum | `/impressum` |
| Datenschutzerklärung | `/datenschutz` |
| AGB (inkl. Lieferzeiten & Versand) | `/agb` |
| Widerrufsrecht + Online-Formular | `/widerruf` |

**AGB-Lieferbedingungen:**
- Digitale Inhalte → sofortiger Zugang nach Zahlung
- Seminare/Events → Details spätestens 3 Tage vor Termin
- Kunstwerke/Physisch → 3–5 Werktage, DHL, **kostenloser Versand ab 100 €** (darunter 5,90 €)

**Cookies:** Nur technisch notwendige Session-Cookies — kein Tracking, DSGVO-konform.

---

## 13) Sicherheit & gute Praxis

- Admin-Passwort stark wählen und nur im Passwort-Manager speichern
- Nur Bilder hochladen, an denen du die Rechte hast
- Alt-Texte kurz und beschreibend (z.B. „Susanne Sturm – Portrait")
- Stripe-Schlüssel niemals weitergeben

---

## 14) Falls etwas nicht klappt

| Problem | Lösung |
|---------|--------|
| Login-Probleme | „Passwort vergessen" nutzen oder technische Betreuung kontaktieren |
| Bild wird nicht angezeigt | Strg+Shift+R (Seite neu laden), prüfen ob Bild in **Media** vorhanden |
| Änderungen erscheinen nicht | Speichern prüfen, dann Website neu laden |
| Slug leer | Titel eingeben, kurz warten — Slug erscheint beim Tippen |
| Widerruf-Button fehlt | 14-Tage-Frist abgelaufen oder Bestellung bereits storniert |
| Item nicht im Shop | Status auf „Veröffentlicht" setzen |
