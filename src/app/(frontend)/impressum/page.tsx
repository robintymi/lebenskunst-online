import type { Metadata } from 'next'
import styles from './impressum.module.css'
import { getSiteTexts } from '@/lib/site-texts'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum gemäß § 5 TMG',
}

export default async function ImpressumPage() {
  const siteTexts = await getSiteTexts()
  const cms = siteTexts?.legal?.impressum || {}
  const pageTitle = cms?.title || 'Impressum'
  const subtitle = cms?.subtitle || 'Angaben gemäß § 5 TMG'

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
          <h2>Steuerliche Angaben</h2>
          <p>
            Steuernummer: [Von Finanzamt mitteilen lassen und hier eintragen]<br />
            <em style={{ fontSize: '13px', color: '#aaa' }}>
              (Hinweis an Betreiberin: Steuernummer oder USt-IdNr. ist laut § 5 TMG
              Pflichtangabe für gewerbliche Anbieter — bitte vor Go-Live eintragen)
            </em>
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
          </>
        )}
      </div>
    </main>
  )
}
