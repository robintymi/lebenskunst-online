import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lebenskunstonline.de'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/mitglieder/dashboard', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
