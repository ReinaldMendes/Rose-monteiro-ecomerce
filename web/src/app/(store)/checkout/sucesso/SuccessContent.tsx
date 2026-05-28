'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, MessageCircle } from 'lucide-react'

export default function SuccessContent() {
  const params      = useSearchParams()
  const orderNumber = params.get('order')
  const phone       = process.env.NEXT_PUBLIC_WHATSAPP || '5542999210868'
  const waMsg       = `Olá! Acabei de fazer o pedido ${orderNumber} no site da Rose Monteiro Joias. Gostaria de confirmar os detalhes.`
  const waLink      = `https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" />
        <h1 className="font-display text-4xl italic font-light text-charcoal mb-3">
          Pedido confirmado!
        </h1>

        {orderNumber && (
          <div className="bg-white border border-nude px-6 py-4 mb-6 inline-block">
            <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/45 mb-1 font-body">
              Número do pedido
            </p>
            <p className="font-display text-2xl font-medium text-charcoal">{orderNumber}</p>
          </div>
        )}

        <p className="text-sm text-charcoal/65 font-light leading-relaxed mb-8">
          Recebemos seu pedido! Em breve entraremos em contato pelo WhatsApp para
          confirmar os detalhes e combinar o pagamento.
        </p>

        <div className="flex flex-col gap-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white text-[11px] tracking-[0.2em] uppercase font-body font-medium hover:bg-[#1ebe5d] transition-colors">
            <MessageCircle className="w-4 h-4" />
            Falar pelo WhatsApp
          </a>
          <Link href="/produtos"
            className="w-full py-4 border border-nude text-charcoal text-[11px] tracking-[0.2em] uppercase font-body hover:border-charcoal transition-colors">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
