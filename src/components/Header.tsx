'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { trackSearch, getRecentSearches } from '@/lib/personalization'
import styles from './Header.module.css'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/leistungen', label: 'Meine Leistungen' },
  { href: '/shop', label: 'Shop' },
  { href: '/podcast', label: 'Podcast' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()
  const { user, isLoggedIn, isLoading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      setRecentSearches(getRecentSearches())
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        if (!searchQuery) setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [searchQuery])

  const handleSearch = (q: string) => {
    const query = q.trim()
    if (!query) return
    trackSearch(query)
    setSearchOpen(false)
    setSearchQuery('')
    setShowSuggestions(false)
    router.push(`/shop?suche=${encodeURIComponent(query)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(searchQuery)
    if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Lebenskunst"
            width={44}
            height={44}
            className={styles.logoImage}
          />
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
          <Link
            href={isLoggedIn ? '/mitglieder/dashboard' : '/mitglieder'}
            className={`${styles.navLink} ${pathname.startsWith('/mitglieder') ? styles.active : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {isLoading ? 'Mitgliederbereich' : isLoggedIn ? (user?.firstName || 'Mein Konto') : 'Anmelden'}
          </Link>
        </nav>

        <div className={styles.actions}>
          {/* Search */}
          <div className={styles.searchWrap} ref={searchRef}>
            {searchOpen ? (
              <div className={styles.searchBar}>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Suchen …"
                  className={styles.searchInput}
                />
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className={styles.searchSubmit}
                  aria-label="Suchen"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className={styles.searchClose}
                  aria-label="Schließen"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>

                {showSuggestions && recentSearches.length > 0 && !searchQuery && (
                  <div className={styles.suggestions}>
                    <p className={styles.suggestionsLabel}>Zuletzt gesucht</p>
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        className={styles.suggestionItem}
                        onClick={() => handleSearch(s)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={styles.searchIcon}
                aria-label="Suche öffnen"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            )}
          </div>

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
