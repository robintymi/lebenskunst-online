import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <p
          className="gradient-text"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(6rem, 15vw, 10rem)',
            fontWeight: 600,
            lineHeight: 1,
            marginBottom: '1rem',
          }}
        >
          404
        </p>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Seite nicht gefunden</h1>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
          Die Seite, die du suchst, existiert leider nicht.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
          <Link href="/shop" className="btn btn-secondary">
            Zum Shop
          </Link>
        </div>
      </div>
    </section>
  )
}
