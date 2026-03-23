export default function Loading() {
  return (
    <section
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'loading-spin 0.8s linear infinite',
        }}
      />
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
        }}
      >
        Wird geladen...
      </p>

      <style>{`
        @keyframes loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
