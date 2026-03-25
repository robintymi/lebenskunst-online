import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Protected content delivery endpoint.
 * Verifies the user has purchased the item before allowing access.
 * In production with Nginx, this would use X-Accel-Redirect for performance.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const payload = await getPayload({ config })

  // Verify auth
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  }

  // Fetch the shop item with depth:1 to populate contentFile relationship
  let item: any
  try {
    item = await payload.findByID({ collection: 'shop-items', id, depth: 1 })
  } catch {
    return NextResponse.json({ error: 'Inhalt nicht gefunden' }, { status: 404 })
  }

  // Check if item is free
  const isFree = item.pricing?.isFree

  if (!isFree) {
    // Check if user has purchased this item
    const fullUser = await payload.findByID({ collection: 'users', id: user.id, depth: 0 })
    const purchasedIds = (fullUser.purchasedItems || []).map((i: any) =>
      typeof i === 'string' ? i : i.id,
    )
    const purchasedBundleIds = (fullUser.purchasedBundles || []).map((i: any) =>
      typeof i === 'string' ? i : i.id,
    )

    const hasDirectPurchase = purchasedIds.includes(id)

    // Check if any purchased bundle contains this item
    let hasBundlePurchase = false
    if (!hasDirectPurchase && purchasedBundleIds.length > 0) {
      for (const bundleId of purchasedBundleIds) {
        try {
          const bundle = await payload.findByID({ collection: 'bundles', id: bundleId, depth: 0 }) as any
          const bundleItemIds = (bundle.items || []).map((i: any) => typeof i === 'string' ? i : i.id)
          if (bundleItemIds.includes(id)) {
            hasBundlePurchase = true
            break
          }
        } catch {
          continue
        }
      }
    }

    if (!hasDirectPurchase && !hasBundlePurchase) {
      return NextResponse.json(
        { error: 'Kein Zugang — Diesen Inhalt hast du noch nicht erworben.' },
        { status: 403 },
      )
    }
  }

  // Return content information (the actual file serving is done by Nginx X-Accel-Redirect in production)
  const contentUrl = item.digitalDetails?.contentFile?.url || null
  const previewUrl = item.digitalDetails?.previewUrl || null
  const format = item.digitalDetails?.format || 'unknown'

  return NextResponse.json({
    access: true,
    title: item.title,
    format,
    contentUrl,
    previewUrl,
    message: 'Zugang gewährt',
  })
}
