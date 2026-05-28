'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'Como é feito o processo de produção?', a: 'Cada peça é modelada à mão com argila de alta qualidade, passando por secagem natural, queima em forno cerâmico e acabamento artesanal. O processo leva de 7 a 15 dias.' },
  { q: 'As peças são resistentes?', a: 'Sim! A cerâmica após a queima torna-se muito resistente. Recomendamos evitar contato com água e produtos químicos para preservar o acabamento.' },
  { q: 'Faço pedidos personalizados?', a: 'Sim! Entre em contato pelo WhatsApp para conversarmos sobre personalizações de cor, tamanho e formato.' },
  { q: 'Qual o prazo de entrega?', a: 'Até 3 dias úteis de produção + prazo dos Correios (5 a 12 dias úteis). Retirada em Ponta Grossa/PR disponível.' },
  { q: 'Posso trocar meu pedido?', a: 'Aceitamos trocas em até 7 dias após o recebimento, desde que sem sinais de uso. Entre em contato pelo WhatsApp.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="px-8 md:px-12 py-20 bg-cream">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Dúvidas frequentes</p>
          <h2 className="font-display text-5xl font-light italic text-charcoal">FAQ</h2>
        </div>
        <div className="border-t border-nude">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-nude">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left">
                <span className="text-sm font-medium text-charcoal pr-8">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-charcoal/50 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="pb-5">
                  <p className="text-sm text-charcoal/65 leading-relaxed font-light">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
