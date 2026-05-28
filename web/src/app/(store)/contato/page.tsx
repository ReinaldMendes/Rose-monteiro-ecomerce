'use client'
import { useState } from 'react'
import { MessageCircle, MapPin, Instagram } from 'lucide-react'
import { toast } from 'sonner'

export default function ContatoPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5542999999999'
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent('Olá! Vim pelo site da Rose Monteiro Joias e gostaria de mais informações.')}`

  return (
    <div>
      <div className="bg-charcoal px-8 md:px-12 py-16">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Fale conosco</p>
        <h1 className="font-display text-5xl font-light italic text-nude">Contato</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        <div className="bg-nude px-12 md:px-16 py-16 flex flex-col justify-center">
          <h2 className="font-display text-3xl font-normal text-charcoal mb-8">Vamos conversar?</h2>
          <div className="space-y-6">
            <a href={waLink} target="_blank"
              className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-0.5">WhatsApp</p>
                <p className="text-sm font-medium text-charcoal group-hover:text-terra transition-colors">(42) 99156-2593</p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-charcoal flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-nude" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-0.5">Ateliê</p>
                <p className="text-sm text-charcoal">Curitiba, PR</p>
                <p className="text-xs text-charcoal/45 font-light">Visitas com agendamento</p>
              </div>
            </div>
            <a href="https://instagram.com/rosemonteiro.joias" target="_blank" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-0.5">Instagram</p>
                <p className="text-sm font-medium text-charcoal group-hover:text-terra transition-colors">@rosemonteiro.joias</p>
              </div>
            </a>
          </div>
        </div>
        <div className="bg-off-white px-12 md:px-16 py-16 flex flex-col justify-center">
          <h2 className="font-display text-2xl font-normal text-charcoal mb-8">Horários de atendimento</h2>
          <div className="space-y-3 mb-10">
            {[['Segunda a Sexta','09h às 18h'],['Sábado','10h às 14h'],['Domingo','Fechado']].map(([d,h]) => (
              <div key={d} className="flex justify-between py-3 border-b border-nude">
                <span className="text-sm text-charcoal font-body">{d}</span>
                <span className="text-sm text-charcoal/60 font-body">{h}</span>
              </div>
            ))}
          </div>
          <a href={waLink} target="_blank"
            className="flex items-center justify-center gap-3 w-full py-4 bg-charcoal text-white text-[11px] tracking-[0.2em] uppercase font-body font-medium hover:bg-terra transition-colors">
            <MessageCircle className="w-4 h-4" /> Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
