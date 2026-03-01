import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>Willkommen bei</p>
          <h1 className={styles.heroTitle}>Lebenskunst</h1>
          <p className={styles.heroText}>
            Begib dich auf eine Reise zu dir selbst — durch Embodiment, Energiearbeit,
            Frauenkreise, Kunsttherapie, Meditation und Breathwork.
          </p>
          <div className={styles.heroCta}>
            <Link href="/events" className="btn btn-primary">
              Veranstaltungen entdecken
            </Link>
            <Link href="/shop" className="btn btn-secondary">
              Kunstshop besuchen
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <h2 className={styles.sectionTitle}>Was dich erwartet</h2>
          <div className={styles.features}>
            {[
              {
                title: 'Veranstaltungen',
                desc: 'Workshops, Frauenkreise, Breathwork-Sessions und mehr — live und online.',
                icon: '🌿',
                href: '/events',
              },
              {
                title: 'Kunstshop',
                desc: 'Einzigartige Kunstgegenstände aus Kunsttherapie und kreativem Schaffen.',
                icon: '🎨',
                href: '/shop',
              },
              {
                title: 'Mitgliederbereich',
                desc: 'Exklusive Inhalte, gebuchte Events und dein persönliches Dashboard.',
                icon: '✨',
                href: '/mitglieder',
              },
            ].map((feature) => (
              <Link href={feature.href} key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={`section ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.about}>
            <div>
              <h2>Über Lebenskunst</h2>
              <p>
                Lebenskunst ist ein Raum für persönliches Wachstum und kreative Entfaltung. Wir
                bieten Veranstaltungen und Kunstgegenstände, die dich auf deinem Weg begleiten und
                inspirieren.
              </p>
              <p>
                Ob du an einem Frauenkreis teilnimmst, Breathwork erlebst oder ein einzigartiges
                Kunstwerk für dein Zuhause findest — bei Lebenskunst findest du, was deine Seele
                berührt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
