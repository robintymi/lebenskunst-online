'use client'

import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, hasInstallmentItems } = useCart()
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

  // Handle Stripe return with success param
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      clearCart()
      setStep('success')
    }
  }, [searchParams, clearCart])

  // Pre-fill form with user data
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

  const hasPhysicalProducts = items.some((item) => item.itemType === 'buch')

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
            Vielen Dank für deine Bestellung. Deine Inhalte sind sofort verfügbar.
          </p>
          <p style={{ marginBottom: '2rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
            Eine Bestellbestätigung wurde an deine E-Mail-Adresse gesendet.
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

  // Require login before checkout
  if (!isLoggedIn) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ marginBottom: '1rem' }}>Anmelden</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Bitte melde dich an oder registriere dich, um deine Bestellung abzuschließen.
          </p>
          <Link
            href={`/mitglieder?redirect=/checkout`}
            className="btn btn-primary"
            style={{ marginRight: '1rem' }}
          >
            Anmelden
          </Link>
          <Link href="/warenkorb" className="btn btn-secondary">
            Zurück zum Warenkorb
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

  // Calculate installment info
  const installmentItem = items.find((i) => i.installmentEnabled && i.installmentCount)
  const installmentMonthly = installmentItem
    ? totalPrice / (installmentItem.installmentCount || 1)
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
                  <label htmlFor="street">Straße + Hausnummer *</label>
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
                      title="Bitte gib eine gültige PLZ ein (5 Ziffern)"
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

            {/* Zahlungsart */}
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
                      <span>{formatPrice(totalPrice)}</span>
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
            <div className={styles.orderTotal}>
              <strong>Gesamt</strong>
              <strong className="price">{formatPrice(totalPrice)}</strong>
            </div>
            {paymentType === 'installment' && installmentItem && (
              <div className={styles.installmentSummary}>
                {installmentItem.installmentCount}x {formatPrice(installmentMonthly)} / Monat
              </div>
            )}
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
                  Ich stimme ausdrücklich zu, dass die Bereitstellung digitaler Inhalte sofort
                  beginnt und ich damit mein Widerrufsrecht verliere.
                </span>
              </label>
            </div>
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
                  <Link href="/datenschutz" target="_blank">Datenschutzerklärung</Link>{' '}
                  gelesen
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%' }}
              disabled={step === 'processing' || !agbAccepted || !datenschutzAccepted || !widerrufsAccepted}
            >
              {step === 'processing'
                ? 'Wird verarbeitet...'
                : paymentType === 'installment'
                  ? `${formatPrice(installmentMonthly)} / Monat starten`
                  : `${formatPrice(totalPrice)} bezahlen`}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
