'use client'

import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatPrice, getShippingCost, isImmediateAccessType, isPhysicalType } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const { items, clearCart, hasInstallmentItems, appliedDiscount, finalPrice } = useCart()
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [error, setError] = useState('')
  const [paymentType, setPaymentType] = useState<'full' | 'installment'>('full')
  const [agbAccepted, setAgbAccepted] = useState(false)
  const [datenschutzAccepted, setDatenschutzAccepted] = useState(false)
  const [widerrufsAccepted, setWiderrufsAccepted] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
  })

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      clearCart()
      setStep('success')
    }
  }, [searchParams, clearCart])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
      }))
    }
  }, [user])

  const hasPhysicalProducts = items.some((item) => isPhysicalType(item.itemType || ''))
  const hasImmediateAccessItems = items.some((item) => isImmediateAccessType(item.itemType || ''))
  const shippingCost = getShippingCost(finalPrice, hasPhysicalProducts)
  const totalWithShipping = finalPrice + shippingCost

  if (authLoading) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Wird geladen...</p>
        </div>
      </section>
    )
  }

  if (step === 'success') {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>
            Bestellung erfolgreich!
          </h1>
          <p style={{ marginBottom: '0.75rem', color: 'var(--color-text-light)' }}>
            Vielen Dank fuer deine Bestellung!
          </p>
          <p style={{ marginBottom: '2rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
            Eine Bestellbestaetigung wurde an deine E-Mail-Adresse gesendet.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/mitglieder/dashboard/inhalte" className="btn btn-primary">
              Jetzt zu meinen Inhalten
            </Link>
            <Link href="/mitglieder/dashboard/bestellungen" className="btn btn-secondary">
              Bestellung ansehen
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Kasse</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Dein Warenkorb ist leer.</p>
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Zum Shop
          </Link>
        </div>
      </section>
    )
  }

  if (!isLoggedIn) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ marginBottom: '1rem' }}>Anmelden</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Bitte melde dich an oder registriere dich, um deine Bestellung abzuschliessen.
          </p>
          <Link
            href={`/mitglieder?redirect=/checkout`}
            className="btn btn-primary"
            style={{ marginRight: '1rem' }}
          >
            Anmelden
          </Link>
          <Link href="/warenkorb" className="btn btn-secondary">
            Zurueck zum Warenkorb
          </Link>
        </div>
      </section>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items,
          customer: formData,
          paymentType,
          userId: user?.id,
          discountCode: appliedDiscount?.code,
        }),
      })

      const data = await res.json()

      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setStep('form')
        setError(data.error || 'Es gab einen Fehler. Bitte versuche es erneut.')
      }
    } catch {
      setStep('form')
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const installmentItems = items.filter((item) => item.installmentEnabled && item.installmentCount)
  const installmentCount = installmentItems.length > 0
    ? Math.max(...installmentItems.map((item) => item.installmentCount || 1))
    : 1
  const installmentItem = installmentItems.length > 0 ? installmentItems[0] : null
  const installmentMonthly = installmentItem
    ? Math.round((totalWithShipping / installmentCount) * 100) / 100
    : 0

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Kasse</h1>

        {error && (
          <div style={{
            background: '#fdf2f2',
            color: 'var(--color-error)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.layout}>
          <div className={styles.formSection}>
            <h2>Kontaktdaten</h2>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="firstName">Vorname *</label>
                <input
                  id="firstName"
                  className="input"
                  required
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="lastName">Nachname *</label>
                <input
                  id="lastName"
                  className="input"
                  required
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="email">E-Mail *</label>
              <input
                id="email"
                type="email"
                className="input"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Telefon</label>
              <input
                id="phone"
                type="tel"
                className="input"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            {hasPhysicalProducts && (
              <>
                <h2 style={{ marginTop: '1.5rem' }}>Lieferadresse</h2>
                <div className={styles.field}>
                  <label htmlFor="street">Strasse + Hausnummer *</label>
                  <input
                    id="street"
                    className="input"
                    required
                    value={formData.street}
                    onChange={(e) => updateField('street', e.target.value)}
                  />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field} style={{ flex: '0 0 120px' }}>
                    <label htmlFor="zip">PLZ *</label>
                    <input
                      id="zip"
                      className="input"
                      required
                      pattern="[0-9]{5}"
                      title="Bitte gib eine gueltige PLZ ein (5 Ziffern)"
                      value={formData.zip}
                      onChange={(e) => updateField('zip', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="city">Stadt *</label>
                    <input
                      id="city"
                      className="input"
                      required
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {hasInstallmentItems && (
              <>
                <h2 style={{ marginTop: '1.5rem' }}>Zahlungsart</h2>
                <div className={styles.paymentOptions}>
                  <label className={`${styles.paymentOption} ${paymentType === 'full' ? styles.paymentActive : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={paymentType === 'full'}
                      onChange={() => setPaymentType('full')}
                    />
                    <div>
                      <strong>Einmalzahlung</strong>
                      <span>{formatPrice(totalWithShipping)}</span>
                    </div>
                  </label>
                  <label className={`${styles.paymentOption} ${paymentType === 'installment' ? styles.paymentActive : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="installment"
                      checked={paymentType === 'installment'}
                      onChange={() => setPaymentType('installment')}
                    />
                    <div>
                      <strong>Ratenzahlung</strong>
                      <span>
                        {installmentItem?.installmentCount}x {formatPrice(installmentMonthly)} / Monat
                      </span>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          <div className={styles.orderSummary}>
            <h3>Deine Bestellung</h3>
            {items.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <span>
                  {item.name} {item.quantity > 1 && `(${item.quantity}x)`}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            {appliedDiscount && (
              <div className={styles.orderItem} style={{ color: '#16a34a' }}>
                <span>Rabatt ({appliedDiscount.code})</span>
                <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
              </div>
            )}
            {hasPhysicalProducts && (
              <div className={styles.orderItem}>
                <span>Versand</span>
                <span>{shippingCost === 0 ? 'Kostenlos' : formatPrice(shippingCost)}</span>
              </div>
            )}
            <div className={styles.orderTotal}>
              <strong>Gesamt</strong>
              <strong className="price">{formatPrice(totalWithShipping)}</strong>
            </div>
            {paymentType === 'installment' && installmentItem && (
              <div className={styles.installmentSummary}>
                {installmentCount}x {formatPrice(installmentMonthly)} / Monat
              </div>
            )}
            {hasPhysicalProducts && (
              <p className={styles.installmentSummary}>
                Versandkostenfrei ab {formatPrice(100)}, darunter {formatPrice(5.9)}. Kein Mindestbestellwert.
              </p>
            )}
            {hasImmediateAccessItems && (
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={widerrufsAccepted}
                    onChange={(e) => setWiderrufsAccepted(e.target.checked)}
                    className={styles.checkbox}
                    required
                  />
                  <span>
                    Ich stimme ausdruecklich zu, dass digitale Inhalte oder sofort freigeschaltete Leistungen direkt bereitgestellt werden und ich dadurch mein Widerrufsrecht insoweit verliere.
                  </span>
                </label>
              </div>
            )}
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={agbAccepted}
                  onChange={(e) => setAgbAccepted(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>
                  Ich akzeptiere die{' '}
                  <Link href="/agb" target="_blank">AGB</Link>
                </span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={datenschutzAccepted}
                  onChange={(e) => setDatenschutzAccepted(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>
                  Ich habe die{' '}
                  <Link href="/datenschutz" target="_blank">Datenschutzerklaerung</Link>{' '}
                  gelesen
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%' }}
              disabled={step === 'processing' || !agbAccepted || !datenschutzAccepted || (hasImmediateAccessItems && !widerrufsAccepted)}
            >
              {step === 'processing'
                ? 'Wird verarbeitet...'
                : paymentType === 'installment'
                  ? `${formatPrice(installmentMonthly)} / Monat starten`
                  : `${formatPrice(totalWithShipping)} bezahlen`}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
