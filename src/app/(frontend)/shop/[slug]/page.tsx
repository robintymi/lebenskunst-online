import { getPayloadClient } from '@/lib/payload'
import { formatPrice, formatDate, itemTypeLabels, isEventType, isDigitalType } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AddToCartButton from '@/components/AddToCartButton'
import styles from './detail.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'shop-items',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const item = docs[0]
  if (!item) return { title: 'Nicht gefunden' }
  return { title: item.title, description: (item as any).shortDescription || '' }
}

export default async function ShopItemDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'shop-items',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const item = docs[0] as any
  if (!item) notFound()

  const mainImage = item.image && typeof item.image !== 'string' ? item.image : null
  const isEvent = isEventType(item.itemType)
  const isDigital = isDigitalType(item.itemType)
  const pricing = item.pricing || {}

  const spotsLeft = isEvent && item.eventDetails?.maxParticipants
    ? Math.max(0, item.eventDetails.maxParticipants - (item.eventDetails.currentParticipants || 0))
    : null

  return (
    <section className="section">
      <div className={`container ${styles.layout}`}>
        {/* Image */}
        <div className={styles.imageCol}>
          {mainImage && (
            <div className={styles.mainImage}>
              <img
                src={mainImage.sizes?.hero?.url || mainImage.url}
                alt={mainImage.alt || item.title}
              />
            </div>
          )}
          {item.gallery?.length > 0 && (
            <div className={styles.thumbnails}>
              {item.gallery.map((g: any, i: number) => {
                const img = typeof g.image === 'string' ? null : g.image
                if (!img) return null
                return (
                  <div key={i} className={styles.thumb}>
                    <img src={img.sizes?.thumbnail?.url || img.url} alt={item.title} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div className={styles.info}>
          <span className="badge badge-event">
            {itemTypeLabels[item.itemType] || item.itemType}
          </span>
          <h1 className={styles.title}>{item.title}</h1>

          {/* Event-spezifische Infos */}
          {isEvent && item.eventDetails && (
            <div className={styles.infoGrid}>
              {item.eventDetails.date && (
                <div className={styles.infoItem}>
                  <strong>Datum</strong>
                  <span>{formatDate(item.eventDetails.date)}</span>
                  {item.eventDetails.endDate && (
                    <span>bis {formatDate(item.eventDetails.endDate)}</span>
                  )}
                </div>
              )}
              {item.eventDetails.locationName && (
                <div className={styles.infoItem}>
                  <strong>Ort</strong>
                  <span>{item.eventDetails.locationName}</span>
                  {item.eventDetails.locationAddress && <span>{item.eventDetails.locationAddress}</span>}
                  {item.eventDetails.isOnline && <span className={styles.online}>Online-Event</span>}
                </div>
              )}
              {spotsLeft !== null && (
                <div className={styles.infoItem}>
                  <strong>Verfügbarkeit</strong>
                  <span>{spotsLeft > 0 ? `${spotsLeft} Plätze frei` : 'Ausgebucht'}</span>
                </div>
              )}
            </div>
          )}

          {/* Training-spezifische Infos */}
          {item.itemType === 'einzeltraining' && item.trainingDetails && (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <strong>Zugang</strong>
                <span>{item.trainingDetails.durationWeeks} Wochen nach Kauf</span>
              </div>
              {item.trainingDetails.modules?.length > 0 && (
                <div className={styles.infoItem}>
                  <strong>Module</strong>
                  <span>{item.trainingDetails.modules.length} Lektionen</span>
                </div>
              )}
            </div>
          )}

          {/* Digital-spezifische Infos */}
          {isDigital && item.digitalDetails && (
            <div className={styles.infoGrid}>
              {item.digitalDetails.format && (
                <div className={styles.infoItem}>
                  <strong>Format</strong>
                  <span>{item.digitalDetails.format}</span>
                </div>
              )}
              {item.digitalDetails.duration && (
                <div className={styles.infoItem}>
                  <strong>Umfang</strong>
                  <span>{item.digitalDetails.duration}</span>
                </div>
              )}
            </div>
          )}

          {/* Buch-spezifische Infos */}
          {item.itemType === 'buch' && item.bookDetails && (
            <div className={styles.infoGrid}>
              {item.bookDetails.author && (
                <div className={styles.infoItem}>
                  <strong>Autor/in</strong>
                  <span>{item.bookDetails.author}</span>
                </div>
              )}
              {item.bookDetails.pages && (
                <div className={styles.infoItem}>
                  <strong>Seiten</strong>
                  <span>{item.bookDetails.pages}</span>
                </div>
              )}
              {item.bookDetails.publisher && (
                <div className={styles.infoItem}>
                  <strong>Verlag</strong>
                  <span>{item.bookDetails.publisher}</span>
                </div>
              )}
            </div>
          )}

          {/* Preis & Kauf */}
          <div className={styles.priceSection}>
            <div>
              {pricing.isFree ? (
                <span className="price" style={{ fontSize: '1.5rem' }}>Kostenlos</span>
              ) : (
                <div className={styles.priceGroup}>
                  <span className="price" style={{ fontSize: '1.5rem' }}>{formatPrice(pricing.price || 0)}</span>
                  {pricing.comparePrice && (
                    <span className="price-old" style={{ fontSize: '1rem' }}>{formatPrice(pricing.comparePrice)}</span>
                  )}
                </div>
              )}
              {pricing.installmentEnabled && pricing.installmentCount && (
                <p className={styles.installmentInfo}>
                  oder {pricing.installmentCount}x {formatPrice((pricing.installmentAmount || pricing.price / pricing.installmentCount))} / Monat
                </p>
              )}
            </div>
            <AddToCartButton
              item={{
                id: item.id,
                type: 'shop-item',
                itemType: item.itemType,
                name: item.title,
                price: pricing.price || 0,
                slug: item.slug,
                image: mainImage?.sizes?.thumbnail?.url,
                installmentEnabled: pricing.installmentEnabled,
                installmentCount: pricing.installmentCount,
              }}
              disabled={spotsLeft === 0 || item.status === 'sold_out'}
              label={
                spotsLeft === 0 ? 'Ausgebucht' :
                item.status === 'sold_out' ? 'Ausverkauft' :
                isEvent ? 'Jetzt buchen' :
                pricing.isFree ? 'Kostenlos erhalten' :
                'In den Warenkorb'
              }
            />
          </div>

          {/* Training Module */}
          {item.itemType === 'einzeltraining' && item.trainingDetails?.modules?.length > 0 && (
            <div className={styles.modulesSection}>
              <h2>Inhalte</h2>
              <div className={styles.modulesList}>
                {item.trainingDetails.modules.map((mod: any, i: number) => (
                  <div key={i} className={styles.moduleItem}>
                    <div className={styles.moduleNumber}>Woche {mod.weekNumber || i + 1}</div>
                    <div>
                      <strong>{mod.title}</strong>
                      {mod.description && <p>{mod.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kurzbeschreibung */}
          {item.shortDescription && (
            <p className={styles.shortDesc}>{item.shortDescription}</p>
          )}
        </div>
      </div>
    </section>
  )
}
