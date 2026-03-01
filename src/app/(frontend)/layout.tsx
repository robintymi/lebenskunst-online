import type { Metadata } from 'next'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/cart-context'

export const metadata: Metadata = {
  title: {
    default: 'Lebenskunst - Deine Reise zu dir selbst',
    template: '%s | Lebenskunst',
  },
  description:
    'Embodiment, Energiearbeit, Frauenkreise, Kunsttherapie, Meditation und Breathwork. Entdecke Veranstaltungen und Kunst.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <CartProvider>
          <Header />
          <main style={{ minHeight: `calc(100vh - var(--header-height) - 200px)` }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
