import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendOrderConfirmation, sendInstallmentPaymentConfirmation } from '@/lib/email'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.error('Stripe webhook secret is not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(payload, event.data.object as Stripe.Checkout.Session)
        break
      }
      case 'invoice.paid': {
        await handleInvoicePaid(payload, event.data.object as Stripe.Invoice)
        break
      }
      case 'invoice.payment_failed': {
        await handleInvoiceFailed(payload, event.data.object as Stripe.Invoice)
        break
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(payload, event.data.object as Stripe.Subscription)
        break
      }
    }
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error)
    // Still return 200 to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true })
}

/**
 * Handles successful checkout — both one-time and first installment payment.
 * Updates order status, assigns purchased items to user, increments event participants.
 */
async function handleCheckoutCompleted(payload: any, session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId
  const userId = session.metadata?.userId
  const paymentType = session.metadata?.paymentType

  if (!orderId) {
    console.error('Webhook: No orderId in session metadata')
    return
  }

  const newStatus = paymentType === 'installment' ? 'installment_active' : 'paid'

  // Update order status
  const updateData: Record<string, any> = {
    status: newStatus,
    stripePaymentIntentId: session.payment_intent as string || undefined,
  }

  if (paymentType === 'installment' && session.subscription) {
    updateData.stripeSubscriptionId = session.subscription as string
    updateData.installmentDetails = {
      ...updateData.installmentDetails,
      paidInstallments: 1,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  const order = await payload.update({
    collection: 'orders',
    id: orderId,
    data: updateData,
  })

  if (!userId) return

  // Fetch user for current purchased items
  const user = await payload.findByID({ collection: 'users', id: userId })
  if (!user) return

  // Process each item in the order
  const newPurchasedItems: string[] = [...(user.purchasedItems || []).map((i: any) => typeof i === 'string' ? i : i.id)]
  const newPurchasedBundles: string[] = [...(user.purchasedBundles || []).map((i: any) => typeof i === 'string' ? i : i.id)]
  const newTrainingAccess: any[] = [...(user.trainingAccess || [])]

  for (const orderItem of order.items || []) {
    if (orderItem.itemType === 'shop-item' && orderItem.shopItem) {
      const itemId = typeof orderItem.shopItem === 'string' ? orderItem.shopItem : orderItem.shopItem.id

      if (!newPurchasedItems.includes(itemId)) {
        newPurchasedItems.push(itemId)
      }

      // Fetch the shop item for type-specific logic
      try {
        const shopItem = await payload.findByID({ collection: 'shop-items', id: itemId }) as any

        // Increment event participants
        if (['seminar', 'workshop', 'vortrag'].includes(shopItem.itemType)) {
          const currentParticipants = shopItem.eventDetails?.currentParticipants || 0
          await payload.update({
            collection: 'shop-items',
            id: itemId,
            data: {
              eventDetails: {
                ...shopItem.eventDetails,
                currentParticipants: currentParticipants + (orderItem.quantity || 1),
              },
              // Auto-set sold_out if at capacity
              ...(shopItem.eventDetails?.maxParticipants &&
                currentParticipants + (orderItem.quantity || 1) >= shopItem.eventDetails.maxParticipants && {
                  status: 'sold_out',
                }),
            },
          })
        }

        // Set up training access
        if (shopItem.itemType === 'einzeltraining' && shopItem.trainingDetails?.durationWeeks) {
          const startDate = new Date()
          const endDate = new Date()
          endDate.setDate(endDate.getDate() + shopItem.trainingDetails.durationWeeks * 7)

          const alreadyHasAccess = newTrainingAccess.some((ta: any) => {
            const trainingId = typeof ta.training === 'string' ? ta.training : ta.training?.id
            return trainingId === itemId
          })

          if (!alreadyHasAccess) {
            newTrainingAccess.push({
              training: itemId,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            })
          }
        }
      } catch (err) {
        console.error(`Failed to process shop item ${itemId}:`, err)
      }
    }

    if (orderItem.itemType === 'bundle' && orderItem.bundle) {
      const bundleId = typeof orderItem.bundle === 'string' ? orderItem.bundle : orderItem.bundle.id

      if (!newPurchasedBundles.includes(bundleId)) {
        newPurchasedBundles.push(bundleId)
      }

      // Also add all items from the bundle to purchasedItems
      try {
        const bundle = await payload.findByID({ collection: 'bundles', id: bundleId, depth: 0 }) as any
        for (const bundledItemId of bundle.items || []) {
          const id = typeof bundledItemId === 'string' ? bundledItemId : bundledItemId.id
          if (!newPurchasedItems.includes(id)) {
            newPurchasedItems.push(id)
          }
        }
      } catch (err) {
        console.error(`Failed to process bundle ${bundleId}:`, err)
      }
    }
  }

  // Update user with purchased items
  await payload.update({
    collection: 'users',
    id: userId,
    data: {
      purchasedItems: newPurchasedItems,
      purchasedBundles: newPurchasedBundles,
      trainingAccess: newTrainingAccess,
    },
  })

  // Send order confirmation email
  try {
    await sendOrderConfirmation({
      customerName: user.firstName || user.email,
      customerEmail: user.email,
      orderNumber: order.orderNumber,
      items: (order.items || []).map((item: any) => ({
        name: item.shopItem?.title || item.bundle?.name || 'Artikel',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
      })),
      total: order.total,
      paymentType: order.paymentType,
      installmentDetails: order.installmentDetails,
    })
  } catch (emailErr) {
    console.error('Failed to send order confirmation email:', emailErr)
  }
}

/**
 * Handles successful installment invoice payment.
 * Increments paidInstallments. Cancels subscription when all installments are paid.
 */
async function handleInvoicePaid(payload: any, invoice: Stripe.Invoice) {
  const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined
  if (!subscriptionId) return

  // Skip the first invoice (already handled by checkout.session.completed)
  if (invoice.billing_reason === 'subscription_create') return

  // Find order by subscription ID
  const orders = await payload.find({
    collection: 'orders',
    where: { stripeSubscriptionId: { equals: subscriptionId } },
    limit: 1,
  })

  const order = orders.docs[0]
  if (!order) {
    console.error(`No order found for subscription ${subscriptionId}`)
    return
  }

  const paidInstallments = (order.installmentDetails?.paidInstallments || 0) + 1
  const totalInstallments = order.installmentDetails?.totalInstallments || 1
  const allPaid = paidInstallments >= totalInstallments

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: allPaid ? 'paid' : 'installment_active',
      installmentDetails: {
        ...order.installmentDetails,
        paidInstallments,
        nextPaymentDate: allPaid
          ? undefined
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  })

  // Send installment payment confirmation email
  try {
    const customer = typeof order.customer === 'string'
      ? await payload.findByID({ collection: 'users', id: order.customer })
      : order.customer
    if (customer?.email) {
      await sendInstallmentPaymentConfirmation(
        customer.email,
        customer.firstName || customer.email,
        order.orderNumber,
        paidInstallments,
        totalInstallments,
        order.installmentDetails?.amountPerInstallment || 0,
      )
    }
  } catch (emailErr) {
    console.error('Failed to send installment email:', emailErr)
  }

  // Cancel subscription when all installments are paid
  if (allPaid) {
    try {
      await stripe.subscriptions.cancel(subscriptionId)
    } catch (err) {
      console.error(`Failed to cancel subscription ${subscriptionId}:`, err)
    }
  }
}

/**
 * Handles failed installment payment.
 */
async function handleInvoiceFailed(payload: any, invoice: Stripe.Invoice) {
  const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined
  if (!subscriptionId) return

  const orders = await payload.find({
    collection: 'orders',
    where: { stripeSubscriptionId: { equals: subscriptionId } },
    limit: 1,
  })

  const order = orders.docs[0]
  if (!order) return

  console.error(`Payment failed for order ${order.orderNumber} (subscription ${subscriptionId})`)
  // Order stays in installment_active — Stripe will retry automatically
}

/**
 * Handles subscription cancellation (by user or when installments complete).
 */
async function handleSubscriptionDeleted(payload: any, subscription: Stripe.Subscription) {
  const orders = await payload.find({
    collection: 'orders',
    where: { stripeSubscriptionId: { equals: subscription.id } },
    limit: 1,
  })

  const order = orders.docs[0]
  if (!order) return

  const allPaid =
    (order.installmentDetails?.paidInstallments || 0) >=
    (order.installmentDetails?.totalInstallments || 1)

  if (!allPaid && order.status !== 'paid') {
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { status: 'cancelled' },
    })
  }
}
