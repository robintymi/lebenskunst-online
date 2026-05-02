import type { Metadata } from 'next'
import styles from './leistungen.module.css'
import { getSiteTexts } from '@/lib/site-texts'

export const metadata: Metadata = {
  title: 'Meine Leistungen — Lebenskunst',
  description: 'Erfahrungsräume, Bewusstheitsräume und Verbindungsräume — Training, Seminare und Begegnung für dein persönliches Wachstum.',
}

const defaultRooms = [
  {
    id: 'erfahrungsraeume',
    emoji: '\u{1F33F}',
    title: 'Erfahrungsräume',
    subtitle: 'Training für Körper & Wahrnehmung',
    motto: 'Spüren. Erleben. Im Körper ankommen.',
    intro: 'In den Erfahrungsräumen geht es nicht um Analyse, sondern um unmittelbares Erleben. Über Bewegung, Atem und Wahrnehmung entsteht ein direkter Zugang zu dir selbst.',
    formate: [
      'Körperorientierte Trainings',
      'Atem- & Wahrnehmungsworkshops',
      'Gruppenformate zur Selbsterfahrung',
    ],
    description: 'In den Erfahrungsräumen steht dein unmittelbares Erleben im Mittelpunkt. Du arbeitest nicht über den Kopf, sondern über deinen Körper, deinen Atem und deine Wahrnehmung. Diese Trainings helfen dir, dich selbst wieder klarer zu spüren, deine Präsenz zu stärken und einen direkten Zugang zu deiner inneren Stabilität zu finden. Alle Formate sind praxisnah, körperorientiert und so aufgebaut, dass du das Erlebte in deinen Alltag übertragen kannst.',
    beispiele: ['Präsenz (dein neuer Raum!)', 'Lebensenergie (Kundalini)', 'Gegenwart', 'Loslassen', 'Sinnlichkeit'],
    accent: 'green',
  },
  {
    id: 'bewusstheitsraeume',
    emoji: '\u{1F525}',
    title: 'Bewusstheitsräume',
    subtitle: 'Seminare für Klarheit & persönliche Entwicklung',
    motto: 'Erkennen. Verstehen. Neu ausrichten.',
    intro: 'Diese Räume verbinden Selbsterfahrung mit bewusster Reflexion. Du erkennst Muster, verstehst Zusammenhänge und entwickelst neue Perspektiven.',
    formate: [
      'Seminare',
      'Trainingsreihen',
      'Einzeltrainings',
    ],
    description: 'In den Bewusstheitsräumen verbindest du Selbsterfahrung mit bewusster Reflexion. Du erkennst Zusammenhänge, verstehst deine eigenen Muster und entwickelst neue Perspektiven auf dich selbst und dein Handeln. Die Seminare sind erlebnisorientiert aufgebaut und kombinieren praktische Übungen mit gezielter Reflexion.',
    beispiele: ['„Wann hast du aufgehört, du zu sein?"'],
    accent: 'fire',
  },
  {
    id: 'verbindungsraeume',
    emoji: '\u{1F338}',
    title: 'Verbindungsräume',
    subtitle: 'Austausch & echte Verbindung',
    motto: 'Teilen. Zuhören. Einfach sein.',
    intro: 'Diese Räume entstehen durch Begegnung. Ohne Methode, ohne Ziel — getragen von Präsenz und echtem Austausch.',
    formate: [
      'Moderierte Gesprächskreise',
      'Offene Gruppenabende',
    ],
    description: 'In den Verbindungsräumen geht es nicht um Entwicklung, sondern um Begegnung. Ohne Methode, ohne Druck, ohne Ziel. Du kommst, wie du bist. Wir hören zu, teilen, sind da. Oft entsteht genau daraus die tiefste Form von Verbindung.',
    beispiele: [],
    accent: 'blossom',
  },
]

export default async function LeistungenPage() {
  const siteTexts = await getSiteTexts()
  const leistungen = siteTexts?.leistungen || {}

  const heroTitle = leistungen?.heroTitle || 'Meine Leistungen'
  const heroText =
    leistungen?.heroText ||
    'Drei Räume für dein persönliches Wachstum — jeder mit einem eigenen Fokus, alle verbunden durch die Einladung, dir selbst zu begegnen.'
  const formateHeading = leistungen?.formateHeading || 'Formate'
  const beispieleHeading = leistungen?.beispieleHeading || 'Beispiele'

  const rooms =
    Array.isArray(leistungen?.rooms) && leistungen.rooms.length > 0 ? leistungen.rooms : defaultRooms

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroText}>{heroText}</p>
        </div>
      </section>

      <section className={styles.raeume}>
        <div className="container">
          {rooms.map((raum) => (
            <article
              key={raum.id}
              id={raum.id}
              className={`${styles.raum} ${styles[raum.accent]}`}
            >
              <div className={styles.raumHeader}>
                <span className={styles.raumEmoji}>{raum.emoji}</span>
                <div>
                  <h2 className={styles.raumTitle}>{raum.title}</h2>
                  <p className={styles.raumSubtitle}>{raum.subtitle}</p>
                </div>
              </div>

              <p className={styles.motto}>{raum.motto}</p>
              <p className={styles.intro}>{raum.intro}</p>

              <div className={styles.formate}>
                <h3>{formateHeading}</h3>
                <ul>
                  {(raum.formate || []).map((f) => {
                    const value = typeof f === 'string' ? f : f?.text
                    if (!value) return null
                    return <li key={value}>{value}</li>
                  })}
                </ul>
              </div>

              <p className={styles.description}>{raum.description}</p>

              {(raum.beispiele || []).length > 0 && (
                <div className={styles.beispiele}>
                  <h3>{beispieleHeading}</h3>
                  <div className={styles.beispielTags}>
                    {(raum.beispiele || []).map((b) => {
                      const value = typeof b === 'string' ? b : b?.text
                      if (!value) return null
                      return (
                        <span key={value} className={styles.tag}>{value}</span>
                      )
                    })}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
