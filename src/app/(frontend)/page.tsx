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
            Begib dich auf eine Reise zu dir selbst — durch Seminare, Workshops, Einzeltrainings,
            Podcast und vieles mehr.
          </p>
          <div className={styles.heroCta}>
            <Link href="/shop" className="btn btn-primary">
              Zum Shop
            </Link>
            <Link href="/podcast" className="btn btn-secondary">
              Podcast entdecken
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
                title: 'Seminare & Workshops',
                desc: 'Seminare, Workshops und Vorträge — live und online. Buche direkt deinen Platz.',
                icon: '🌿',
                href: '/shop?typ=seminar',
              },
              {
                title: 'Einzeltrainings',
                desc: 'Mehrteilige Trainings über 4-8 Wochen für nachhaltige Veränderung.',
                icon: '🧘',
                href: '/shop?typ=einzeltraining',
              },
              {
                title: 'Video & Audio',
                desc: 'Videomaterial, Audiomaterial und Begleitmaterial für dein Selbststudium.',
                icon: '🎧',
                href: '/shop?typ=video',
              },
              {
                title: 'Themenbundles',
                desc: 'Spare mit gebündelten Paketen zu Themen wie Abhängigkeiten oder Bewusstseinsarchitektur.',
                icon: '📦',
                href: '/shop?ansicht=bundles',
              },
              {
                title: 'Podcast',
                desc: 'Impulse und Gespräche für dein persönliches Wachstum.',
                icon: '🎙️',
                href: '/podcast',
              },
              {
                title: 'Mitgliederbereich',
                desc: 'Dein persönliches Dashboard mit gebuchten Inhalten und Trainings.',
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
                Lebenskunst ist ein Raum für persönliches Wachstum und tiefe Transformation. Wir
                bieten Seminare, Einzeltrainings und digitale Materialien, die dich auf deinem Weg
                begleiten und inspirieren.
              </p>
              <p>
                Ob du an einem Workshop teilnimmst, ein Einzeltraining absolvierst oder unseren
                Podcast hörst — bei Lebenskunst findest du, was deine Seele berührt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
