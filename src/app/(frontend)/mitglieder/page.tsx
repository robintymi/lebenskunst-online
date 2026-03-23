'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import styles from './mitglieder.module.css'

type View = 'login' | 'register' | 'forgot-password'

export default function MitgliederPage() {
  const { isLoggedIn, isLoading, login, register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/mitglieder/dashboard'

  const [view, setView] = useState<View>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  // If already logged in, redirect
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push(redirectTo)
    }
  }, [isLoggedIn, isLoading, router, redirectTo])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await login(
      form.get('email') as string,
      form.get('password') as string,
    )

    if (result.success) {
      router.push(redirectTo)
    } else {
      setError(result.error || 'Anmeldung fehlgeschlagen.')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirm = form.get('confirmPassword') as string

    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
      setLoading(false)
      return
    }

    if (!acceptedTerms) {
      setError('Bitte akzeptiere die Datenschutzerklärung und AGB.')
      setLoading(false)
      return
    }

    const result = await register({
      email: form.get('email') as string,
      password,
      firstName: form.get('firstName') as string,
      lastName: form.get('lastName') as string,
    })

    if (result.success) {
      router.push(redirectTo)
    } else {
      setError(result.error || 'Registrierung fehlgeschlagen.')
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string

    try {
      await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Silently catch — always show the same message
    }

    setForgotSent(true)
    setLoading(false)
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Wird geladen...</p>
        </div>
      </section>
    )
  }

  if (isLoggedIn) {
    return null // Will redirect via useEffect
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>
            {view === 'login' ? 'Anmelden' : view === 'register' ? 'Registrieren' : 'Passwort vergessen'}
          </h1>
          <p className={styles.authSubtitle}>
            {view === 'login'
              ? 'Melde dich an, um auf deinen Mitgliederbereich zuzugreifen.'
              : view === 'register'
                ? 'Erstelle ein Konto, um Veranstaltungen zu buchen und einzukaufen.'
                : 'Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.'}
          </p>

          {error && <p className={styles.error}>{error}</p>}

          {view === 'login' ? (
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="email">E-Mail</label>
                <input id="email" name="email" type="email" className="input" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Passwort</label>
                <input id="password" name="password" type="password" className="input" required />
              </div>
              <p className={styles.forgotLink}>
                <button type="button" onClick={() => { setView('forgot-password'); setError(''); setForgotSent(false) }}>
                  Passwort vergessen?
                </button>
              </p>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Wird angemeldet...' : 'Anmelden'}
              </button>
            </form>
          ) : view === 'register' ? (
            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="firstName">Vorname</label>
                  <input id="firstName" name="firstName" className="input" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="lastName">Nachname</label>
                  <input id="lastName" name="lastName" className="input" required />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="regEmail">E-Mail</label>
                <input id="regEmail" name="email" type="email" className="input" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="regPassword">Passwort</label>
                <input id="regPassword" name="password" type="password" className="input" required minLength={8} />
                <small style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  Mindestens 8 Zeichen
                </small>
              </div>
              <div className={styles.field}>
                <label htmlFor="confirmPassword">Passwort bestätigen</label>
                <input id="confirmPassword" name="confirmPassword" type="password" className="input" required minLength={8} />
              </div>
              <div className={styles.field}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontWeight: 400 }}>
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    style={{ marginTop: '0.25rem', accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Ich akzeptiere die{' '}
                    <a href="/datenschutz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                      Datenschutzerklärung
                    </a>{' '}
                    und{' '}
                    <a href="/agb" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                      AGB
                    </a>
                  </span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Wird registriert...' : 'Registrieren'}
              </button>
            </form>
          ) : (
            <>
              {forgotSent ? (
                <div className={styles.successMessage}>
                  <p>Falls ein Konto mit dieser E-Mail existiert, erhältst du einen Link zum Zurücksetzen.</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className={styles.form}>
                  <div className={styles.field}>
                    <label htmlFor="forgotEmail">E-Mail</label>
                    <input id="forgotEmail" name="email" type="email" className="input" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Wird gesendet...' : 'Link senden'}
                  </button>
                </form>
              )}
            </>
          )}

          <p className={styles.switchView}>
            {view === 'login' ? (
              <>
                Noch kein Konto?{' '}
                <button onClick={() => { setView('register'); setError('') }}>
                  Jetzt registrieren
                </button>
              </>
            ) : view === 'register' ? (
              <>
                Bereits ein Konto?{' '}
                <button onClick={() => { setView('login'); setError('') }}>
                  Anmelden
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setView('login'); setError(''); setForgotSent(false) }}>
                  Zurück zur Anmeldung
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
