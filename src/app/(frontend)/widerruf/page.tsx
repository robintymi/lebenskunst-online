import type { Metadata } from 'next'
import styles from '../impressum/impressum.module.css'
import WiderrufForm from './WiderrufForm'

export const metadata: Metadata = {
  title: 'Widerrufsrecht – Lebenskunst',
  description: 'Widerrufsbelehrung und Online-Widerrufsformular für Käufe bei lebenskunstonline.de',
}

export default function WiderrufPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Widerrufsrecht & Widerrufsformular</h1>
        <p className={styles.subtitle}>Stand: Mai 2026</p>

        <section className={styles.section}>
          <h2>Widerrufsbelehrung</h2>
          <h3>Widerrufsrecht</h3>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen
            Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag,
            an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist,
            die Waren in Besitz genommen haben bzw. hat.
          </p>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Susanne Sturm,
            lebenskunstonline.de, E-Mail: info@lebenskunstonline.de) mittels einer
            eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail)
            über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
            dafür das untenstehende Online-Formular verwenden.
          </p>
          <p>
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über
            die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Ausschluss des Widerrufsrechts</h2>
          <ul>
            <li>
              <strong>Digitale Inhalte:</strong> Das Widerrufsrecht erlischt bei digitalen
              Inhalten (Videos, Audios, PDFs), wenn die Ausführung begonnen hat und Sie
              ausdrücklich zugestimmt haben, dass wir mit der Ausführung beginnen, bevor
              die Widerrufsfrist abgelaufen ist, und Sie Ihre Kenntnis davon bestätigt
              haben, dass Sie durch Ihre Zustimmung Ihr Widerrufsrecht verlieren.
            </li>
            <li>
              <strong>Seminare & Events:</strong> Bei Verträgen zur Erbringung von
              Dienstleistungen im Zusammenhang mit Freizeitbetätigungen erlischt das
              Widerrufsrecht, wenn der Vertrag einen spezifischen Termin vorsieht
              (§ 312g Abs. 2 Nr. 9 BGB).
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Folgen des Widerrufs</h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir
            von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der
            zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der
            Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt
            haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
            zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags
            bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
            Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben,
            es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem
            Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
          </p>
          <p>
            Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten
            haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt
            haben, je nachdem, welches der frühere Zeitpunkt ist. Sie haben die Waren
            unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag,
            an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns
            zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren
            vor Ablauf der Frist von vierzehn Tagen absenden. Sie tragen die unmittelbaren
            Kosten der Rücksendung der Waren.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Online-Widerrufsformular</h2>
          <p>
            Nutzen Sie unser Online-Formular, um Ihren Widerruf schnell und unkompliziert
            einzulegen. Sie erhalten sofort eine Bestätigung per E-Mail.
          </p>
          <WiderrufForm />
        </section>

        <section className={styles.section}>
          <h2>Muster-Widerrufsformular</h2>
          <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular
            aus und senden Sie es zurück — oder nutzen Sie das Online-Formular oben.)
          </p>
          <div style={{
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1.5rem',
            background: 'var(--color-bg-secondary)',
            lineHeight: 1.8,
          }}>
            <p>An: Susanne Sturm, lebenskunstonline.de, info@lebenskunstonline.de</p>
            <p>
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
              über den Kauf der folgenden Waren (*) / die Erbringung der folgenden
              Dienstleistung (*)
            </p>
            <p>Bestellt am (*) / erhalten am (*): ___________________________</p>
            <p>Name des/der Verbraucher(s): ___________________________</p>
            <p>Anschrift des/der Verbraucher(s): ___________________________</p>
            <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ___________________________</p>
            <p>Datum: ___________________________</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>(*) Unzutreffendes streichen.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
