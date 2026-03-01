import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { items, customer } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Keine Artikel im Warenkorb' }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            ...(item.image && { images: [`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`] }),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }),
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/warenkorb`,
      customer_email: customer?.email,
      metadata: {
        customerName: `${customer?.firstName} ${customer?.lastName}`,
        customerPhone: customer?.phone || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout fehlgeschlagen' }, { status: 500 })
  }
}
