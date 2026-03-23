import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
})

interface CheckoutItem {
  id: string
  type: 'shop-item' | 'bundle'
  itemType?: string
  name: string
  price: number
  quantity: number
  image?: string
  installmentEnabled?: boolean
  installmentCount?: number
}

interface CheckoutBody {
  items: CheckoutItem[]
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    street?: string
    city?: string
    zip?: string
  }
  paymentType: 'full' | 'installment'
  userId?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { items, customer, paymentType, userId } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Keine Artikel im Warenkorb' }, { status: 400 })
    }

    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      return NextResponse.json({ error: 'Kontaktdaten unvollständig' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Verify prices from database (prevent price manipulation)
    const verifiedItems = await Promise.all(
      items.map(async (item) => {
        if (item.type === 'bundle') {
          const bundle = await payload.find({
            collection: 'bundles',
            where: { id: { equals: item.id } },
            limit: 1,
          })
          const dbBundle = bundle.docs[0]
          if (!dbBundle) throw new Error(`Bundle ${item.id} nicht gefunden`)
          return { ...item, price: dbBundle.bundlePrice, name: dbBundle.name }
        }

        const shopItem = await payload.find({
          collection: 'shop-items',
          where: { id: { equals: item.id } },
          limit: 1,
        })
        const dbItem = shopItem.docs[0] as any
        if (!dbItem) throw new Error(`Artikel ${item.id} nicht gefunden`)

        // Check event capacity
        if (['seminar', 'workshop', 'vortrag'].includes(dbItem.itemType)) {
          const max = dbItem.eventDetails?.maxParticipants
          const current = dbItem.eventDetails?.currentParticipants || 0
          if (max && current + item.quantity > max) {
            const remaining = max - current
            throw new Error(
              remaining <= 0
                ? `${dbItem.title} ist leider ausgebucht`
                : `${dbItem.title}: Nur noch ${remaining} Plätze verfügbar (${item.quantity} angefragt)`,
            )
          }
        }

        return { ...item, price: dbItem.pricing?.price || 0, name: dbItem.title }
      }),
    )

    const totalAmount = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    // Resolve customer user ID
    let customerId = userId
    if (!customerId && customer.email) {
      const existingUser = await payload.find({
        collection: 'users',
        where: { email: { equals: customer.email } },
        limit: 1,
      })
      if (existingUser.docs[0]) {
        customerId = existingUser.docs[0].id
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'Bitte melde dich an, bevor du zur Kasse gehst.' },
        { status: 401 },
      )
    }

    // Build order items
    const orderItems = verifiedItems.map((item) => ({
      itemType: item.type as 'shop-item' | 'bundle',
      ...(item.type === 'shop-item' ? { shopItem: item.id } : { bundle: item.id }),
      quantity: item.quantity,
      unitPrice: item.price,
    }))

    // Determine installment details
    const installmentItem = paymentType === 'installment'
      ? verifiedItems.find((i) => i.installmentEnabled && i.installmentCount)
      : null
    const installmentCount = installmentItem?.installmentCount || 1
    const monthlyAmount = paymentType === 'installment'
      ? Math.round(totalAmount / installmentCount)
      : totalAmount

    // Create pending order in database BEFORE Stripe
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: `LK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        customer: customerId,
        items: orderItems,
        total: totalAmount,
        paymentType,
        status: 'pending',
        ...(paymentType === 'installment' && {
          installmentDetails: {
            totalInstallments: installmentCount,
            amountPerInstallment: monthlyAmount,
            paidInstallments: 0,
          },
        }),
        shippingAddress: customer.street
          ? {
              street: customer.street,
              city: customer.city || '',
              zip: customer.zip || '',
              country: 'Deutschland',
            }
          : undefined,
      },
    })

    // DEV MODE: If no Stripe key, simulate payment and fulfill order immediately
    const isDevMode = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder'

    if (isDevMode) {
      console.log(`[DEV] Simulating payment for order ${order.id} (${order.orderNumber})`)

      // Directly fulfill the order (same logic as webhook)
      const newStatus = paymentType === 'installment' ? 'installment_active' : 'paid'
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: newStatus,
          ...(paymentType === 'installment' && {
            installmentDetails: {
              totalInstallments: installmentCount,
              amountPerInstallment: monthlyAmount,
              paidInstallments: 1,
              nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
          }),
        } as any,
      })

      // Add purchased items to user
      const user = await payload.findByID({ collection: 'users', id: customerId })
      const existingItems = ((user as any).purchasedItems || []).map((i: any) => typeof i === 'string' ? i : i.id)
      const existingBundles = ((user as any).purchasedBundles || []).map((i: any) => typeof i === 'string' ? i : i.id)
      const newTrainingAccess = [...((user as any).trainingAccess || [])]

      for (const item of verifiedItems) {
        if (item.type === 'shop-item') {
          if (!existingItems.includes(item.id)) existingItems.push(item.id)

          // Handle event participant count
          try {
            const shopItem = await payload.findByID({ collection: 'shop-items', id: item.id }) as any
            if (['seminar', 'workshop', 'vortrag'].includes(shopItem.itemType)) {
              const current = shopItem.eventDetails?.currentParticipants || 0
              await payload.update({
                collection: 'shop-items',
                id: item.id,
                data: {
                  eventDetails: { ...shopItem.eventDetails, currentParticipants: current + (item.quantity || 1) },
                  ...(shopItem.eventDetails?.maxParticipants &&
                    current + (item.quantity || 1) >= shopItem.eventDetails.maxParticipants && { status: 'sold_out' }),
                } as any,
              })
            }
            // Handle training access
            if (shopItem.itemType === 'einzeltraining' && shopItem.trainingDetails?.durationWeeks) {
              const startDate = new Date()
              const endDate = new Date()
              endDate.setDate(endDate.getDate() + shopItem.trainingDetails.durationWeeks * 7)
              newTrainingAccess.push({
                training: item.id,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              })
            }
          } catch { /* item processing error, continue */ }
        }
        if (item.type === 'bundle') {
          if (!existingBundles.includes(item.id)) existingBundles.push(item.id)
          try {
            const bundle = await payload.findByID({ collection: 'bundles', id: item.id, depth: 0 }) as any
            for (const bundledId of bundle.items || []) {
              const id = typeof bundledId === 'string' ? bundledId : bundledId.id
              if (!existingItems.includes(id)) existingItems.push(id)
            }
          } catch { /* bundle processing error, continue */ }
        }
      }

      await payload.update({
        collection: 'users',
        id: customerId,
        data: {
          purchasedItems: existingItems,
          purchasedBundles: existingBundles,
          trainingAccess: newTrainingAccess,
        } as any,
      })

      console.log(`[DEV] Order ${order.orderNumber} fulfilled. User ${customerId} updated.`)

      // Redirect directly to success page
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout?success=true` })
    }

    // PRODUCTION: Create Stripe session
    let session: Stripe.Checkout.Session

    if (paymentType === 'installment' && installmentItem) {
      const product = await stripe.products.create({
        name: verifiedItems.length === 1
          ? verifiedItems[0].name
          : `Lebenskunst Bestellung (${verifiedItems.length} Artikel)`,
      })

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(monthlyAmount * 100),
        currency: 'eur',
        recurring: { interval: 'month', interval_count: 1 },
      })

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit'],
        line_items: [{ price: price.id, quantity: 1 }],
        mode: 'subscription',
        subscription_data: {
          metadata: {
            orderId: order.id,
            totalInstallments: String(installmentCount),
          },
        },
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/warenkorb`,
        customer_email: customer.email,
        metadata: {
          orderId: order.id,
          paymentType: 'installment',
          userId: customerId,
        },
      })
    } else {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = verifiedItems.map(
        (item) => ({
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

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'sepa_debit'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/warenkorb`,
        customer_email: customer.email,
        metadata: {
          orderId: order.id,
          paymentType: 'full',
          userId: customerId,
        },
      })
    }

    // Store Stripe session ID on order (field added to collection, types will be regenerated)
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { stripeSessionId: session.id } as any,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    const message = error?.message || 'Checkout fehlgeschlagen'
    const status = message.includes('ausgebucht') ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
