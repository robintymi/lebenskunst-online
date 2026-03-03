import { getPayloadClient } from '@/lib/payload'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './podcast.module.css'

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'Der Lebenskunst Podcast — Impulse für dein persönliches Wachstum.',
}

export const dynamic = 'force-dynamic'

export default async function PodcastPage() {
  const payload = await getPayloadClient()

  const { docs: episodes } = await payload.find({
    collection: 'podcasts',
    where: { status: { equals: 'published' } },
    sort: '-publishDate',
    limit: 50,
  })

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Lebenskunst Podcast</h1>
          <p className={styles.heroText}>
            Impulse, Gespräche und Inspirationen für dein persönliches Wachstum
            und deine Reise zu dir selbst.
          </p>
          <div className={styles.platforms}>
            <a href="#" className="btn btn-primary">Spotify</a>
            <a href="#" className="btn btn-secondary">Apple Podcasts</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className={styles.sectionTitle}>Alle Episoden</h2>

          {episodes.length === 0 ? (
            <div className={styles.empty}>
              <p>Bald erscheinen hier neue Episoden.</p>
              <p>Folge uns auf Spotify, um keine Episode zu verpassen!</p>
            </div>
          ) : (
            <div className={styles.episodeList}>
              {episodes.map((ep: any) => (
                <div key={ep.id} className={styles.episode}>
                  {ep.coverImage && typeof ep.coverImage !== 'string' && (
                    <div className={styles.episodeImage}>
                      <img
                        src={ep.coverImage.sizes?.thumbnail?.url || ep.coverImage.url}
                        alt={ep.coverImage.alt || ep.title}
                      />
                    </div>
                  )}
                  <div className={styles.episodeContent}>
                    <div className={styles.episodeMeta}>
                      {ep.episodeNumber && (
                        <span className={styles.episodeNumber}>Episode {ep.episodeNumber}</span>
                      )}
                      {ep.duration && <span className={styles.duration}>{ep.duration}</span>}
                    </div>
                    <h3 className={styles.episodeTitle}>{ep.title}</h3>
                    {ep.shortDescription && (
                      <p className={styles.episodeDesc}>{ep.shortDescription}</p>
                    )}
                    <div className={styles.episodeActions}>
                      {ep.spotifyUrl && (
                        <a href={ep.spotifyUrl} target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                          Spotify
                        </a>
                      )}
                      {ep.applePodcastsUrl && (
                        <a href={ep.applePodcastsUrl} target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                          Apple Podcasts
                        </a>
                      )}
                      {ep.audioUrl && (
                        <audio controls className={styles.audioPlayer}>
                          <source src={ep.audioUrl} />
                        </audio>
                      )}
                    </div>
                    {ep.relatedItems?.length > 0 && (
                      <div className={styles.relatedItems}>
                        <span>Passend dazu:</span>
                        {ep.relatedItems.map((ri: any) => {
                          const related = typeof ri === 'string' ? null : ri
                          if (!related) return null
                          return (
                            <Link key={related.id} href={`/shop/${related.slug}`} className={styles.relatedLink}>
                              {related.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
