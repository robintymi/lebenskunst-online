import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.role !== 'admin') return new NextResponse('Kein Zugriff', { status: 403 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const where: any = {}
  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.greater_than_equal = new Date(from).toISOString()
    if (to) where.createdAt.less_than_equal = new Date(to + 'T23:59:59').toISOString()
  }

  const orders = await payload.find({ collection: 'orders', where, limit: 10000, depth: 1, sort: '-createdAt' })

  const rows = [
    ['Bestellnummer', 'Datum', 'Kunde', 'E-Mail', 'Artikel', 'Zahlungsart', 'Status', 'Gesamt (€)', 'Versandstatus', 'Sendungsnummer'].join(';'),
    ...orders.docs.map((order: any) => {
      const customer = typeof order.customer === 'object' ? order.customer : null
      const itemNames = (order.items || []).map((i: any) => i.shopItem?.title || i.bundle?.name || 'Artikel').join(', ')
      const total = (order.total || 0).toFixed(2).replace('.', ',')
      const date = new Date(order.createdAt).toLocaleDateString('de-DE')
      const paymentType = order.paymentType === 'installment' ? 'Ratenzahlung' : 'Einmalzahlung'
      const statusMap: Record<string, string> = { paid: 'Bezahlt', pending: 'Ausstehend', installment_active: 'Ratenzahlung aktiv', cancelled: 'Storniert', refunded: 'Erstattet', payment_failed: 'Zahlung fehlgeschlagen' }
      return [order.orderNumber, date, `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || customer?.email || '', customer?.email || '', `"${itemNames}"`, paymentType, statusMap[order.status] || order.status, total, order.fulfillment?.shippingStatus || '', order.fulfillment?.trackingNumber || ''].join(';')
    }),
  ].join('\n')

  return new NextResponse('\uFEFF' + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="bestellungen-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
