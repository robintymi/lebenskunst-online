import { getPayloadClient } from '@/lib/payload'
import { formatPrice, itemTypeLabels } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import styles from './bundle-detail.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'bundles',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const bundle = docs[0]
  if (!bundle) return { title: 'Nicht gefunden' }
  return { title: bundle.name, description: (bundle as any).shortDescription || '' }
}

export default async function BundleDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'bundles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const bundle = docs[0] as any
  if (!bundle) notFound()

  const mainImage = bundle.image && typeof bundle.image !== 'string' ? bundle.image : null

  // Calculate total individual price
  const individualTotal = (bundle.items || []).reduce((sum: number, item: any) => {
    if (typeof item === 'string') return sum
    return sum + (item.pricing?.price || 0)
  }, 0)

  const savings = individualTotal - bundle.bundlePrice

  return (
    <section className="section">
      <div className={`container ${styles.layout}`}>
        {mainImage && (
          <div className={styles.imageWrapper}>
            <img src={mainImage.sizes?.hero?.url || mainImage.url} alt={mainImage.alt || bundle.name} />
          </div>
        )}

        <div className={styles.info}>
          <span className="badge badge-product">Themenbundle</span>
          <h1 className={styles.title}>{bundle.name}</h1>

          {bundle.shortDescription && (
            <p className={styles.subtitle}>{bundle.shortDescription}</p>
          )}

          <div className={styles.priceSection}>
            <div>
              <span className="price" style={{ fontSize: '1.75rem' }}>
                {formatPrice(bundle.bundlePrice)}
              </span>
              {individualTotal > 0 && (
                <p className={styles.savingsText}>
                  Statt {formatPrice(individualTotal)} einzeln — du sparst {formatPrice(savings)}
                </p>
              )}
              {bundle.installmentEnabled && bundle.installmentCount && (
                <p className={styles.installmentInfo}>
                  oder {bundle.installmentCount}x {formatPrice(bundle.bundlePrice / bundle.installmentCount)} / Monat
                </p>
              )}
            </div>
            <AddToCartButton
              item={{
                id: bundle.id,
                type: 'bundle',
                name: bundle.name,
                price: bundle.bundlePrice,
                slug: bundle.slug,
                image: mainImage?.sizes?.thumbnail?.url,
                installmentEnabled: bundle.installmentEnabled,
                installmentCount: bundle.installmentCount,
              }}
              label="Bundle kaufen"
            />
          </div>

          {/* Enthaltene Items */}
          {bundle.items?.length > 0 && (
            <div className={styles.itemsSection}>
              <h2>Im Bundle enthalten ({bundle.items.length} Items)</h2>
              <div className={styles.itemsList}>
                {bundle.items.map((item: any) => {
                  if (typeof item === 'string') return null
                  return (
                    <Link href={`/shop/${item.slug}`} key={item.id} className={styles.bundleItem}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemType}>
                          {itemTypeLabels[item.itemType] || item.itemType}
                        </span>
                        <strong>{item.title}</strong>
                        {item.shortDescription && (
                          <p>{item.shortDescription}</p>
                        )}
                      </div>
                      <span className={styles.itemPrice}>
                        {formatPrice(item.pricing?.price || 0)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
