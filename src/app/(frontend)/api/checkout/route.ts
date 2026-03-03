import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const { items, customer, paymentType } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Keine Artikel im Warenkorb' }, { status: 400 })
    }

    // Ratenzahlung via Stripe Subscription
    if (paymentType === 'installment') {
      const installmentItem = items.find((i: any) => i.installmentEnabled && i.installmentCount)
      if (!installmentItem) {
        return NextResponse.json({ error: 'Kein ratenfähiges Item gefunden' }, { status: 400 })
      }

      const totalAmount = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      )
      const monthlyAmount = Math.round((totalAmount / installmentItem.installmentCount) * 100)

      // Create a Stripe Price for the recurring payment
      const product = await stripe.products.create({
        name: items.length === 1 ? items[0].name : `Lebenskunst Bestellung (${items.length} Items)`,
      })

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: monthlyAmount,
        currency: 'eur',
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      })

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit'],
        line_items: [{ price: price.id, quantity: 1 }],
        mode: 'subscription',
        subscription_data: {
          metadata: {
            totalInstallments: String(installmentItem.installmentCount),
            totalAmount: String(totalAmount),
          },
        },
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/warenkorb`,
        customer_email: customer?.email,
        metadata: {
          paymentType: 'installment',
          customerName: `${customer?.firstName} ${customer?.lastName}`,
          customerPhone: customer?.phone || '',
        },
      })

      return NextResponse.json({ url: session.url })
    }

    // Einmalzahlung
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            ...(item.image && {
              images: [`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`],
            }),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }),
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/warenkorb`,
      customer_email: customer?.email,
      metadata: {
        paymentType: 'full',
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
