import { getPayloadClient } from '@/lib/payload'
import { formatPrice, formatDate, eventTypeLabels } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AddToCartButton from '@/components/AddToCartButton'
import styles from './event-detail.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const event = docs[0]
  if (!event) return { title: 'Nicht gefunden' }
  return { title: event.title, description: event.shortDescription || '' }
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const event = docs[0] as any
  if (!event) notFound()

  const spotsLeft = event.maxParticipants
    ? Math.max(0, event.maxParticipants - (event.currentParticipants || 0))
    : null

  return (
    <section className="section">
      <div className={`container ${styles.layout}`}>
        {event.image && typeof event.image !== 'string' && (
          <div className={styles.imageWrapper}>
            <img
              src={event.image.sizes?.hero?.url || event.image.url}
              alt={event.image.alt || event.title}
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.details}>
          <span className="badge badge-event">
            {eventTypeLabels[event.eventType] || event.eventType}
          </span>
          <h1 className={styles.title}>{event.title}</h1>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Datum</strong>
              <span>{formatDate(event.date)}</span>
              {event.endDate && <span>bis {formatDate(event.endDate)}</span>}
            </div>
            {event.location?.name && (
              <div className={styles.infoItem}>
                <strong>Ort</strong>
                <span>{event.location.name}</span>
                {event.location.address && <span>{event.location.address}</span>}
                {event.location.isOnline && <span className={styles.online}>Online-Event</span>}
              </div>
            )}
            {spotsLeft !== null && (
              <div className={styles.infoItem}>
                <strong>Verfügbarkeit</strong>
                <span>
                  {spotsLeft > 0 ? `${spotsLeft} von ${event.maxParticipants} Plätzen frei` : 'Ausgebucht'}
                </span>
              </div>
            )}
          </div>

          <div className={styles.priceSection}>
            <span className="price" style={{ fontSize: '1.5rem' }}>{formatPrice(event.price)}</span>
            <AddToCartButton
              item={{
                id: event.id,
                type: 'event',
                name: event.title,
                price: event.price,
                slug: event.slug,
                image: event.image?.sizes?.thumbnail?.url,
              }}
              disabled={spotsLeft === 0}
              label={spotsLeft === 0 ? 'Ausgebucht' : 'Jetzt buchen'}
            />
          </div>

          {event.description && (
            <div className={styles.description}>
              <h2>Beschreibung</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    typeof event.description === 'string'
                      ? event.description
                      : '<p>Beschreibung verfügbar nach dem Laden.</p>',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
