'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import styles from './dashboard.module.css'

const navItems = [
  { href: '/mitglieder/dashboard', label: 'Übersicht', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { href: '/mitglieder/dashboard/bestellungen', label: 'Bestellungen', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { href: '/mitglieder/dashboard/inhalte', label: 'Meine Inhalte', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/mitglieder/dashboard/trainings', label: 'Trainings', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { href: '/mitglieder/dashboard/profil', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <section className="section">
      <div className="container">
        <div className={styles.dashboardLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
              <div>
                <strong>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}</strong>
                <span className={styles.role}>Mitglied</span>
              </div>
            </div>

            <nav className={styles.sidebarNav}>
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/mitglieder/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <button onClick={handleLogout} className={styles.logoutBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Abmelden
            </button>
          </aside>

          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </section>
  )
}
