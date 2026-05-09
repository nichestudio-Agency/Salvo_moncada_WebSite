import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import { getCart } from '@/lib/cart'
import { getCurrentUser } from '@/lib/auth'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ items }, user] = await Promise.all([
    getCart().catch(() => ({ items: [] })),
    getCurrentUser().catch(() => null),
  ])
  const cartCount = items.reduce((s, it) => s + it.quantita, 0)

  return (
    <>
      <Nav cartCount={cartCount} isLoggedIn={!!user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
