import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isPhysicalType } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, name, email } = await req.json()

    if (!orderNumber || !name || !email) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const orders = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      depth: 2,
      limit: 1,
    })

    const order = orders.docs[0] as any
    if (!order) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden. Bitte pruefe die Bestellnummer.' },
        { status: 404 },
      )
    }

    const customerEmail =
      typeof order.customer === 'object' && order.customer?.email
        ? String(order.customer.email).trim().toLowerCase()
        : ''

    if (!customerEmail || customerEmail !== String(email).trim().toLowerCase()) {
      return NextResponse.json(
        { error: 'Die E-Mail-Adresse passt nicht zu dieser Bestellung.' },
        { status: 403 },
      )
    }

    if (['cancelled', 'refunded'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Diese Bestellung wurde bereits storniert oder erstattet.' },
        { status: 400 },
      )
    }

    const alreadyRequested =
      order.withdrawal?.status &&
      order.withdrawal.status !== 'none' &&
      order.withdrawal.status !== 'rejected'

    if (alreadyRequested) {
      return NextResponse.json(
        { error: 'Fuer diese Bestellung liegt bereits eine Widerrufsanfrage vor.' },
        { status: 400 },
      )
    }

    const isWithdrawableOrder = Array.isArray(order.items) && order.items.length > 0 && order.items.every((item: any) => {
      if (item.itemType !== 'shop-item') return false
      const shopItem = item.shopItem
      if (!shopItem || typeof shopItem === 'string') return false
      return isPhysicalType(shopItem.itemType || '')
    })

    if (!isWithdrawableOrder) {
      return NextResponse.json(
        {
          error:
            'Diese Online-Widerrufsfunktion steht derzeit nur fuer physische Einzelbestellungen (Buecher/Kunst) zur Verfuegung. Bei digitalen Inhalten, Veranstaltungen oder gemischten Bestellungen kontaktiere uns bitte direkt.',
        },
        { status: 400 },
      )
    }

    const requestedAt = new Date().toISOString()

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        withdrawal: {
          status: 'requested',
          requestedAt,
          requestedByName: name,
          requestedByEmail: email,
        },
      } as any,
    })

    const { sendWiderrufConfirmation } = await import('@/lib/email')
    await sendWiderrufConfirmation({
      customerName: name,
      customerEmail: email,
      orderNumber,
      requestedAt,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[WIDERRUF] Error:', err)
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten.' }, { status: 500 })
  }
}
