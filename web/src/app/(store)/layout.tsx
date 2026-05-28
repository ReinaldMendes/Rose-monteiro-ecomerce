import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/layout/CartSidebar'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import CartHydration from '@/components/layout/CartHydration'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartHydration />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </>
  )
}
