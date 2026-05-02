import type { Metadata } from 'next'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'
import { getSiteTexts } from '@/lib/site-texts'

export const metadata: Metadata = {
  title: {
    default: 'Lebenskunst - Deine Reise zu dir selbst',
    template: '%s | Lebenskunst',
  },
  description:
    'Embodiment, Energiearbeit, Frauenkreise, Kunsttherapie, Meditation und Breathwork. Entdecke Veranstaltungen und Kunst.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Lebenskunst',
    title: 'Lebenskunst - Deine Reise zu dir selbst',
    description: 'Seminare, Workshops, Einzeltrainings, Podcast und mehr für dein persönliches Wachstum.',
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  },
  twitter: {
    card: 'summary_large_image',
    site: '',
    title: 'Lebenskunst - Deine Reise zu dir selbst',
    description: 'Seminare, Workshops, Einzeltrainings, Podcast und mehr für dein persönliches Wachstum.',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const siteTexts = await getSiteTexts()

  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header texts={siteTexts?.header || undefined} />
            <main style={{ minHeight: `calc(100vh - var(--header-height) - 200px)`, position: 'relative', zIndex: 1 }}>
              {children}
            </main>
            <Footer texts={siteTexts?.footer || undefined} />
            <CookieBanner text={siteTexts?.cookieBanner?.text} buttonLabel={siteTexts?.cookieBanner?.buttonLabel} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
