export interface ProductImage {
  id: string; url: string; publicId?: string; alt?: string; order: number; productId: string
}
export interface Category {
  id: string; name: string; slug: string; description?: string; bannerUrl?: string; order: number; active: boolean
  _count?: { products: number }
}
export interface Collection {
  id: string; name: string; slug: string; description?: string; bannerUrl?: string; featured: boolean; active: boolean
}
export interface Product {
  id: string; name: string; slug: string; sku: string
  description?: string; story?: string
  price: number; priceWholesale?: number; comparePrice?: number
  stock: number; stockStatus: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  material?: string; finish?: string; dimensions?: string; weight?: number
  featured: boolean; active: boolean
  seoTitle?: string; seoDesc?: string
  categoryId?: string; category?: Category
  collectionId?: string; collection?: Collection
  images: ProductImage[]
  reviews?: Review[]
  createdAt: string; updatedAt: string
}
export interface Customer {
  id: string; name: string; phone: string; email?: string
  address?: string; city?: string; state?: string; zip?: string
  createdAt: string
}
export interface OrderItem {
  id: string; quantity: number; unitPrice: number; total: number
  productId: string; product: Product
}
export interface OrderTimeline {
  id: string; status: string; note?: string; createdAt: string
}
export interface Order {
  id: string; orderNumber: string; status: string
  paymentMethod?: string; deliveryMethod: string
  notes?: string; subtotal: number; shippingCost: number; total: number
  customerId: string; customer: Customer
  items: OrderItem[]; timeline: OrderTimeline[]
  createdAt: string; updatedAt: string
}
export interface Review {
  id: string; rating: number; comment?: string; authorName: string
  approved: boolean; productId: string; createdAt: string
}
export interface CartItem {
  productId: string; product: Product; quantity: number
}
export interface User {
  id: string; name: string; email: string; role: string
}
