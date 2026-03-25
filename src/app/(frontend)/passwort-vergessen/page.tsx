'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './passwort-vergessen.module.css'

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.icon}>✉️</div>
          <h1>E-Mail gesendet</h1>
          <p>
            Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir dir einen
            Link zum Zurücksetzen des Passworts gesendet. Bitte überprüfe auch deinen
            Spam-Ordner.
          </p>
          <Link href="/mitglieder" className={styles.btn}>Zurück zum Login</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Passwort vergessen?</h1>
        <p className={styles.subtitle}>
          Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">E-Mail-Adresse</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="deine@email.de"
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Wird gesendet…' : 'Link anfordern'}
          </button>
        </form>

        <Link href="/mitglieder" className={styles.backLink}>Zurück zum Login</Link>
      </div>
    </main>
  )
}
