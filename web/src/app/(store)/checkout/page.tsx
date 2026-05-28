'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { ordersApi } from '@/lib/api'
import { fmt } from '@/lib/utils'
import { toast } from 'sonner'
import { ShoppingBag, MapPin, Truck } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [delivery, setDelivery] = useState<'PICKUP' | 'DELIVERY'>('PICKUP')
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', city:'', state:'', zip:'', payment:'', notes:'' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.payment) return toast.error('Preencha todos os campos obrigatórios')
    if (items.length === 0) return toast.error('Seu carrinho está vazio')
    setLoading(true)
    try {
      const res = await ordersApi.create({
        customer:       { name: form.name, phone: form.phone, email: form.email, address: form.address, city: form.city, state: form.state, zip: form.zip },
        items:          items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod:  form.payment,
        deliveryMethod: delivery,
        notes:          form.notes,
      })
      clearCart()
      router.push(`/checkout/sucesso?order=${res.data.orderNumber}`)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao processar pedido')
    } finally { setLoading(false) }
  }

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <ShoppingBag className="w-16 h-16 text-charcoal/20" />
      <p className="font-display text-2xl italic text-charcoal/40">Seu carrinho está vazio</p>
      <a href="/produtos" className="px-8 py-3 bg-charcoal text-white text-[10px] tracking-widest uppercase font-body hover:bg-terra transition-colors">Ver produtos</a>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl italic font-light text-charcoal mb-10">Finalizar pedido</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left — form */}
          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-white p-6 border border-nude/70">
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-body">Suas informações</h2>
              <div className="space-y-3">
                {[['name','Nome completo *','text'],['phone','Telefone / WhatsApp *','tel'],['email','E-mail','email']].map(([k,l,t]) => (
                  <input key={k} type={t} placeholder={l} value={(form as any)[k]} onChange={set(k)}
                    className="w-full px-4 py-3 border border-nude text-sm font-body text-charcoal placeholder-charcoal/35 focus:outline-none focus:border-charcoal bg-off-white"
                    required={l.includes('*')} />
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white p-6 border border-nude/70">
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-body">Entrega</h2>
              <div className="space-y-3 mb-4">
                {[['PICKUP','Retirada no ateliê — Curitiba/PR'],['DELIVERY','Entrega no meu endereço']].map(([v, l]) => (
                  <label key={v} className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${delivery === v ? 'border-charcoal bg-charcoal/3' : 'border-nude hover:border-charcoal/30'}`}>
                    <input type="radio" name="delivery" value={v} checked={delivery === v as any}
                      onChange={() => setDelivery(v as 'PICKUP' | 'DELIVERY')} className="accent-charcoal" />
                    <div className="flex items-center gap-2">
                      {v === 'PICKUP' ? <MapPin className="w-4 h-4 text-charcoal/50" /> : <Truck className="w-4 h-4 text-charcoal/50" />}
                      <span className="text-sm font-body text-charcoal">{l}</span>
                    </div>
                  </label>
                ))}
              </div>
              {delivery === 'DELIVERY' && (
                <div className="space-y-3">
                  <input placeholder="Endereço completo" value={form.address} onChange={set('address')}
                    className="w-full px-4 py-3 border border-nude text-sm font-body focus:outline-none focus:border-charcoal bg-off-white" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Cidade" value={form.city} onChange={set('city')} className="px-4 py-3 border border-nude text-sm font-body focus:outline-none focus:border-charcoal bg-off-white" />
                    <input placeholder="Estado" value={form.state} onChange={set('state')} className="px-4 py-3 border border-nude text-sm font-body focus:outline-none focus:border-charcoal bg-off-white" />
                  </div>
                  <input placeholder="CEP" value={form.zip} onChange={set('zip')} className="w-full px-4 py-3 border border-nude text-sm font-body focus:outline-none focus:border-charcoal bg-off-white" />
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white p-6 border border-nude/70">
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-body">Pagamento</h2>
              <select value={form.payment} onChange={set('payment')} required
                className="w-full px-4 py-3 border border-nude text-sm font-body text-charcoal focus:outline-none focus:border-charcoal bg-off-white cursor-pointer">
                <option value="">Selecione a forma de pagamento *</option>
                <option>Pix</option><option>Cartão de crédito</option><option>Cartão de débito</option><option>Dinheiro (retirada)</option>
              </select>
            </div>

            {/* Notes */}
            <div className="bg-white p-6 border border-nude/70">
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-body">Observações</h2>
              <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Informações adicionais sobre o pedido..."
                className="w-full px-4 py-3 border border-nude text-sm font-body focus:outline-none focus:border-charcoal bg-off-white resize-none" />
            </div>
          </div>

          {/* Right — summary */}
          <div>
            <div className="bg-white p-6 border border-nude/70 sticky top-20">
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-5 font-body">Resumo do pedido</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-14 h-14 bg-nude flex-shrink-0 overflow-hidden">
                      {item.product.images?.[0] ? (
                        <Image src={item.product.images[0].url} alt={item.product.name} width={56} height={56} className="w-full h-full object-cover" />
                      ) : <ShoppingBag className="w-6 h-6 m-auto text-charcoal/20" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm italic text-charcoal leading-tight">{item.product.name}</p>
                      <p className="text-xs text-charcoal/45 mt-0.5">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-charcoal whitespace-nowrap">{fmt(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-nude pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-widest uppercase text-charcoal/55">Total</span>
                  <span className="font-display text-3xl font-normal text-charcoal">{fmt(total())}</span>
                </div>
                <p className="text-[10px] text-charcoal/40 mt-1">* Frete calculado após confirmação</p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-charcoal text-white text-[11px] tracking-[0.28em] uppercase font-body font-medium hover:bg-terra transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
              <p className="text-[10px] text-charcoal/35 text-center mt-3 leading-relaxed">
                Ao confirmar, entraremos em contato pelo WhatsApp para finalizar o pagamento.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
