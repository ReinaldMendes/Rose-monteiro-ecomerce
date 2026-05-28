'use client'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { fmt } from '@/lib/utils'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCartStore()

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-50" onClick={closeCart} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-[400px] max-w-full bg-off-white z-50 flex flex-col
        transition-transform duration-400 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Head */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-nude">
          <h2 className="font-display text-xl font-normal italic text-charcoal">Seu carrinho</h2>
          <button onClick={closeCart} className="text-charcoal/50 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-charcoal/40">
              <ShoppingBag className="w-12 h-12" />
              <p className="text-sm font-light">Seu carrinho está vazio</p>
              <button onClick={closeCart}
                className="text-[10px] tracking-[0.2em] uppercase text-terra border border-terra px-6 py-3 hover:bg-terra hover:text-white transition-colors">
                Explorar produtos
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-5 py-5 border-b border-nude/60">
                  <div className="w-20 h-20 bg-nude flex-shrink-0 overflow-hidden">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0].url} alt={item.product.name}
                        width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-nude flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-charcoal/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] tracking-[0.18em] uppercase text-gold mb-1 font-body">{item.product.category?.name}</div>
                    <div className="font-display text-base italic text-charcoal leading-tight mb-3">{item.product.name}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-nude">
                        <button onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal/60 hover:text-charcoal text-sm">−</button>
                        <span className="text-sm font-body">{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-charcoal/60 hover:text-charcoal text-sm">+</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{fmt(item.product.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.productId)} className="text-charcoal/30 hover:text-terra transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-nude bg-white">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] tracking-[0.18em] uppercase text-charcoal/55">Total</span>
              <span className="font-display text-3xl font-normal text-charcoal">{fmt(total())}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}
              className="block w-full text-center py-4 bg-charcoal text-white text-[11px] tracking-[0.28em] uppercase font-body font-medium hover:bg-terra transition-colors mb-3">
              Finalizar pedido
            </Link>
            <button onClick={closeCart}
              className="w-full py-3 border border-nude text-[10px] tracking-[0.2em] uppercase font-body text-charcoal hover:border-charcoal transition-colors">
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
