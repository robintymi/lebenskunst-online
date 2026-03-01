'use client'

import { useState } from 'react'
import styles from './mitglieder.module.css'

type View = 'login' | 'register' | 'dashboard'

export default function MitgliederPage() {
  const [view, setView] = useState<View>('login')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setView('dashboard')
      } else {
        setError('E-Mail oder Passwort falsch.')
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
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

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password,
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          role: 'member',
        }),
      })

      if (res.ok) {
        // Auto-login after registration
        const loginRes = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.get('email'),
            password,
          }),
          credentials: 'include',
        })
        if (loginRes.ok) {
          const data = await loginRes.json()
          setUser(data.user)
          setView('dashboard')
        }
      } else {
        const data = await res.json()
        setError(data.errors?.[0]?.message || 'Registrierung fehlgeschlagen.')
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    setView('login')
  }

  // Dashboard view
  if (view === 'dashboard' && user) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className={styles.dashboardHeader}>
            <div>
              <h1>Hallo, {user.firstName || user.email}!</h1>
              <p className={styles.subtitle}>Willkommen in deinem Mitgliederbereich.</p>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Abmelden
            </button>
          </div>

          <div className={styles.dashboardGrid}>
            <div className={styles.dashboardCard}>
              <h3>Meine Veranstaltungen</h3>
              <p>Hier findest du deine gebuchten Veranstaltungen.</p>
              {user.bookedEvents?.length > 0 ? (
                <ul className={styles.eventList}>
                  {user.bookedEvents.map((event: any) => (
                    <li key={typeof event === 'string' ? event : event.id}>
                      {typeof event === 'string' ? event : event.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyState}>Noch keine Veranstaltungen gebucht.</p>
              )}
            </div>

            <div className={styles.dashboardCard}>
              <h3>Meine Bestellungen</h3>
              <p>Übersicht deiner Einkäufe im Kunstshop.</p>
              <p className={styles.emptyState}>Noch keine Bestellungen vorhanden.</p>
            </div>

            <div className={styles.dashboardCard}>
              <h3>Mein Profil</h3>
              <div className={styles.profileInfo}>
                <div>
                  <strong>E-Mail</strong>
                  <span>{user.email}</span>
                </div>
                {user.firstName && (
                  <div>
                    <strong>Name</strong>
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Login/Register views
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>
            {view === 'login' ? 'Anmelden' : 'Registrieren'}
          </h1>
          <p className={styles.authSubtitle}>
            {view === 'login'
              ? 'Melde dich an, um auf deinen Mitgliederbereich zuzugreifen.'
              : 'Erstelle ein Konto, um Veranstaltungen zu buchen und einzukaufen.'}
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
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Wird angemeldet...' : 'Anmelden'}
              </button>
            </form>
          ) : (
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
              </div>
              <div className={styles.field}>
                <label htmlFor="confirmPassword">Passwort bestätigen</label>
                <input id="confirmPassword" name="confirmPassword" type="password" className="input" required minLength={8} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Wird registriert...' : 'Registrieren'}
              </button>
            </form>
          )}

          <p className={styles.switchView}>
            {view === 'login' ? (
              <>
                Noch kein Konto?{' '}
                <button onClick={() => { setView('register'); setError('') }}>
                  Jetzt registrieren
                </button>
              </>
            ) : (
              <>
                Bereits ein Konto?{' '}
                <button onClick={() => { setView('login'); setError('') }}>
                  Anmelden
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
