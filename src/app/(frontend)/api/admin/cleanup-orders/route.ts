import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Cleanup abandoned pending orders older than 24 hours.
 * Call manually from admin dashboard or schedule via cron.
 * DELETE /api/admin/cleanup-orders
 */
export async function DELETE(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 })
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const stale = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { equals: 'pending' } },
        { createdAt: { less_than: cutoff } },
      ],
    },
    limit: 500,
  })

  let deleted = 0
  for (const order of stale.docs) {
    try {
      await payload.delete({ collection: 'orders', id: order.id })
      deleted++
    } catch (err) {
      console.error(`Failed to delete pending order ${order.id}:`, err)
    }
  }

  return NextResponse.json({
    deleted,
    message: `${deleted} abgebrochene Bestellungen gelöscht (älter als 24h)`,
  })
}
