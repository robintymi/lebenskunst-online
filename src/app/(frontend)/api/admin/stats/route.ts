import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 })

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [todayOrders, monthOrders, allOrders, pendingOrders, failedOrders, upcomingItems, newUsers] = await Promise.all([
    payload.find({ collection: 'orders', where: { and: [{ createdAt: { greater_than_equal: todayStart } }, { status: { in: ['paid', 'installment_active'] } }] }, limit: 1000 }),
    payload.find({ collection: 'orders', where: { and: [{ createdAt: { greater_than_equal: monthStart } }, { status: { in: ['paid', 'installment_active'] } }] }, limit: 1000 }),
    payload.find({ collection: 'orders', where: { status: { in: ['paid', 'installment_active'] } }, limit: 1 }),
    payload.find({ collection: 'orders', where: { status: { equals: 'pending' } }, limit: 1 }),
    payload.find({ collection: 'orders', where: { status: { equals: 'payment_failed' } }, limit: 1 }),
    payload.find({ collection: 'shop-items', where: { and: [{ status: { equals: 'published' } }, { itemType: { in: ['seminar', 'workshop', 'vortrag'] } }, { 'eventDetails.date': { greater_than_equal: now.toISOString() } }] }, limit: 10, sort: 'eventDetails.date' }),
    payload.find({ collection: 'users', where: { and: [{ createdAt: { greater_than_equal: monthStart } }, { role: { equals: 'member' } }] }, limit: 1 }),
  ])

  return NextResponse.json({
    revenueToday: todayOrders.docs.reduce((s: number, o: any) => s + (o.total || 0), 0),
    revenueMonth: monthOrders.docs.reduce((s: number, o: any) => s + (o.total || 0), 0),
    ordersTotal: allOrders.totalDocs,
    ordersPending: pendingOrders.totalDocs,
    ordersPaymentFailed: failedOrders.totalDocs,
    newUsersMonth: newUsers.totalDocs,
    upcomingEvents: upcomingItems.docs.map((item: any) => ({
      title: item.title,
      date: item.eventDetails?.date ? new Date(item.eventDetails.date).toLocaleDateString('de-DE') : '—',
      participants: item.eventDetails?.currentParticipants || 0,
      max: item.eventDetails?.maxParticipants || 0,
    })),
  })
}
