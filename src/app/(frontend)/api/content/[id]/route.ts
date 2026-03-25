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

  const contentUrl = item.digitalDetails?.contentFile?.url || null
  const format = item.digitalDetails?.format || 'unknown'

  if (!contentUrl) {
    return NextResponse.json({ error: 'Noch keine Datei hinterlegt' }, { status: 404 })
  }

  // ?serve=1 → deliver the file (used by browser links in the member area)
  const { searchParams } = new URL(req.url)
  if (searchParams.get('serve') === '1') {
    // Use Nginx X-Accel-Redirect for files in the protected content volume
    if (contentUrl.includes('/content/')) {
      const filePath = contentUrl.replace(/^.*\/content\//, '')
      const isDownload = ['begleitmaterial', 'pdf'].includes(format.toLowerCase())
      return new NextResponse(null, {
        status: 200,
        headers: {
          'X-Accel-Redirect': `/internal-content/${filePath}`,
          'Content-Disposition': isDownload
            ? `attachment; filename="${filePath.split('/').pop() || 'download'}"`
            : 'inline',
        },
      })
    }
    // Fallback: redirect (auth was verified above; file is in publicly-served /media/)
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const absoluteUrl = contentUrl.startsWith('http') ? contentUrl : `${serverUrl}${contentUrl}`
    return NextResponse.redirect(absoluteUrl)
  }

  // Default JSON response for programmatic / API use
  return NextResponse.json({
    access: true,
    title: item.title,
    format,
    contentUrl,
    message: 'Zugang gewährt',
  })
}
