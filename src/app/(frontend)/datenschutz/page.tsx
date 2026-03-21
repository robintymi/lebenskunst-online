import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz',
}

export default function DatenschutzPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1>Datenschutzerklärung</h1>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>1. Verantwortlicher</h2>
        <p style={{ marginBottom: '1rem' }}>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Susanne Sturm
          <br />
          Schweriner Straße 44
          <br />
          15757 Halbe
          <br />
          Deutschland
          <br />
          Telefon: 0176 20 555 116
          <br />
          E-Mail: lebenskunst777@aol.com
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          2. Allgemeine Hinweise zur Datenverarbeitung
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen.
          Personenbezogene Daten werden auf dieser Website gemäß der
          Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG)
          verarbeitet.
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>3. Hosting</h2>
        <p style={{ marginBottom: '1rem' }}>
          Diese Website wird auf einem Virtual Private Server (VPS) bei Hostinger
          International Ltd. gehostet. Die Datenverarbeitung erfolgt auf Servern in der
          Europäischen Union. Die Website basiert auf Next.js und Payload CMS, die Datenbank
          (MongoDB) läuft auf demselben Server. Die Verbindung zur Website ist
          SSL/TLS-verschlüsselt.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
          sicheren und effizienten Betrieb der Website).
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          4. Erhebung und Nutzung personenbezogener Daten
        </h2>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>a) Besuch der Website</h3>
        <p style={{ marginBottom: '1rem' }}>
          Beim Zugriff auf unsere Website werden automatisch folgende Daten erfasst:
        </p>
        <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
          <li>IP-Adresse</li>
          <li>Gerätetyp und Browserinformationen</li>
          <li>Betriebssystem</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Verweisende URL</li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          Diese Daten dienen der technischen Bereitstellung der Website und der Erkennung von
          Angriffen.
          <br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>b) Online-Shop</h3>
        <p style={{ marginBottom: '1rem' }}>
          Bei einer Bestellung in unserem Online-Shop verarbeiten wir folgende Daten:
        </p>
        <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
          <li>Name</li>
          <li>E-Mail-Adresse</li>
          <li>Telefonnummer (optional)</li>
          <li>Liefer- und Rechnungsadresse (bei physischen Produkten)</li>
          <li>Bestelldetails</li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          Die Zahlungsabwicklung erfolgt über Stripe (siehe Punkt 6). Wir speichern keine
          Kreditkarten- oder Bankdaten auf unserem Server.
          <br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          c) Registrierung und Nutzerkonto
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Bei der Registrierung auf unserer Website erheben wir Ihren Namen, Ihre
          E-Mail-Adresse und ein von Ihnen gewähltes Passwort. Das Passwort wird verschlüsselt
          (gehasht) gespeichert. In Ihrem Nutzerkonto werden Ihre gekauften Inhalte und
          Bestellungen verwaltet.
          <br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          d) Kurse, Veranstaltungen und Trainings
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Wenn Sie über unsere Website einen Kurs, ein Seminar oder ein Training buchen,
          erheben wir Ihren Namen, Ihre E-Mail-Adresse, Buchungsdetails und ggf.
          Zahlungsinformationen.
          <br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>5. Cookies</h2>
        <p style={{ marginBottom: '1rem' }}>
          Diese Website verwendet ausschließlich technisch notwendige Cookies:
        </p>
        <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
          <li>
            <strong>Session-Cookie (payload-token):</strong> Dient der Aufrechterhaltung
            Ihrer Anmeldung im Mitgliederbereich. Wird beim Abmelden oder Schließen des
            Browsers gelöscht.
          </li>
          <li>
            <strong>Warenkorb:</strong> Der Inhalt Ihres Warenkorbs wird lokal in Ihrem
            Browser gespeichert (localStorage) und nicht an unseren Server übermittelt.
          </li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          Es werden keine Tracking-Cookies, Analyse-Cookies oder Cookies von Drittanbietern
          eingesetzt.
          <br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
          Funktionalität der Website)
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          6. Zahlungsdienstleister — Stripe
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Für die Zahlungsabwicklung nutzen wir den Dienst Stripe (Stripe Payments Europe
          Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland).
          Stripe verarbeitet Ihre Zahlungsdaten (z. B. Kreditkarten- oder SEPA-Daten) auf
          eigenen, PCI-DSS-zertifizierten Servern. Wir haben keinen Zugriff auf vollständige
          Zahlungsdaten.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Bei Ratenzahlungen werden Ihre Zahlungsdaten von Stripe für die Dauer der
          Ratenzahlung gespeichert.
          <br />
          Datenschutzerklärung:{' '}
          <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">
            https://stripe.com/de/privacy
          </a>
          <br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          7. E-Mail-Versand
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Für den Versand von Bestellbestätigungen und Systemnachrichten nutzen wir den
          E-Mail-Dienst Resend (Resend Inc., San Francisco, USA). Dabei werden Ihre
          E-Mail-Adresse und der Nachrichteninhalt an Resend übermittelt.
          <br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1
          lit. f DSGVO (berechtigtes Interesse)
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>8. Speicherdauer</h2>
        <p style={{ marginBottom: '1rem' }}>
          Wir speichern personenbezogene Daten nur so lange, wie sie für die jeweiligen Zwecke
          erforderlich sind bzw. gesetzliche Aufbewahrungsfristen bestehen. Bestelldaten werden
          gemäß handels- und steuerrechtlichen Vorgaben für bis zu 10 Jahre aufbewahrt.
          Nutzerkonten können jederzeit gelöscht werden.
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          9. Ihre Rechte als betroffene Person
        </h2>
        <p style={{ marginBottom: '1rem' }}>Sie haben jederzeit das Recht:</p>
        <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
          <li>auf Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
          <li>auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>auf Löschung Ihrer Daten (Art. 17 DSGVO)</li>
          <li>auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>auf Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
          <li>auf Beschwerde bei der zuständigen Datenschutzbehörde (Art. 77 DSGVO)</li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: lebenskunst777@aol.com
        </p>

        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          10. Änderungen dieser Datenschutzerklärung
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Diese Datenschutzerklärung ist aktuell gültig (Stand: März 2026). Wir behalten uns
          vor, sie bei Änderungen der Website oder gesetzlicher Vorgaben zu aktualisieren.
        </p>
      </div>
    </section>
  )
}
