import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <h3 className={styles.logo}>Lebenskunst</h3>
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
        <p>&copy; {new Date().getFullYear()} Lebenskunst. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  )
}
