import { productsApi } from '@/lib/api'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

async function getProducts() {
  try {
    const res = await productsApi.featured()
    return res.data.products || []
  } catch { return [] }
}

export default async function FeaturedProducts() {
  const products = await getProducts()
  return (
    <section className="bg-cream px-8 md:px-12 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Seleção especial</p>
          <h2 className="font-display text-5xl font-light italic text-charcoal">Destaques</h2>
        </div>
        <Link href="/produtos" className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-terra hover:opacity-70 transition-opacity">
          Ver todos <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-charcoal/40">
          <p className="font-display text-2xl italic">Em breve, novos produtos</p>
        </div>
      )}
    </section>
  )
}
