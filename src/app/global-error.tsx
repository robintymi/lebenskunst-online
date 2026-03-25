'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="de">
      <body style={{ fontFamily: 'Georgia, serif', background: '#FFF5F5', margin: 0 }}>
        <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>⚡</div>
            <h1 style={{ fontSize: '32px', color: '#BE465A', marginBottom: '12px' }}>Ein Fehler ist aufgetreten</h1>
            <p style={{ color: '#888', marginBottom: '32px', lineHeight: '1.6' }}>
              Bitte versuche es erneut.
            </p>
            <button onClick={reset} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #BE465A, #D4707A)', color: 'white', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
              Erneut versuchen
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
