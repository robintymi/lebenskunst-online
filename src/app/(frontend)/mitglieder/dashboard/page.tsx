'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/orders?where[customer][equals]=${user.id}&sort=-createdAt&limit=3&depth=0`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => setRecentOrders(data?.docs || []))
      .catch(() => setError('Bestellungen konnten nicht geladen werden.'))
  }, [user?.id])

  const purchasedCount = user?.purchasedItems?.length ?? 0
  const trainingCount = user?.trainingAccess?.length ?? 0

  return (
    <div>
      <div className={styles.greeting}>
        <h1>Hallo, {user?.firstName || 'Mitglied'}!</h1>
        <p>Willkommen in deinem Mitgliederbereich.</p>
      </div>

      {error && (
        <p style={{ color: '#BE465A', fontSize: '14px', padding: '12px', background: '#fff0f2', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{purchasedCount}</span>
          <span className={styles.statLabel}>Gekaufte Inhalte</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>&mdash;</span>
          <span className={styles.statLabel}>Bestellungen</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{trainingCount}</span>
          <span className={styles.statLabel}>Aktive Trainings</span>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <Link href="/mitglieder/dashboard/bestellungen" className={styles.quickLink}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div>
            <strong>Bestellungen</strong>
            <span>Alle Bestellungen einsehen</span>
          </div>
        </Link>

        <Link href="/mitglieder/dashboard/inhalte" className={styles.quickLink}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong>Meine Inhalte</strong>
            <span>Videos, Audio &amp; mehr</span>
          </div>
        </Link>

        <Link href="/mitglieder/dashboard/trainings" className={styles.quickLink}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div>
            <strong>Trainings</strong>
            <span>Fortschritt verfolgen</span>
          </div>
        </Link>

        <Link href="/mitglieder/dashboard/profil" className={styles.quickLink}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div>
            <strong>Profil</strong>
            <span>Daten bearbeiten</span>
          </div>
        </Link>
      </div>

      {recentOrders.length > 0 && (
        <div className={styles.recentOrders}>
          <h2>Letzte Bestellungen</h2>
          <div className={styles.recentOrdersList}>
            {recentOrders.map((order: any) => (
              <div key={order.id} className={styles.recentOrderItem}>
                <div>
                  <span className={styles.orderNumber}>{order.orderNumber}</span>
                  <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('de-DE')}</span>
                </div>
                <div className={styles.orderRight}>
                  <span className={styles[`status_${order.status}`] || styles.statusBadge}>
                    {order.status === 'paid' ? 'Bezahlt' : order.status === 'pending' ? 'Ausstehend' : order.status === 'installment_active' ? 'Ratenzahlung' : order.status}
                  </span>
                  <span className={styles.orderTotal}>€{(order.total || 0).toFixed(2).replace('.', ',')}</span>
                  {(order.status === 'paid' || order.status === 'installment_active') && (
                    <a href={`/api/invoice/${order.id}`} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink}>
                      Rechnung
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
