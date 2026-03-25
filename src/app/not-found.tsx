import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#FFF5F5' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🌿</div>
        <h1 style={{ fontSize: '32px', color: '#BE465A', marginBottom: '12px' }}>Seite nicht gefunden</h1>
        <p style={{ color: '#888', marginBottom: '32px', lineHeight: '1.6' }}>
          Diese Seite existiert nicht oder wurde verschoben.
        </p>
        <Link href="/" style={{ display: 'inline-block', padding: '12px 32px', background: 'linear-gradient(135deg, #BE465A, #D4707A)', color: 'white', borderRadius: '999px', textDecoration: 'none', fontWeight: 600 }}>
          Zur Startseite
        </Link>
      </div>
    </main>
  )
}
