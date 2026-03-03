import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <>
      {/* Decorative Background Orbs */}
      <div className={styles.decorativeOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <p className={styles.heroSubtitle}>Willkommen bei</p>
            <h1 className={styles.heroTitle}>Lebenskunst</h1>
            <p className={styles.heroText}>
              Raum für Weiblichkeit, Kreativität und tiefe Verbindung. Ein Ort, an dem du ankommen
              darfst — so wie du bist.
            </p>
            <div className={styles.heroCta}>
              <Link href="/shop" className="btn btn-primary">
                Entdecke mehr
              </Link>
              <Link href="/podcast" className="btn btn-secondary">
                Podcast entdecken
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.lotusWrapper}>
              <svg width="384" height="384" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="180" fill="url(#grad1)" opacity="0.3" />
                <circle cx="200" cy="200" r="140" fill="url(#grad2)" opacity="0.5" />
                <circle cx="200" cy="200" r="100" fill="url(#grad3)" opacity="0.7" />
                <g transform="translate(200, 200)">
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#D4707A" opacity="0.8" transform="rotate(0)" />
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#BE465A" opacity="0.7" transform="rotate(45)" />
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#D4707A" opacity="0.8" transform="rotate(90)" />
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#BE465A" opacity="0.7" transform="rotate(135)" />
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#D4707A" opacity="0.8" transform="rotate(180)" />
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#BE465A" opacity="0.7" transform="rotate(225)" />
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#D4707A" opacity="0.8" transform="rotate(270)" />
                  <ellipse cx="0" cy="-50" rx="25" ry="50" fill="#BE465A" opacity="0.7" transform="rotate(315)" />
                  <circle cx="0" cy="0" r="30" fill="#FFF5F5" />
                  <circle cx="0" cy="0" r="20" fill="#D4707A" />
                </g>
                <defs>
                  <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: '#D4707A', stopOpacity: 0.5 }} />
                    <stop offset="100%" style={{ stopColor: '#FFF5F5', stopOpacity: 0 }} />
                  </radialGradient>
                  <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: '#BE465A', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: '#D4707A', stopOpacity: 0.1 }} />
                  </radialGradient>
                  <radialGradient id="grad3" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: '#FFF5F5', stopOpacity: 0.9 }} />
                    <stop offset="100%" style={{ stopColor: '#D4707A', stopOpacity: 0.3 }} />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(190, 70, 90, 0.05) 50%, transparent 100%)' }}>
        <div className="container">
          <p className={styles.sectionSubtitle}>Gemeinsam wachsen</p>
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

      {/* Quote Section */}
      <section className={styles.quoteSection}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#BE465A" opacity="0.3" style={{ margin: '0 auto 2rem', display: 'block' }}>
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
        <blockquote className={styles.quoteText}>
          &ldquo;Die größte Kunst ist es, sich selbst treu zu bleiben und dabei immer wieder neu zu erblühen.&rdquo;
        </blockquote>
        <div className={styles.quoteAuthor}>
          <div className={styles.quoteAvatar} />
          <div style={{ textAlign: 'left' }}>
            <p className={styles.quoteAuthorName}>Lebenskunst</p>
            <p className={styles.quoteAuthorRole}>Gründerin & Künstlerin</p>
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
