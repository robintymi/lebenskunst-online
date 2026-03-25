import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json()
    if (!code || typeof cartTotal !== 'number') {
      return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
    }
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'discounts',
      where: { code: { equals: code.toUpperCase().trim() }, active: { equals: true } },
      limit: 1,
    })
    const discount = result.docs[0] as any
    if (!discount) return NextResponse.json({ error: 'Ungültiger Rabattcode' }, { status: 404 })
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date())
      return NextResponse.json({ error: 'Dieser Rabattcode ist abgelaufen' }, { status: 400 })
    if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses)
      return NextResponse.json({ error: 'Dieser Rabattcode wurde bereits zu oft verwendet' }, { status: 400 })
    const discountAmount = discount.type === 'percentage'
      ? Math.round(cartTotal * (discount.value / 100) * 100) / 100
      : Math.min(discount.value, cartTotal)
    return NextResponse.json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount,
      newTotal: Math.max(0, cartTotal - discountAmount),
    })
  } catch {
    return NextResponse.json({ error: 'Fehler beim Prüfen des Codes' }, { status: 500 })
  }
}
