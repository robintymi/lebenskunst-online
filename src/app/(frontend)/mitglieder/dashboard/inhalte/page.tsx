'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { itemTypeLabels, formatDate } from '@/lib/utils'
import styles from '../dashboard.module.css'

interface ShopItemImage {
  url?: string
  [key: string]: unknown
}

interface ShopItem {
  id: string
  title: string
  itemType: string
  image?: ShopItemImage | string
  date?: string
  [key: string]: unknown
}

interface Bundle {
  id: string
  title: string
  description?: string
  items?: ShopItem[]
  [key: string]: unknown
}

interface UserResponse {
  purchasedItems?: ShopItem[]
  purchasedBundles?: Bundle[]
}

function getActionLabel(itemType: string): { label: string; href: (id: string) => string } | null {
  switch (itemType) {
    case 'video':
      return { label: 'Ansehen', href: (id) => `/api/content/${id}` }
    case 'audio':
      return { label: 'Anhören', href: (id) => `/api/content/${id}` }
    case 'begleitmaterial':
      return { label: 'Herunterladen', href: (id) => `/api/content/${id}` }
    default:
      return null
  }
}

export default function InhaltePage() {
  const { user } = useAuth()
  const [purchasedItems, setPurchasedItems] = useState<ShopItem[]>([])
  const [purchasedBundles, setPurchasedBundles] = useState<Bundle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchContent = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/users/${user.id}?depth=2`, {
          credentials: 'include',
        })

        if (!res.ok) {
          throw new Error('Inhalte konnten nicht geladen werden.')
        }

        const data: UserResponse = await res.json()
        setPurchasedItems(data.purchasedItems ?? [])
        setPurchasedBundles(data.purchasedBundles ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [user?.id])

  // Group purchased items by itemType
  const groupedItems: Record<string, ShopItem[]> = {}
  for (const item of purchasedItems) {
    const type = item.itemType
    if (!groupedItems[type]) {
      groupedItems[type] = []
    }
    groupedItems[type].push(item)
  }

  const hasContent = purchasedItems.length > 0 || purchasedBundles.length > 0

  if (isLoading) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1>Meine Inhalte</h1>
          <p>Deine gekauften Inhalte werden geladen...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1>Meine Inhalte</h1>
        </div>
        <div className={styles.errorMsg}>{error}</div>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Meine Inhalte</h1>
        <p>Alle deine gekauften Inhalte auf einen Blick.</p>
      </div>

      {!hasContent ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3>Noch keine Inhalte</h3>
            <p>Du hast noch keine Inhalte erworben. Entdecke unser Angebot im Shop.</p>
            <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Zum Shop
            </Link>
          </div>
        </div>
      ) : (
        <>
          {Object.entries(groupedItems).map(([itemType, items]) => (
            <div key={itemType} style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>
                {itemTypeLabels[itemType] || itemType}
              </h2>
              <div className={styles.contentGrid}>
                {items.map((item) => {
                  const imageUrl =
                    item.image && typeof item.image === 'object'
                      ? item.image.url
                      : typeof item.image === 'string'
                        ? item.image
                        : null

                  const action = getActionLabel(item.itemType)
                  const isEvent = ['seminar', 'workshop', 'vortrag'].includes(item.itemType)
                  const isBook = item.itemType === 'buch'

                  return (
                    <div key={item.id} className={styles.contentCard}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className={styles.contentCardImage}
                        />
                      ) : (
                        <div className={styles.contentCardImage} />
                      )}
                      <div className={styles.contentCardBody}>
                        <span className={styles.typeBadge}>
                          {itemTypeLabels[item.itemType] || item.itemType}
                        </span>
                        <h4>{item.title}</h4>

                        {action && (
                          <Link
                            href={action.href(item.id)}
                            className="btn btn-primary"
                            style={{ marginTop: '0.75rem', display: 'inline-block', fontSize: '0.875rem' }}
                          >
                            {action.label}
                          </Link>
                        )}

                        {isEvent && item.date && (
                          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            {formatDate(item.date)}
                          </p>
                        )}

                        {isBook && (
                          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Versand-Artikel
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {purchasedBundles.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Meine Bundles</h2>
              <div className={styles.contentGrid}>
                {purchasedBundles.map((bundle) => (
                  <div key={bundle.id} className={styles.contentCard}>
                    <div className={styles.contentCardBody}>
                      <span className={styles.typeBadge}>Bundle</span>
                      <h4>{bundle.title}</h4>
                      {bundle.description && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          {bundle.description}
                        </p>
                      )}
                      {bundle.items && bundle.items.length > 0 && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                          {bundle.items.length} {bundle.items.length === 1 ? 'Inhalt' : 'Inhalte'} enthalten
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
