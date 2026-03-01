import { getPayloadClient } from '@/lib/payload'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './shop.module.css'

export const metadata: Metadata = {
  title: 'Kunstshop',
  description: 'Einzigartige Kunstgegenstände — handgemacht mit Seele.',
}

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const payload = await getPayloadClient()

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
  })

  return (
    <>
      <section className={styles.pageHeader}>
        <div className="container">
          <h1>Kunstshop</h1>
          <p>Einzigartige Kunstgegenstände — handgemacht mit Seele.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {products.length === 0 ? (
            <div className={styles.empty}>
              <p>Der Shop wird gerade eingerichtet.</p>
              <p>Schau bald wieder vorbei!</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((product: any) => {
                const mainImage = product.images?.[0]?.image
                return (
                  <Link
                    href={`/shop/${product.slug}`}
                    key={product.id}
                    className={styles.productCard}
                  >
                    {mainImage && typeof mainImage !== 'string' && (
                      <div className={styles.imageWrapper}>
                        <img
                          src={mainImage.sizes?.card?.url || mainImage.url}
                          alt={mainImage.alt || product.name}
                          className={styles.image}
                        />
                      </div>
                    )}
                    <div className={styles.content}>
                      <h3 className={styles.name}>{product.name}</h3>
                      {product.details?.artist && (
                        <p className={styles.artist}>{product.details.artist}</p>
                      )}
                      {product.shortDescription && (
                        <p className={styles.description}>{product.shortDescription}</p>
                      )}
                      <div className={styles.footer}>
                        <div className={styles.priceGroup}>
                          <span className="price">{formatPrice(product.price)}</span>
                          {product.comparePrice && (
                            <span className="price-old">{formatPrice(product.comparePrice)}</span>
                          )}
                        </div>
                        {product.stock === 0 && (
                          <span className="badge badge-sold-out">Ausverkauft</span>
                        )}
                      </div>
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
