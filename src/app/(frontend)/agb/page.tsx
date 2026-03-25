import type { Metadata } from 'next'
import styles from '../impressum/impressum.module.css'

export const metadata: Metadata = {
  title: 'AGB – Allgemeine Geschäftsbedingungen',
}

export default function AgbPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Allgemeine Geschäftsbedingungen</h1>
        <p className={styles.subtitle}>Stand: März 2026</p>

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
            Alle Preise sind Endpreise. Die Zahlung erfolgt per Kreditkarte oder
            SEPA-Lastschrift über Stripe. Bei Ratenzahlung wird der Gesamtbetrag in
            monatlichen Raten abgebucht; der Zugang bleibt aktiv solange die Zahlungen
            pünktlich eingehen.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 4 Widerrufsrecht</h2>
          <p>
            <strong>Digitale Produkte:</strong> Bei sofort herunterladbaren Inhalten
            (Videos, Audios, PDFs) erlischt das Widerrufsrecht mit Beginn der Ausführung,
            wenn Sie ausdrücklich zugestimmt haben, dass die Ausführung vor Ablauf der
            Widerrufsfrist beginnt, und Sie bestätigt haben, dass Sie damit Ihr
            Widerrufsrecht verlieren.
          </p>
          <p>
            <strong>Events & Seminare:</strong> Eine kostenlose Stornierung ist bis
            14 Tage vor Veranstaltungsdatum möglich. Danach wird der volle Betrag fällig.
          </p>
          <p>
            <strong>Physische Produkte (Kunst):</strong> Sie haben 14 Tage Widerrufsrecht
            ab Erhalt der Ware. Rücksendung auf Ihre Kosten.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 5 Zugang zu digitalen Inhalten</h2>
          <p>
            Nach erfolgreicher Zahlung erhalten Sie sofortigen Zugang zu gekauften
            digitalen Inhalten in Ihrem Mitgliederbereich. Der Zugang ist persönlich
            und nicht übertragbar.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 6 Haftung</h2>
          <p>
            Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit. Bei leichter
            Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten,
            begrenzt auf den vorhersehbaren Schaden.
          </p>
        </section>

        <section className={styles.section}>
          <h2>§ 7 Streitbeilegung</h2>
          <p>
            Es gilt deutsches Recht. Für Verbraucher gilt dies nur, soweit dadurch nicht
            zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher seinen
            Wohnsitz hat, eingeschränkt werden.
          </p>
        </section>
      </div>
    </main>
  )
}
