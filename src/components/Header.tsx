'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import styles from './Header.module.css'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Veranstaltungen' },
  { href: '/shop', label: 'Kunstshop' },
  { href: '/mitglieder', label: 'Mitgliederbereich' },
]

export default function Header() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Lebenskunst</span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/warenkorb" className={styles.cartLink}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </Link>

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <span className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}
