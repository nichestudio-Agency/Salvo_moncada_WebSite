import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import { getCart } from '@/lib/cart'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { items } = await getCart().catch(() => ({ items: [] }))
  const cartCount = items.reduce((s, it) => s + it.quantita, 0)

  return (
    <>
      <Nav cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
