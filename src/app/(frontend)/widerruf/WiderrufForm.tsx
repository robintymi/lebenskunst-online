'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import styles from './widerruf.module.css'

interface FormData {
  orderNumber: string
  name: string
  email: string
  confirmed: boolean
}

export default function WiderrufForm() {
  const { user } = useAuth()
  const [form, setForm] = useState<FormData>({
    orderNumber: '',
    name: '',
    email: '',
    confirmed: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: [user.firstName, user.lastName].filter(Boolean).join(' '),
        email: user.email || '',
      }))
    }
    const params = new URLSearchParams(window.location.search)
    const orderParam = params.get('bestellung')
    if (orderParam) setForm((prev) => ({ ...prev, orderNumber: orderParam }))
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.confirmed) {
      setErrorMsg('Bitte bestaetige, dass du den Widerruf einlegen moechtest.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/widerruf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderNumber: form.orderNumber,
          name: form.name,
          email: form.email,
        }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte versuche es erneut.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.successBox}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3>Widerruf eingegangen</h3>
        <p>
          Deine Widerrufserklaerung wurde erfolgreich uebermittelt. Du erhaeltst in Kuerze
          eine Eingangsbestaetigung per E-Mail mit Datum und Uhrzeit.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="orderNumber">Bestellnummer *</label>
        <input
          id="orderNumber"
          type="text"
          value={form.orderNumber}
          onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
          placeholder="z.B. LK-2026-0042"
          required
        />
        <span className={styles.hint}>Findest du in deiner Bestellbestaetigung oder im Mitgliederbereich.</span>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">E-Mail *</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className={styles.checkboxField}>
        <input
          id="confirmed"
          type="checkbox"
          checked={form.confirmed}
          onChange={(e) => setForm({ ...form, confirmed: e.target.checked })}
        />
        <label htmlFor="confirmed">
          Hiermit erklaere ich ausdruecklich meinen Widerruf des abgeschlossenen Kaufvertrags.
        </label>
      </div>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Wird uebermittelt ...' : 'Widerruf bestaetigen'}
      </button>
    </form>
  )
}
