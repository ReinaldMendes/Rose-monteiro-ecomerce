import Link from 'next/link'
import { MessageCircle, FileText, Package, Shield } from 'lucide-react'
export const metadata = { title: 'Atacado | Rose Monteiro Joias' }
export default function AtacadoPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5542999210868'
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent('Olá! Tenho interesse no programa de atacado da Rose Monteiro Joias.')}`
  return (
    <div>
      <div className="bg-charcoal px-8 md:px-12 py-20 text-center"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(155,135,51,0.04) 0,rgba(155,135,51,0.04) 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }}>
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-body">Para revendedores</p>
        <h1 className="font-display text-6xl font-light italic text-nude mb-4">Programa de Atacado</h1>
        <p className="text-sage text-sm font-light max-w-md mx-auto">Leve a arte da Rose Monteiro para seu negócio com condições exclusivas.</p>
      </div>
      <div className="bg-cream px-8 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[[Package,'Pedido mínimo','A partir de 5 peças por pedido com preços especiais de atacado.'],
            [FileText,'Catálogo digital','Catálogo PDF premium com fotos, descrições e preços de atacado.'],
            [Shield,'Exclusividade','Territórios exclusivos para parceiros selecionados.'],
          ].map(([Icon, t, d]: any) => (
            <div key={t} className="text-center">
              <div className="w-14 h-14 bg-nude flex items-center justify-center mx-auto mb-5">
                <Icon className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="font-display text-xl font-normal text-charcoal mb-3">{t}</h3>
              <p className="text-sm text-charcoal/60 font-light leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href={waLink} target="_blank"
            className="inline-flex items-center gap-3 px-10 py-5 bg-charcoal text-white text-[11px] tracking-[0.28em] uppercase font-body font-medium hover:bg-terra transition-colors">
            <MessageCircle className="w-4 h-4" /> Solicitar catálogo e condições
          </a>
        </div>
      </div>
    </div>
  )
}
