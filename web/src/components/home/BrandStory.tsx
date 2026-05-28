import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function BrandStory() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
      <div className="bg-charcoal relative overflow-hidden flex items-center justify-center min-h-[320px]">
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(155,135,51,0.05) 0,rgba(155,135,51,0.05) 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
        <div className="font-display text-[200px] font-semibold text-white opacity-[0.04] leading-none select-none absolute">RM</div>
        <p className="relative z-10 text-[10px] tracking-[0.32em] uppercase text-gold text-center">Desde 2018 · Ponta Grossa / PR</p>
      </div>
      <div className="bg-nude px-12 md:px-20 py-20 flex flex-col justify-center">
        <p className="font-script text-terra text-base mb-4">A Criadora</p>
        <h2 className="font-display text-4xl font-normal text-charcoal leading-tight mb-6">
          Celebrar o feito<br />à mão como arte
        </h2>
        <p className="text-sm text-charcoal/65 leading-[1.9] font-light mb-10">
          Cada peça nasce de um gesto intencional — a argila que cede às mãos, o fogo que transforma, o acabamento que revela. A Rose Monteiro Joias existe para criar conexões simbólicas por meio de peças únicas que carregam natureza, tempo, intenção e afeto.
        </p>
        <div className="flex gap-12 mb-10">
          {[['800+','Peças criadas'],['7','Anos de ateliê'],['100%','Artesanal']].map(([n,l]) => (
            <div key={l}>
              <div className="font-display text-4xl font-light text-charcoal">{n}</div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-charcoal/45 mt-1">{l}</div>
            </div>
          ))}
        </div>
        <Link href="/sobre" className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white text-[10px] tracking-[0.28em] uppercase font-body font-medium hover:bg-terra transition-colors w-fit">
          Conheça a história <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
