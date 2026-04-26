import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, name, email, reason } = await req.json()

    if (!orderNumber || !name || !email) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find the order
    const orders = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
    })

    const order = orders.docs[0] as any
    if (!order) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden. Bitte prüfe die Bestellnummer.' },
        { status: 404 },
      )
    }

    // Check 14-day window
    const orderDate = new Date(order.createdAt)
    const daysSince = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > 14) {
      return NextResponse.json(
        { error: 'Die 14-tägige Widerrufsfrist für diese Bestellung ist abgelaufen.' },
        { status: 400 },
      )
    }

    // Only allow withdrawal for withdrawable statuses
    if (['cancelled', 'refunded'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Diese Bestellung wurde bereits storniert oder erstattet.' },
        { status: 400 },
      )
    }

    // Update order status to cancelled
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { status: 'cancelled' } as any,
    })

    // Send confirmation emails
    const { sendWiderrufConfirmation } = await import('@/lib/email')
    await sendWiderrufConfirmation({
      customerName: name,
      customerEmail: email,
      orderNumber,
      reason: reason || 'Kein Grund angegeben',
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[WIDERRUF] Error:', err)
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten.' }, { status: 500 })
  }
}
