import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import styles from './page.module.css'
import ReviewSection from '@/components/ReviewSection'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let siteSettings: any = null
  try {
    const payload = await getPayload({ config })
    siteSettings = await payload.findGlobal({ slug: 'site-settings' as any })
  } catch {
    // Settings not yet created, use defaults
  }

  const heroImageUrl = siteSettings?.heroImage?.url || siteSettings?.heroImage?.sizes?.hero?.url || null
  const heroTitle = siteSettings?.heroTitle || 'Lebenskunst'
  const heroSubtitle = siteSettings?.heroSubtitle || 'Ich begleite Menschen auf dem Weg zu mehr Bewusstsein, Lebendigkeit und authentischem Selbstausdruck. Denn wahre Erfüllung entsteht nicht im Außen, sondern im Innen. Dort beginnt das Leben.'
  const quoteText = siteSettings?.quoteText || 'Selbstausdruck ist der Tanz der Seele — und vielleicht genau das, wonach wir alle suchen.'
  const testimonials = siteSettings?.testimonials || []

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
            <p className={styles.heroSubtitle}>Bewusstsein &middot; Lebendigkeit &middot; Selbstausdruck</p>
            <h1 className={styles.heroTitle}>{heroTitle}</h1>
            <p className={styles.heroText}>{heroSubtitle}</p>
            <div className={styles.heroCta}>
              <Link href="/shop" className="btn btn-primary">
                Angebote entdecken
              </Link>
              <Link href="/podcast" className="btn btn-secondary">
                Podcast hören
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageWrapper}>
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="Susanne Sturm — Lebenskunst"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <Image
                  src="/images/susanne.jpg"
                  alt="Susanne Sturm — Lebenskunst"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustItems}>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>10+</span>
              <span className={styles.trustLabel}>Jahre Erfahrung</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>500+</span>
              <span className={styles.trustLabel}>Begleitete Menschen</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>Live & Online</span>
              <span className={styles.trustLabel}>Flexibel teilnehmen</span>
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>Ratenzahlung</span>
              <span className={styles.trustLabel}>Bequem in Raten zahlen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction — Susanne's story */}
      <section className={`section ${styles.introSection}`}>
        <div className="container">
          <div className={styles.introContent}>
            <h2>Willkommen — schön, dass du da bist</h2>
            <p>
              Mein Herzensanliegen ist es, dich darin zu unterstützen, dich selbst wieder zu spüren —
              jenseits des ständigen Tuns, um etwas zu erreichen, zu gefallen oder eine Reaktion zu bekommen.
            </p>
            <p>
              In meinen Trainings geht es um die Rückkehr zu dir selbst — um den Moment, in dem du nicht
              mehr funktionierst, sondern fühlst. Wir erforschen gemeinsam, wie du dein trainiertes
              Antwortverhalten erkennst, loslässt und lernst, wieder aus dem Inneren heraus zu handeln —
              mit Genuss, Präsenz und Freude.
            </p>
            <div className={styles.introHighlight}>
              Ich glaube, wir haben in dieser lauten, schnellen Welt oft vergessen, was es heißt,
              wirklich da zu sein. Wir reagieren mehr, als wir leben. Wir schauen mehr nach außen, als
              nach innen. Und genau da möchte ich ansetzen — damit wir wieder spüren, wer wir sind.
            </div>
            <p>
              Geprägt von schwierigen Lebensphasen — einer herausfordernden Kindheit, intensiven
              Partnerschaften und einem tiefen Burnout — durfte ich erfahren, wie es ist, wenn das
              Leben stillsteht. Erst durch Bewusstseinstraining, Breathwork und die Arbeit mit meinem
              Körper fand ich zurück zu mir selbst, zu meiner Lebendigkeit und meinem inneren Frieden.
            </p>
            <p>
              Heute möchte ich dieses Wissen, diese Erfahrung und diese Tiefe weitergeben — an Menschen,
              die sich nach echter Verbindung, Ausdruck und Sinn sehnen.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <p className={styles.sectionSubtitle}>Gemeinsam wachsen</p>
          <h2 className={styles.sectionTitle}>Was dich erwartet</h2>
          <div className={styles.features}>
            {[
              {
                title: 'Seminare & Workshops',
                desc: 'Live und online — gemeinsam in die Tiefe gehen. Buche direkt deinen Platz.',
                icon: '🌿',
                href: '/shop',
              },
              {
                title: 'Einzeltrainings',
                desc: 'Mehrteilige Trainings über mehrere Wochen für nachhaltige Veränderung.',
                icon: '🧭',
                href: '/shop',
              },
              {
                title: 'Video & Audio',
                desc: 'Materialien für dein Selbststudium — in deinem Tempo, wann du bereit bist.',
                icon: '🎧',
                href: '/shop',
              },
              {
                title: 'Themenbundles',
                desc: 'Gebündelte Pakete zu Themen wie Abhängigkeiten oder Bewusstseinsarchitektur.',
                icon: '📦',
                href: '/shop',
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
                icon: '🔑',
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
        <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-primary)" opacity="0.2" style={{ margin: '0 auto 1.5rem', display: 'block' }}>
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
        <blockquote className={styles.quoteText}>
          &ldquo;{quoteText}&rdquo;
        </blockquote>
        <div className={styles.quoteAuthor}>
          <div className={styles.quoteAvatar}>
            <Image
              src="/images/susanne.jpg"
              alt="Susanne"
              width={48}
              height={48}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p className={styles.quoteAuthorName}>Susanne Sturm</p>
            <p className={styles.quoteAuthorRole}>Gründerin, Lebenskunst</p>
          </div>
        </div>
      </section>

      {/* Reviews / Social Proof */}
      <ReviewSection />

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2>Bereit für den ersten Schritt?</h2>
          <p>
            Schau dich im Shop um oder melde dich an, um Zugang zu deinen gebuchten Inhalten zu erhalten.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-primary">Zum Shop</Link>
            <Link href="/mitglieder" className="btn btn-secondary">Konto erstellen</Link>
          </div>
        </div>
      </section>
    </>
  )
}
