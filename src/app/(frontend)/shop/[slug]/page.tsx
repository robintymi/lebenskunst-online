import { getPayloadClient } from '@/lib/payload'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AddToCartButton from '@/components/AddToCartButton'
import styles from './product-detail.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const product = docs[0]
  if (!product) return { title: 'Nicht gefunden' }
  return { title: product.name, description: product.shortDescription || '' }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const product = docs[0] as any
  if (!product) notFound()

  const mainImage = product.images?.[0]?.image

  return (
    <section className="section">
      <div className={`container ${styles.layout}`}>
        <div className={styles.gallery}>
          {mainImage && typeof mainImage !== 'string' && (
            <div className={styles.mainImage}>
              <img
                src={mainImage.sizes?.hero?.url || mainImage.url}
                alt={mainImage.alt || product.name}
              />
            </div>
          )}
          {product.images?.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img: any, i: number) => {
                const imgData = typeof img.image === 'string' ? null : img.image
                if (!imgData) return null
                return (
                  <div key={i} className={styles.thumb}>
                    <img
                      src={imgData.sizes?.thumbnail?.url || imgData.url}
                      alt={img.alt || product.name}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{product.name}</h1>
          {product.details?.artist && (
            <p className={styles.artist}>von {product.details.artist}</p>
          )}

          <div className={styles.priceSection}>
            <span className="price" style={{ fontSize: '1.5rem' }}>
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="price-old" style={{ fontSize: '1rem' }}>
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <AddToCartButton
            item={{
              id: product.id,
              type: 'product',
              name: product.name,
              price: product.price,
              slug: product.slug,
              image: mainImage?.sizes?.thumbnail?.url,
            }}
            disabled={product.stock === 0}
            label={product.stock === 0 ? 'Ausverkauft' : 'In den Warenkorb'}
          />

          {/* Product Details */}
          <div className={styles.detailsSection}>
            {product.details?.dimensions && (
              <div className={styles.detail}>
                <strong>Maße</strong>
                <span>{product.details.dimensions}</span>
              </div>
            )}
            {product.details?.material && (
              <div className={styles.detail}>
                <strong>Material</strong>
                <span>{product.details.material}</span>
              </div>
            )}
            {product.details?.year && (
              <div className={styles.detail}>
                <strong>Jahr</strong>
                <span>{product.details.year}</span>
              </div>
            )}
            <div className={styles.detail}>
              <strong>Versand</strong>
              <span>
                {product.shipping?.isPickupOnly
                  ? 'Nur Abholung'
                  : product.shipping?.shippingCost
                    ? `${formatPrice(product.shipping.shippingCost)} Versandkosten`
                    : 'Kostenloser Versand'}
              </span>
            </div>
          </div>

          {product.shortDescription && (
            <p className={styles.shortDesc}>{product.shortDescription}</p>
          )}
        </div>
      </div>
    </section>
  )
}
