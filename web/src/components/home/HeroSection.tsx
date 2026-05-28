'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
      {/* Left — dark */}
      <div className="bg-charcoal relative overflow-hidden flex flex-col justify-end p-12 md:p-16 min-h-[400px]">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(155,135,51,0.05) 0,rgba(155,135,51,0.05) 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-5 font-body">Nova Coleção · 2025</p>
          <h1 className="font-display text-6xl md:text-7xl font-light text-nude italic leading-[0.9] mb-6">
            <span className="not-italic font-semibold text-white block">Terra</span>em joia
          </h1>
          <p className="text-sm text-sage font-light leading-relaxed max-w-xs mb-10 tracking-wide">
            Peças únicas moldadas à mão, que carregam natureza, tempo, intenção e afeto.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/produtos"
              className="inline-flex items-center gap-3 px-8 py-4 bg-terra text-white text-[10px] tracking-[0.28em] uppercase font-body font-medium hover:bg-terra/90 transition-colors">
              Ver Coleção <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/sobre"
              className="inline-flex items-center px-8 py-4 border border-nude/35 text-nude text-[10px] tracking-[0.28em] uppercase font-body hover:border-nude/70 transition-colors">
              Nossa História
            </Link>
          </div>
        </div>
      </div>

      {/* Right — nude placeholder */}
      <div className="bg-nude relative flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-48 h-48 rounded-full bg-white/30 border border-white/50 flex items-center justify-center mx-auto mb-6">
            <span className="font-display text-5xl font-light text-charcoal/20 italic">RM</span>
          </div>
          <p className="font-display text-sm tracking-[0.22em] uppercase text-charcoal/40 italic">Foto editorial do produto</p>
        </div>
        <div className="absolute bottom-10 right-10 bg-charcoal text-nude p-4">
          <div className="text-[9px] tracking-[0.22em] uppercase text-nude/55">Peças únicas</div>
          <div className="font-display text-xl font-light">Feito à mão</div>
        </div>
      </div>
    </section>
  )
}
