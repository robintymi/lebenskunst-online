import { getPayloadClient } from '@/lib/payload'
import { formatPrice, formatDate, itemTypeLabels, isEventType, itemTypeGroups } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import ShopFilters from '@/components/ShopFilters'
import styles from './shop.module.css'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Seminare, Workshops, Trainings, Videomaterial, Audiomaterial, Bücher und Themenbundles.',
}

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const activeType = params.typ || ''
  const activeCategory = params.kategorie || ''
  const activeView = params.ansicht || ''
  const activeSearch = params.suche || ''

  const payload = await getPayloadClient()

  // Get current user's purchased items
  let purchasedItemIds: string[] = []
  let purchasedBundleIds: string[] = []
  try {
    const { headers } = await import('next/headers')
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })
    if (user) {
      const fullUser = await payload.findByID({ collection: 'users', id: user.id, depth: 0 }) as any
      purchasedItemIds = (fullUser.purchasedItems || []).map((i: any) => typeof i === 'string' ? i : i.id)
      purchasedBundleIds = (fullUser.purchasedBundles || []).map((i: any) => typeof i === 'string' ? i : i.id)
    }
  } catch { /* not logged in */ }

  // Fetch categories
  const { docs: categories } = await payload.find({
    collection: 'categories',
    sort: 'sortOrder',
    limit: 50,
  })

  // Build where clause for items
  const where: any = { status: { equals: 'published' } }

  if (activeType) {
    // Check if it's a group filter or specific type
    const groupTypes = Object.values(itemTypeGroups).find((types) => types.includes(activeType))
    if (groupTypes && groupTypes.length > 1) {
      where.itemType = { in: groupTypes }
    } else {
      where.itemType = { equals: activeType }
    }
  }

  if (activeCategory) {
    const matchingCat = categories.find((c: any) => c.slug === activeCategory)
    if (matchingCat) {
      where['categories'] = { contains: matchingCat.id }
    }
  }

  if (activeSearch) {
    where['or'] = [
      { title: { like: activeSearch } },
      { shortDescription: { like: activeSearch } },
    ]
  }

  // Fetch items or bundles
  if (activeView === 'bundles') {
    const { docs: bundles } = await payload.find({
      collection: 'bundles',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 50,
    })

    return (
      <>
        <section className={styles.pageHeader}>
          <div className="container">
            <h1>Shop</h1>
            <p>Seminare, Workshops, Trainings, Materialien und Themenbundles.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <ShopFilters categories={categories as any} currentSearch={activeSearch} />

            {bundles.length === 0 ? (
              <div className={styles.empty}>
                <p>Aktuell sind keine Bundles verfügbar.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {bundles.map((bundle: any) => (
                  <Link href={`/shop/bundle/${bundle.slug}`} key={bundle.id} className={styles.card}>
                    {bundle.image && typeof bundle.image !== 'string' && (
                      <div className={styles.imageWrapper}>
                        <img
                          src={bundle.image.sizes?.card?.url || bundle.image.url}
                          alt={bundle.image.alt || bundle.name}
                          className={styles.image}
                        />
                      </div>
                    )}
                    <div className={styles.content}>
                      <span className="badge badge-product">Bundle</span>
                      <h3 className={styles.title}>{bundle.name}</h3>
                      {bundle.shortDescription && (
                        <p className={styles.description}>{bundle.shortDescription}</p>
                      )}
                      <div className={styles.footer}>
                        <div className={styles.priceGroup}>
                          <span className="price">{formatPrice(bundle.bundlePrice)}</span>
                        </div>
                        {bundle.savingsText && (
                          <span className={styles.savings}>{bundle.savingsText}</span>
                        )}
                      </div>
                      {bundle.installmentEnabled && (
                        <p className={styles.installmentHint}>
                          oder {bundle.installmentCount}x Ratenzahlung möglich
                        </p>
                      )}
                      {purchasedBundleIds.includes(bundle.id) && (
                        <span className={styles.ownedBadge}>Bereits gekauft</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </>
    )
  }

  // Default: Show individual items
  const { docs: items } = await payload.find({
    collection: 'shop-items',
    where,
    sort: 'sortOrder',
    limit: 50,
  })

  return (
    <>
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>Shop</h1>
          <p>Seminare, Workshops, Trainings, Materialien und Themenbundles.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ShopFilters categories={categories as any} currentSearch={activeSearch} />

          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Keine Ergebnisse für diese Filter.</p>
              <p>Versuche andere Filteroptionen.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {items.map((item: any) => {
                const isSoldOut =
                  item.status === 'sold_out' ||
                  (item.eventDetails?.maxParticipants > 0 &&
                    item.eventDetails?.currentParticipants >= item.eventDetails?.maxParticipants)
                return (
                <Link href={`/shop/${item.slug}`} key={item.id} className={styles.card} style={{ position: 'relative' }}>
                  {isSoldOut && (
                    <span className={styles.soldOutOverlay}>Ausgebucht</span>
                  )}
                  {item.image && typeof item.image !== 'string' && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={item.image.sizes?.card?.url || item.image.url}
                        alt={item.image.alt || item.title}
                        className={styles.image}
                      />
                    </div>
                  )}
                  <div className={styles.content}>
                    <div className={styles.meta}>
                      {item.itemType !== 'kunst' && (
                        <span className="badge badge-event">
                          {itemTypeLabels[item.itemType] || item.itemType}
                        </span>
                      )}
                      {item.itemType === 'kunst' && item.categories?.length > 0 && (
                        <span className="badge badge-product">
                          {typeof item.categories[0] === 'string' ? '' : (item.categories[0] as any).name}
                        </span>
                      )}
                      {isEventType(item.itemType) && item.eventDetails?.isOnline && (
                        <span className={styles.online}>Online</span>
                      )}
                    </div>
                    <h3 className={styles.title}>{item.title}</h3>
                    {isEventType(item.itemType) && item.eventDetails?.date && (
                      <p className={styles.date}>{formatDate(item.eventDetails.date)}</p>
                    )}
                    {item.itemType === 'einzeltraining' && item.trainingDetails?.durationWeeks && (
                      <p className={styles.date}>{item.trainingDetails.durationWeeks} Wochen Zugang</p>
                    )}
                    {item.shortDescription && (
                      <p className={styles.description}>{item.shortDescription}</p>
                    )}
                    <div className={styles.footer}>
                      <div className={styles.priceGroup}>
                        {item.pricing?.isFree ? (
                          <span className="price">Kostenlos</span>
                        ) : (
                          <>
                            <span className="price">{formatPrice(item.pricing?.price || 0)}</span>
                            {item.pricing?.comparePrice && (
                              <span className="price-old">{formatPrice(item.pricing.comparePrice)}</span>
                            )}
                          </>
                        )}
                      </div>
                      {isEventType(item.itemType) && item.eventDetails?.maxParticipants && !isSoldOut && (
                        <span className={styles.spots}>
                          {Math.max(0, item.eventDetails.maxParticipants - (item.eventDetails.currentParticipants || 0))}{' '}
                          Plätze frei
                        </span>
                      )}
                    </div>
                    {item.pricing?.installmentEnabled && (
                      <p className={styles.installmentHint}>
                        Ratenzahlung möglich
                      </p>
                    )}
                    {purchasedItemIds.includes(item.id) && (
                      <span className={styles.ownedBadge}>Bereits gekauft</span>
                    )}
                  </div>
                </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
