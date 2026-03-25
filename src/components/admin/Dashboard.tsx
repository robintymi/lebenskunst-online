'use client'

import { useEffect, useState } from 'react'

interface Stats {
  revenueToday: number
  revenueMonth: number
  ordersTotal: number
  ordersPending: number
  ordersPaymentFailed: number
  newUsersMonth: number
  upcomingEvents: { title: string; date: string; participants: number; max: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [csvFrom, setCsvFrom] = useState('')
  const [csvTo, setCsvTo] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (n: number) => `€${n.toFixed(2).replace('.', ',')}`

  const downloadCSV = () => {
    const params = new URLSearchParams()
    if (csvFrom) params.set('from', csvFrom)
    if (csvTo) params.set('to', csvTo)
    window.open(`/api/admin/export-orders?${params}`, '_blank')
  }

  const cardStyle = {
    background: 'white',
    border: '1px solid #f0e0e0',
    borderRadius: '12px',
    padding: '20px',
  }

  return (
    <div style={{ padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: '1100px' }}>
      <h1 style={{ fontSize: '26px', color: '#BE465A', marginBottom: '4px' }}>Übersicht</h1>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '32px' }}>
        {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {loading && <p style={{ color: '#aaa' }}>Wird geladen…</p>}

      {stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {[
              { label: 'Einnahmen heute', value: fmt(stats.revenueToday), color: '#BE465A' },
              { label: 'Einnahmen diesen Monat', value: fmt(stats.revenueMonth), color: '#BE465A' },
              { label: 'Bestellungen gesamt', value: String(stats.ordersTotal), color: '#333' },
              { label: 'Ausstehende Zahlungen', value: String(stats.ordersPending), color: stats.ordersPending > 0 ? '#e67e22' : '#27ae60' },
              { label: 'Zahlungsfehler', value: String(stats.ordersPaymentFailed), color: stats.ordersPaymentFailed > 0 ? '#e74c3c' : '#27ae60' },
              { label: 'Neue Mitglieder (Monat)', value: String(stats.newUsersMonth), color: '#333' },
            ].map((card) => (
              <div key={card.label} style={cardStyle}>
                <div style={{ fontSize: '30px', fontWeight: '700', color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{card.label}</div>
              </div>
            ))}
          </div>

          {stats.upcomingEvents.length > 0 && (
            <div style={{ ...cardStyle, marginBottom: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', color: '#2d1b1b' }}>Bevorstehende Events</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f5eded' }}>
                    {['Event', 'Datum', 'Buchungen'].map((h) => (
                      <th key={h} style={{ textAlign: h === 'Buchungen' ? 'right' : 'left', padding: '6px 0', color: '#bbb', fontWeight: '500', fontSize: '12px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.upcomingEvents.map((ev, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #fdf5f5' }}>
                      <td style={{ padding: '10px 0' }}>{ev.title}</td>
                      <td style={{ padding: '10px 0', color: '#888' }}>{ev.date}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '600', color: ev.max > 0 && ev.participants >= ev.max ? '#e74c3c' : '#27ae60' }}>
                        {ev.participants}{ev.max > 0 ? ` / ${ev.max}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div style={cardStyle}>
        <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', color: '#2d1b1b' }}>Bestellungen als CSV exportieren</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {[['Von', csvFrom, setCsvFrom], ['Bis', csvTo, setCsvTo]].map(([label, val, setter]: any) => (
            <div key={label as string}>
              <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{label as string}</label>
              <input type="date" value={val as string} onChange={(e) => setter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
            </div>
          ))}
          <button onClick={downloadCSV}
            style={{ padding: '9px 20px', background: '#BE465A', color: 'white', border: 'none', borderRadius: '999px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            CSV herunterladen
          </button>
          <span style={{ fontSize: '12px', color: '#ccc', alignSelf: 'center' }}>Leer = alle Bestellungen</span>
        </div>
      </div>
    </div>
  )
}
