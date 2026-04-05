import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lebenskunstonline.de'
  const payload = await getPayload({ config })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/podcast`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/mitglieder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/agb`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic shop item pages
  const shopItems = await payload.find({
    collection: 'shop-items',
    where: { status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true, updatedAt: true },
  })

  const shopPages: MetadataRoute.Sitemap = shopItems.docs.map((item: any) => ({
    url: `${baseUrl}/shop/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic bundle pages
  const bundles = await payload.find({
    collection: 'bundles',
    where: { status: { equals: 'published' } },
    limit: 100,
    select: { slug: true, updatedAt: true },
  })

  const bundlePages: MetadataRoute.Sitemap = bundles.docs.map((bundle: any) => ({
    url: `${baseUrl}/shop/bundle/${bundle.slug}`,
    lastModified: new Date(bundle.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...shopPages, ...bundlePages]
}
