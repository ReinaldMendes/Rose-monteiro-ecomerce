'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Eye } from 'lucide-react'
import { Product } from '@/types'
import { fmt } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore()
  const img = product.images?.[0]

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} adicionado ao carrinho`)
  }

  return (
    <div className="group bg-off-white overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/produtos/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-nude img-zoom">
          {img ? (
            <Image src={img.url} alt={img.alt || product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream">
              <ShoppingBag className="w-12 h-12 text-charcoal/15" />
            </div>
          )}

          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            {product.stockStatus === 'OUT_OF_STOCK' && (
              <span className="bg-charcoal text-nude text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 font-body">Esgotado</span>
            )}
            {product.stockStatus === 'LOW_STOCK' && (
              <span className="bg-gold text-white text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 font-body">Últimas unidades</span>
            )}
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="bg-terra text-white text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 font-body">Promoção</span>
            )}
          </div>

          {/* Hover actions */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <button className="w-9 h-9 bg-white flex items-center justify-center hover:bg-nude transition-colors" aria-label="Favoritar">
              <Heart className="w-4 h-4 text-charcoal" />
            </button>
            <button className="w-9 h-9 bg-white flex items-center justify-center hover:bg-nude transition-colors" aria-label="Ver rápido">
              <Eye className="w-4 h-4 text-charcoal" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <p className="text-[9px] tracking-[0.24em] uppercase text-gold mb-1.5 font-body">{product.category?.name}</p>
          <h3 className="font-display text-lg italic text-charcoal leading-tight mb-2">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-medium text-charcoal">{fmt(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-sage line-through font-light">{fmt(product.comparePrice)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        {product.stockStatus === 'OUT_OF_STOCK' ? (
          <button disabled className="w-full py-3 bg-charcoal/20 text-charcoal/40 text-[10px] tracking-[0.2em] uppercase font-body cursor-not-allowed">
            Esgotado
          </button>
        ) : (
          <button onClick={handleAdd}
            className="w-full py-3 bg-charcoal text-white text-[10px] tracking-[0.2em] uppercase font-body hover:bg-terra transition-colors">
            Adicionar ao carrinho
          </button>
        )}
      </div>
    </div>
  )
}
