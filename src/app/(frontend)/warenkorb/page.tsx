'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { formatPrice, itemTypeLabels, isEventType } from '@/lib/utils'
import Link from 'next/link'
import styles from './warenkorb.module.css'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, appliedDiscount, applyDiscount, removeDiscount, finalPrice } = useCart()
  const [discountCode, setDiscountCode] = useState('')
  const [discountError, setDiscountError] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return
    setDiscountLoading(true)
    setDiscountError('')
    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode.trim(), cartTotal: totalPrice }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        applyDiscount({
          code: data.code,
          type: data.type,
          value: data.value,
          discountAmount: data.discountAmount,
        })
        setDiscountCode('')
      } else {
        setDiscountError(data.error || 'Ungültiger Code')
      }
    } catch {
      setDiscountError('Fehler beim Prüfen des Codes')
    } finally {
      setDiscountLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Warenkorb</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Dein Warenkorb ist leer.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Zum Shop
          </Link>
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
            {items.map((item) => {
              const isSingle =
                item.type === 'bundle' ||
                isEventType(item.itemType || '') ||
                item.itemType === 'einzeltraining'

              return (
                <div key={item.id} className={styles.item}>
                  {item.image && (
                    <div className={styles.itemImage}>
                      <img src={item.image} alt={item.name} />
                    </div>
                  )}
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>
                      <Link
                        href={
                          item.type === 'bundle'
                            ? `/shop/bundle/${item.slug}`
                            : `/shop/${item.slug}`
                        }
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <span className="badge badge-event">
                      {item.type === 'bundle'
                        ? 'Bundle'
                        : itemTypeLabels[item.itemType || ''] || 'Produkt'}
                    </span>
                  </div>
                  <div className={styles.itemQuantity}>
                    {!isSingle ? (
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
              )
            })}
          </div>

          <div className={styles.summary}>
            <h3>Zusammenfassung</h3>
            <div className={styles.summaryRow}>
              <span>Zwischensumme</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            {appliedDiscount ? (
              <div className={styles.discountApplied}>
                <div className={styles.discountRow}>
                  <span>Rabatt ({appliedDiscount.code})</span>
                  <span className={styles.discountAmount}>−{formatPrice(appliedDiscount.discountAmount)}</span>
                </div>
                <button className={styles.removeDiscount} onClick={removeDiscount}>
                  Entfernen
                </button>
              </div>
            ) : (
              <div className={styles.discountInput}>
                <input
                  className="input"
                  placeholder="Rabattcode"
                  value={discountCode}
                  onChange={(e) => { setDiscountCode(e.target.value); setDiscountError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                  style={{ fontSize: '0.9rem' }}
                />
                <button
                  className={styles.applyBtn}
                  onClick={handleApplyDiscount}
                  disabled={discountLoading || !discountCode.trim()}
                >
                  {discountLoading ? '...' : 'Einlösen'}
                </button>
                {discountError && <p className={styles.discountError}>{discountError}</p>}
              </div>
            )}

            <div className={`${styles.summaryRow} ${styles.total}`}>
              <strong>Gesamt</strong>
              <strong className="price" style={{ fontSize: '1.25rem' }}>
                {formatPrice(finalPrice)}
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
