'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(139, 111, 71, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            fontSize: '2rem',
          }}
        >
          !
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Etwas ist schiefgelaufen</h1>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
          Bitte versuche es erneut oder kehre zur Startseite zurück.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn btn-primary">
            Erneut versuchen
          </button>
          <Link href="/" className="btn btn-secondary">
            Zur Startseite
          </Link>
        </div>
      </div>
    </section>
  )
}
