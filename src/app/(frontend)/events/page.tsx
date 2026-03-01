import { getPayloadClient } from '@/lib/payload'
import { formatPrice, formatDate, eventTypeLabels } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './events.module.css'

export const metadata: Metadata = {
  title: 'Veranstaltungen',
  description: 'Workshops, Frauenkreise, Breathwork und mehr — entdecke unsere Veranstaltungen.',
}

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const payload = await getPayloadClient()

  const { docs: events } = await payload.find({
    collection: 'events',
    where: { status: { equals: 'published' } },
    sort: 'date',
    limit: 50,
  })

  return (
    <>
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>Veranstaltungen</h1>
          <p>
            Entdecke Workshops, Frauenkreise, Breathwork-Sessions und mehr — live und online.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {events.length === 0 ? (
            <div className={styles.empty}>
              <p>Aktuell sind keine Veranstaltungen geplant.</p>
              <p>Schau bald wieder vorbei!</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {events.map((event: any) => (
                <Link
                  href={`/events/${event.slug}`}
                  key={event.id}
                  className={styles.eventCard}
                >
                  {event.image && typeof event.image !== 'string' && (
                    <div className={styles.imageWrapper}>
                      <img
                        src={event.image.sizes?.card?.url || event.image.url}
                        alt={event.image.alt || event.title}
                        className={styles.image}
                      />
                    </div>
                  )}
                  <div className={styles.content}>
                    <div className={styles.meta}>
                      <span className="badge badge-event">
                        {eventTypeLabels[event.eventType] || event.eventType}
                      </span>
                      {event.location?.isOnline && (
                        <span className={styles.online}>Online</span>
                      )}
                    </div>
                    <h3 className={styles.title}>{event.title}</h3>
                    <p className={styles.date}>{formatDate(event.date)}</p>
                    {event.shortDescription && (
                      <p className={styles.description}>{event.shortDescription}</p>
                    )}
                    <div className={styles.footer}>
                      <span className="price">{formatPrice(event.price)}</span>
                      {event.maxParticipants && (
                        <span className={styles.spots}>
                          {Math.max(0, event.maxParticipants - (event.currentParticipants || 0))}{' '}
                          Plätze frei
                        </span>
                      )}
                    </div>
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
