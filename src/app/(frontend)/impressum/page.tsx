import type { Metadata } from 'next'
import styles from './impressum.module.css'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum gemäß § 5 TMG',
}

export default function ImpressumPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Impressum</h1>
        <p className={styles.subtitle}>Angaben gemäß § 5 TMG</p>

        <section className={styles.section}>
          <h2>Anbieter</h2>
          <p>
            Susanne Sturm<br />
            Schweriner Straße 44<br />
            15757 Halbe<br />
            Deutschland
          </p>
        </section>

        <section className={styles.section}>
          <h2>Kontakt</h2>
          <p>
            Telefon: 0176 20 555 116<br />
            E-Mail: joseline148@aol.com
          </p>
        </section>

        <section className={styles.section}>
          <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            Susanne Sturm<br />
            Schweriner Straße 44<br />
            15757 Halbe
          </p>
        </section>

        <section className={styles.section}>
          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
          <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        </section>

        <section className={styles.section}>
          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </main>
  )
}
