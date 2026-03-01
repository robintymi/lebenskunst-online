'use client'

import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import styles from './warenkorb.module.css'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Warenkorb</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Dein Warenkorb ist leer.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/events" className="btn btn-primary">
              Veranstaltungen entdecken
            </Link>
            <Link href="/shop" className="btn btn-secondary">
              Zum Kunstshop
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Warenkorb</h1>

        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                {item.image && (
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                )}
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>
                    <Link
                      href={item.type === 'event' ? `/events/${item.slug}` : `/shop/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <span className={`badge ${item.type === 'event' ? 'badge-event' : 'badge-product'}`}>
                    {item.type === 'event' ? 'Veranstaltung' : 'Produkt'}
                  </span>
                </div>
                <div className={styles.itemQuantity}>
                  {item.type === 'product' ? (
                    <div className={styles.quantityControls}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  ) : (
                    <span className={styles.singleQty}>1x</span>
                  )}
                </div>
                <div className={styles.itemPrice}>
                  <span className="price">{formatPrice(item.price * item.quantity)}</span>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                  aria-label="Entfernen"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h3>Zusammenfassung</h3>
            <div className={styles.summaryRow}>
              <span>Zwischensumme</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <strong>Gesamt</strong>
              <strong className="price" style={{ fontSize: '1.25rem' }}>
                {formatPrice(totalPrice)}
              </strong>
            </div>
            <Link href="/checkout" className="btn btn-accent" style={{ width: '100%' }}>
              Zur Kasse
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
