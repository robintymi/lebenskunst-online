'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './passwort-reset.module.css'

export default function PasswortResetPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirmPassword = form.get('confirmPassword') as string

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json().catch(() => null)
        setError(
          data?.errors?.[0]?.message ||
          'Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.'
        )
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
    }

    setLoading(false)
  }

  if (!token) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className={styles.resetCard}>
            <h1 className={styles.resetTitle}>Ungültiger Link</h1>
            <p className={styles.resetSubtitle}>
              Kein Token gefunden. Bitte fordere einen neuen Link zum Zurücksetzen an.
            </p>
            <p className={styles.backLink}>
              <Link href="/mitglieder">Zur Anmeldung</Link>
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className={styles.resetCard}>
          <h1 className={styles.resetTitle}>Neues Passwort setzen</h1>
          <p className={styles.resetSubtitle}>
            Gib dein neues Passwort ein.
          </p>

          {error && <p className={styles.error}>{error}</p>}

          {success ? (
            <div className={styles.successMessage}>
              <p>Passwort erfolgreich geändert!</p>
              <Link href="/mitglieder">Zur Anmeldung</Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="password">Neues Passwort</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input"
                  required
                  minLength={8}
                />
                <small style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  Mindestens 8 Zeichen
                </small>
              </div>
              <div className={styles.field}>
                <label htmlFor="confirmPassword">Passwort bestätigen</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input"
                  required
                  minLength={8}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Wird gespeichert...' : 'Passwort ändern'}
              </button>
            </form>
          )}

          {!success && (
            <p className={styles.backLink}>
              <Link href="/mitglieder">Zurück zur Anmeldung</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
