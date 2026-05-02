import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import styles from './page.module.css'
import ReviewSection from '@/components/ReviewSection'
import { getSiteTexts } from '@/lib/site-texts'

export const dynamic = 'force-dynamic'

type SiteSettingsData = {
  heroImage?: {
    url?: string
    sizes?: { hero?: { url?: string } }
  } | null
  heroTitle?: string | null
  heroSubtitle?: string | null
  quoteText?: string | null
  testimonials?: unknown[] | null
}

export default async function HomePage() {
  let siteSettings: unknown = null
  try {
    const payload = await getPayload({ config })
    siteSettings = await payload.findGlobal({ slug: 'site-settings' })
  } catch {
    // Settings not yet created, use defaults
  }

  const siteTexts = await getSiteTexts()
  const homeTexts = siteTexts?.home || {}

  const settings: SiteSettingsData | null =
    siteSettings && typeof siteSettings === 'object' ? (siteSettings as SiteSettingsData) : null

  const heroImageUrl = settings?.heroImage?.url || settings?.heroImage?.sizes?.hero?.url || null
  const heroTitle = settings?.heroTitle || 'Lebenskunst'
  const heroSubtitle =
    settings?.heroSubtitle ||
    'Ich begleite Menschen auf dem Weg zu mehr Bewusstsein, Lebendigkeit und authentischem Selbstausdruck. Denn wahre Erfüllung entsteht nicht im Außen, sondern im Innen. Dort beginnt das Leben.'
  const quoteText =
    settings?.quoteText || 'Selbstausdruck ist der Tanz der Seele — und vielleicht genau das, wonach wir alle suchen.'
  const testimonials = settings?.testimonials || []

  const heroKicker = homeTexts?.heroKicker || 'Bewusstsein · Lebendigkeit · Selbstausdruck'
  const heroPrimaryCta = homeTexts?.heroPrimaryCta || 'Angebote entdecken'
  const heroSecondaryCta = homeTexts?.heroSecondaryCta || 'Podcast hören'
  const heroImageAlt = homeTexts?.heroImageAlt || 'Susanne Sturm — Lebenskunst'

  const trustItems =
    Array.isArray(homeTexts?.trustItems) && homeTexts.trustItems.length > 0
      ? homeTexts.trustItems
      : [
          { value: '10+', label: 'Jahre Erfahrung' },
          { value: '500+', label: 'Begleitete Menschen' },
          { value: 'Live & Online', label: 'Flexibel teilnehmen' },
          { value: 'Ratenzahlung', label: 'Bequem in Raten zahlen' },
        ]

  const introHeading = homeTexts?.introHeading || 'Willkommen — schön, dass du da bist'
  const introParagraphs =
    Array.isArray(homeTexts?.introParagraphs) && homeTexts.introParagraphs.length > 0
      ? homeTexts.introParagraphs
      : [
          {
            text:
              'Mein Herzensanliegen ist es, dich darin zu unterstützen, dich selbst wieder zu spüren — jenseits des ständigen Tuns, um etwas zu erreichen, zu gefallen oder eine Reaktion zu bekommen.',
          },
          {
            text:
              'In meinen Trainings geht es um die Rückkehr zu dir selbst — um den Moment, in dem du nicht mehr funktionierst, sondern fühlst. Wir erforschen gemeinsam, wie du dein trainiertes Antwortverhalten erkennst, loslässt und lernst, wieder aus dem Inneren heraus zu handeln — mit Genuss, Präsenz und Freude.',
          },
          {
            text:
              'Geprägt von schwierigen Lebensphasen — einer herausfordernden Kindheit, intensiven Partnerschaften und einem tiefen Burnout — durfte ich erfahren, wie es ist, wenn das Leben stillsteht. Erst durch Bewusstseinstraining, Breathwork und die Arbeit mit meinem Körper fand ich zurück zu mir selbst, zu meiner Lebendigkeit und meinem inneren Frieden.',
          },
          {
            text:
              'Heute möchte ich dieses Wissen, diese Erfahrung und diese Tiefe weitergeben — an Menschen, die sich nach echter Verbindung, Ausdruck und Sinn sehnen.',
          },
        ]
  const introHighlight =
    homeTexts?.introHighlight ||
    'Ich glaube, wir haben in dieser lauten, schnellen Welt oft vergessen, was es heißt, wirklich da zu sein. Wir reagieren mehr, als wir leben. Wir schauen mehr nach außen, als nach innen. Und genau da möchte ich ansetzen — damit wir wieder spüren, wer wir sind.'

  const featuresSubtitle = homeTexts?.featuresSubtitle || 'Gemeinsam wachsen'
  const featuresTitle = homeTexts?.featuresTitle || 'Was dich erwartet'
  const features =
    Array.isArray(homeTexts?.features) && homeTexts.features.length > 0
      ? homeTexts.features
      : [
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
        ]

  const quoteAuthorName = homeTexts?.quoteAuthorName || 'Susanne Sturm'
  const quoteAuthorRole = homeTexts?.quoteAuthorRole || 'Gründerin, Lebenskunst'
  const quoteAvatarAlt = homeTexts?.quoteAvatarAlt || 'Susanne'

  const ctaHeading = homeTexts?.ctaHeading || 'Bereit für den ersten Schritt?'
  const ctaText =
    homeTexts?.ctaText ||
    'Schau dich im Shop um oder melde dich an, um Zugang zu deinen gebuchten Inhalten zu erhalten.'
  const ctaPrimary = homeTexts?.ctaPrimary || 'Zum Shop'
  const ctaSecondary = homeTexts?.ctaSecondary || 'Konto erstellen'

  const reviewTexts = homeTexts?.reviews || {}

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
            <p className={styles.heroSubtitle}>{heroKicker}</p>
            <h1 className={styles.heroTitle}>{heroTitle}</h1>
            <p className={styles.heroText}>{heroSubtitle}</p>
            <div className={styles.heroCta}>
              <Link href="/shop" className="btn btn-primary">
                {heroPrimaryCta}
              </Link>
              <Link href="/podcast" className="btn btn-secondary">
                {heroSecondaryCta}
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageWrapper}>
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={heroImageAlt}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <Image
                  src="/images/susanne.jpg"
                  alt={heroImageAlt}
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
            {trustItems.map((item, idx: number) => (
              <div key={`${item.value || 'item'}-${idx}`} style={{ display: 'contents' }}>
                <div className={styles.trustItem}>
                  <span className={styles.trustNumber}>{item.value}</span>
                  <span className={styles.trustLabel}>{item.label}</span>
                </div>
                {idx < trustItems.length - 1 && <div className={styles.trustDivider} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction — Susanne's story */}
      <section className={`section ${styles.introSection}`}>
        <div className="container">
          <div className={styles.introContent}>
            <h2>{introHeading}</h2>
            {introParagraphs.slice(0, 2).map((p, i: number) => (
              <p key={`intro-before-${i}`}>{p?.text}</p>
            ))}
            <div className={styles.introHighlight}>{introHighlight}</div>
            {introParagraphs.slice(2).map((p, i: number) => (
              <p key={`intro-after-${i}`}>{p?.text}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <p className={styles.sectionSubtitle}>{featuresSubtitle}</p>
          <h2 className={styles.sectionTitle}>{featuresTitle}</h2>
          <div className={styles.features}>
            {features.map((feature) => (
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
              alt={quoteAvatarAlt}
              width={48}
              height={48}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p className={styles.quoteAuthorName}>{quoteAuthorName}</p>
            <p className={styles.quoteAuthorRole}>{quoteAuthorRole}</p>
          </div>
        </div>
      </section>

      {/* Reviews / Social Proof */}
      <ReviewSection texts={reviewTexts} />

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2>{ctaHeading}</h2>
          <p>
            {ctaText}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-primary">{ctaPrimary}</Link>
            <Link href="/mitglieder" className="btn btn-secondary">{ctaSecondary}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
