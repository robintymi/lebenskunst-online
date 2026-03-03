import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <h3 className={styles.logo}>
            <span className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            Lebenskunst
          </h3>
          <p className={styles.tagline}>Deine Reise zu dir selbst</p>
          <p className={styles.description}>
            Seminare, Workshops, Einzeltrainings, Podcast und mehr für dein persönliches Wachstum.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.column}>
            <h4>Entdecken</h4>
            <Link href="/shop">Shop</Link>
            <Link href="/podcast">Podcast</Link>
            <Link href="/mitglieder">Mitgliederbereich</Link>
          </div>
          <div className={styles.column}>
            <h4>Rechtliches</h4>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/agb">AGB</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Lebenskunst. Mit Liebe gemacht.</p>
      </div>
    </footer>
  )
}
