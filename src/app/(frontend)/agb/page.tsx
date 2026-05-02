import type { Metadata } from 'next'
import styles from '../impressum/impressum.module.css'
import { getSiteTexts } from '@/lib/site-texts'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const metadata: Metadata = {
  title: 'AGB – Allgemeine Geschäftsbedingungen',
}

export default async function AgbPage() {
  const siteTexts = await getSiteTexts()
  const cms = siteTexts?.legal?.agb || {}
  const pageTitle = cms?.title || 'Allgemeine Geschäftsbedingungen'
  const subtitle = cms?.subtitle || 'Stand: Mai 2026'

  const cmsContent = cms?.content as DefaultTypedEditorState | undefined
  const cmsHTML =
    cmsContent?.root?.children?.length ? convertLexicalToHTML({ data: cmsContent }) : null

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>{pageTitle}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        {cmsHTML ? (
          <section className={styles.section} dangerouslySetInnerHTML={{ __html: cmsHTML }} />
        ) : (
          <>
        <section className={styles.section}>
          <h2>§ 1 Geltungsbereich</h2>
          <p>
            Diese AGB gelten für alle Käufe und Buchungen über lebenskunstonline.de
            zwischen Susanne Sturm (Anbieterin) und Kunden (Verbraucher oder Unternehmer).
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 2 Vertragsschluss</h2>
          <p>
            Mit Absenden der Bestellung geben Sie ein verbindliches Angebot ab. Der Vertrag
            kommt mit Zugang der Bestellbestätigung per E-Mail zustande.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 3 Preise & Zahlung</h2>
          <p>
            Alle Preise sind Endpreise inkl. gesetzlicher Mehrwertsteuer. Die Zahlung
            erfolgt per Kreditkarte oder SEPA-Lastschrift über Stripe (verschlüsselt,
            PCI-DSS-konform). Bei Ratenzahlung wird der Gesamtbetrag in monatlichen Raten
            abgebucht; der Zugang bleibt aktiv, solange die Zahlungen pünktlich eingehen.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 4 Lieferung & Versand</h2>
          <p>
            <strong>Digitale Inhalte (Videos, Audios, PDFs, Online-Kurse):</strong>{' '}
            Sofortiger Zugang nach Zahlungseingang — kein Versand, keine Lieferzeit.
          </p>
          <p>
            <strong>Seminare, Workshops & Events:</strong> Buchungsbestätigung per E-Mail
            unmittelbar nach Zahlungseingang. Zugangslink bzw. Veranstaltungsdetails werden
            spätestens 3 Tage vor dem Termin mitgeteilt.
          </p>
          <p>
            <strong>Physische Produkte (Kunstwerke, Dekoartikel):</strong> Lieferzeit
            3–5 Werktage innerhalb Deutschlands per DHL. <strong>Versandkostenfreie
            Lieferung ab einem Bestellwert von 100 €</strong>; darunter fallen
            Versandkosten von 5,90 € an. Es gilt kein Mindestbestellwert.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 5 Widerrufsrecht</h2>
          <p>
            Die vollständige Widerrufsbelehrung sowie das Online-Widerrufsformular finden
            Sie auf unserer{' '}
            <a href="/widerruf" style={{ color: 'var(--color-primary)' }}>Widerrufsseite</a>.
            Sie können Ihren Widerruf auch direkt in Ihrem Mitgliederbereich unter
            „Meine Bestellungen“ mit einem Klick einlegen.
          </p>
          <p>
            <strong>Digitale Produkte:</strong> Das Widerrufsrecht erlischt bei digitalen
            Inhalten (Videos, Audios, PDFs), wenn die Ausführung mit Ihrer ausdrücklichen
            Zustimmung vor Ablauf der Widerrufsfrist begonnen hat und Sie Ihre Kenntnis
            vom Erlöschen des Widerrufsrechts bestätigt haben.
          </p>
          <p>
            <strong>Events & Seminare:</strong> Eine kostenlose Stornierung ist bis
            14 Tage vor Veranstaltungsdatum möglich. Danach wird der volle Betrag fällig.
          </p>
          <p>
            <strong>Physische Produkte (Kunst):</strong> 14 Tage Widerrufsrecht ab
            Erhalt der Ware. Rücksendung auf Ihre Kosten. Nutzen Sie unser{' '}
            <a href="/widerruf" style={{ color: 'var(--color-primary)' }}>Online-Widerrufsformular</a>{' '}
            für eine schnelle Abwicklung.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 6 Zugang zu digitalen Inhalten</h2>
          <p>
            Nach erfolgreicher Zahlung erhalten Sie sofortigen Zugang zu gekauften
            digitalen Inhalten in Ihrem Mitgliederbereich. Der Zugang ist persönlich
            und nicht übertragbar.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 7 Haftung</h2>
          <p>
            Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit. Bei leichter
            Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten,
            begrenzt auf den vorhersehbaren Schaden.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 8 Streitbeilegung</h2>
          <p>
            Es gilt deutsches Recht. Die EU-Kommission stellt eine Plattform zur
            Online-Streitbeilegung bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-primary)' }}
            >
              https://ec.europa.eu/consumers/odr
            </a>
            . Wir nehmen an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle nicht teil.
          </p>
        </section>
          </>
        )}
      </div>
    </main>
  )
}
