import type { Metadata } from 'next'
import styles from '../impressum/impressum.module.css'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung gemäß DSGVO',
}

export default function DatenschutzPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Datenschutzerklärung</h1>
        <p className={styles.subtitle}>Stand: März 2026</p>

        <section className={styles.section}>
          <h2>1. Verantwortlicher</h2>
          <p>
            Susanne Sturm<br />
            Schweriner Straße 44<br />
            15757 Halbe<br />
            Telefon: 0176 20 555 116<br />
            E-Mail: joseline148@aol.com
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Hosting & Infrastruktur</h2>
          <p>
            Diese Website wird auf einem virtuellen privaten Server (VPS) von Hostinger
            (UAB Hostinger, Švitrigailos g. 34, Vilnius 03230, Litauen) betrieben.
            Hostinger ist ein EU-Anbieter; die Server befinden sich innerhalb der EU.
            Es wird kein Website-Baukasten von Drittanbietern verwendet.
          </p>
          <p>
            Weitere Informationen:{' '}
            <a href="https://www.hostinger.de/datenschutz" target="_blank" rel="noopener noreferrer">
              hostinger.de/datenschutz
            </a>
          </p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>
        </section>

        <section className={styles.section}>
          <h2>3. Erhobene Daten & Zwecke</h2>
          <p><strong>Beim Besuch der Website:</strong><br />
            IP-Adresse, Browsertyp, Betriebssystem, Datum/Uhrzeit des Zugriffs. Diese Daten
            werden ausschließlich für den sicheren Betrieb der Website verwendet und nicht
            an Dritte weitergegeben.</p>
          <p><strong>Bei Registrierung & Kauf:</strong><br />
            Name, E-Mail-Adresse, Lieferadresse (bei physischen Produkten), Bestelldetails.
            Diese Daten sind zur Vertragserfüllung erforderlich.</p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
        </section>

        <section className={styles.section}>
          <h2>4. Zahlungsabwicklung – Stripe</h2>
          <p>
            Zahlungen werden über Stripe Payments Europe Ltd., C/O A&amp;L Goodbody,
            25-28 North Wall Quay, Dublin 1, Irland abgewickelt. Stripe verarbeitet
            Zahlungsdaten nach PCI-DSS-Standard. Wir erhalten keine vollständigen
            Zahlungsdaten (z. B. Kreditkartennummern).
          </p>
          <p>
            Datenschutzerklärung Stripe:{' '}
            <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">
              stripe.com/de/privacy
            </a>
          </p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO</p>
        </section>

        <section className={styles.section}>
          <h2>5. E-Mail-Versand – Resend</h2>
          <p>
            Für den transaktionalen E-Mail-Versand (Bestellbestätigungen, Passwort-Reset)
            nutzen wir Resend Inc., 185 Berry St, Suite 550, San Francisco, CA 94107, USA.
            Die Datenübermittlung in die USA erfolgt auf Basis von Standardvertragsklauseln
            der EU-Kommission.
          </p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO</p>
        </section>

        <section className={styles.section}>
          <h2>6. Datenbankdienst – MongoDB</h2>
          <p>
            Zur Speicherung von Nutzer- und Bestelldaten verwenden wir MongoDB als
            Datenbankdienst. Die Datenbank wird auf dem Hostinger-Server (siehe Abschnitt 2)
            betrieben und verarbeitet keine Daten außerhalb dieses Servers. Es findet keine
            Übermittlung an MongoDB Inc. oder Dritte statt, da wir die Open-Source-Software
            selbst betreiben.
          </p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO</p>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies</h2>
          <p>
            Diese Website verwendet ausschließlich technisch notwendige Cookies
            (Session-Cookie für den Login, Warenkorb-Cookie). Es werden keine
            Tracking- oder Analyse-Cookies eingesetzt. Eine Einwilligung ist für
            technisch notwendige Cookies nicht erforderlich.
          </p>
          <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO</p>
        </section>

        <section className={styles.section}>
          <h2>8. Datenspeicherung & Löschung</h2>
          <p>
            Personenbezogene Daten werden nur so lange gespeichert, wie es für die
            jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen
            bestehen. Bestelldaten werden gemäß steuerrechtlicher Vorgaben 10 Jahre
            aufbewahrt.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Ihre Rechte</h2>
          <p>Sie haben das Recht auf:</p>
          <p>
            Auskunft (Art. 15 DSGVO) · Berichtigung (Art. 16 DSGVO) · Löschung (Art. 17 DSGVO) ·
            Einschränkung (Art. 18 DSGVO) · Widerspruch (Art. 21 DSGVO) ·
            Datenübertragbarkeit (Art. 20 DSGVO) · Beschwerde bei der zuständigen
            Datenschutzbehörde (Art. 77 DSGVO)
          </p>
          <p>
            Für Anfragen wenden Sie sich an: joseline148@aol.com
          </p>
          <p style={{ marginTop: '12px' }}>
            Um Ihre Rechte auszuüben (z.B. Datenlöschung, Auskunft), senden Sie bitte eine
            E-Mail an <a href="mailto:joseline148@aol.com">joseline148@aol.com</a>.
            Wir bearbeiten Anfragen innerhalb von 30 Tagen.
          </p>
        </section>
      </div>
    </main>
  )
}
