'use client'

import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import Link from 'next/link'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
  })

  const hasProducts = items.some((item) => item.type === 'product')

  if (items.length === 0 && step !== 'success') {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Kasse</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Dein Warenkorb ist leer.</p>
          <Link href="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Veranstaltungen entdecken
          </Link>
        </div>
      </section>
    )
  }

  if (step === 'success') {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>
            Bestellung erfolgreich!
          </h1>
          <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>
            Vielen Dank für deine Bestellung. Du erhältst eine Bestätigung per E-Mail.
          </p>
          <Link href="/" className="btn btn-primary">
            Zurück zur Startseite
          </Link>
        </div>
      </section>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer: formData }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        } else {
          clearCart()
          setStep('success')
        }
      } else {
        setStep('form')
        alert('Es gab einen Fehler. Bitte versuche es erneut.')
      }
    } catch {
      setStep('form')
      alert('Es gab einen Fehler. Bitte versuche es erneut.')
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Kasse</h1>

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

            {hasProducts && (
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
            <button
              type="submit"
              className="btn btn-accent"
              style={{ width: '100%' }}
              disabled={step === 'processing'}
            >
              {step === 'processing' ? 'Wird verarbeitet...' : `${formatPrice(totalPrice)} bezahlen`}
            </button>
            <p className={styles.legalNote}>
              Mit dem Kauf stimmst du unseren{' '}
              <Link href="/agb">AGB</Link> und{' '}
              <Link href="/datenschutz">Datenschutzbestimmungen</Link> zu.
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
