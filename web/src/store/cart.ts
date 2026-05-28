import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem:    (product: Product, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty:  (productId: string, qty: number) => void
  clearCart:  () => void
  openCart:   () => void
  closeCart:  () => void
  total:      () => number
  count:      () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.productId === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
              ),
              isOpen: true,
            }
          }
          return { items: [...state.items, { productId: product.id, product, quantity: qty }], isOpen: true }
        })
      },

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.productId !== productId) })),

      updateQty: (productId, qty) => {
        if (qty < 1) return get().removeItem(productId)
        set((state) => ({
          items: state.items.map(i => i.productId === productId ? { ...i, quantity: qty } : i),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total:     () => get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
      count:     () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'rm-cart', skipHydration: true }
  )
)
