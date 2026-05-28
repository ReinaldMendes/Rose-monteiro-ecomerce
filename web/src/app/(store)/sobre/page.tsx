import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceramicasrosemonteiro.com.br'

export const metadata: Metadata = {
  title: 'Nossa História — Rose Monteiro, Criadora de Joias em Cerâmica',
  description: 'Conheça a história de Rose Monteiro, criadora de joias únicas em cerâmica artesanal. Cada peça é feita à mão, sem moldes, com intenção e afeto. Ponta Grossa, PR.',
  alternates: { canonical: `${BASE}/sobre` },
  openGraph: {
    title: 'Nossa História — Rose Monteiro Joias',
    description: 'Conheça a criadora por trás das joias artesanais em cerâmica. Cada peça conta uma história.',
    url: `${BASE}/sobre`,
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rose Monteiro',
  jobTitle: 'Artesã e Criadora de Joias em Cerâmica',
  description: 'Criadora de joias artesanais únicas em cerâmica com design autoral. Cada peça é feita à mão, sem moldes, em Ponta Grossa, PR.',
  url: `${BASE}/sobre`,
  worksFor: { '@type': 'Organization', name: 'Rose Monteiro Joias', url: BASE },
  address: { '@type': 'PostalAddress', addressLocality: "Ponta Grossa"', addressRegion: 'PR', addressCountry: 'BR' },
  sameAs: ['https://www.instagram.com/rosemonteiro.joias'],
}

export default function SobrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div>
        <div className="bg-charcoal px-8 md:px-12 py-20 text-center"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(155,135,51,0.04) 0,rgba(155,135,51,0.04) 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }}>
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-body">A Criadora</p>
          <h1 className="font-display text-6xl font-light italic text-nude mb-4">Nossa História</h1>
          <p className="text-sage text-sm font-light max-w-md mx-auto leading-relaxed">
            Da argila à joia, da intenção ao afeto — conheça o universo Rose Monteiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
          <div className="bg-nude flex items-center justify-center min-h-[280px]">
            <div className="text-center">
              <div className="font-display text-[120px] font-semibold text-charcoal/8 leading-none" aria-hidden="true">RM</div>
              <p className="font-display text-sm tracking-[0.22em] uppercase text-charcoal/40 italic">Ateliê · Ponta Grossa, PR</p>
            </div>
          </div>
          <div className="bg-off-white px-10 md:px-16 py-16 flex flex-col justify-center">
            <p className="font-script text-terra text-base mb-4">O propósito</p>
            <h2 className="font-display text-4xl font-normal text-charcoal leading-tight mb-6">
              Celebrar o feito<br />à mão como arte
            </h2>
            <p className="text-sm text-charcoal/65 leading-[1.9] font-light mb-5">
              A Rose Monteiro Joias nasceu da paixão pelo processo criativo artesanal. Cada peça é moldada à mão em argila branca, passando por queima em forno cerâmico e acabamento cuidadoso — um processo que pode levar de 7 a 15 dias por lote.
            </p>
            <p className="text-sm text-charcoal/65 leading-[1.9] font-light">
              Sediada em Ponta Grossa/PR, a marca existe para criar conexões simbólicas por meio de peças únicas que carregam natureza, tempo, intenção e afeto. Nenhuma peça é exatamente igual à outra — essa é a beleza do feito à mão.
            </p>
          </div>
        </div>

        <div className="bg-cream px-8 md:px-12 py-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-3 font-body">O processo</p>
            <h2 className="font-display text-5xl font-light italic text-charcoal">Do barro à joia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              ['01','Argila',    'Seleção e preparação da argila de alta qualidade'],
              ['02','Modelagem', 'Cada peça moldada à mão com precisão e cuidado'],
              ['03','Queima',    'Forno cerâmico a 1000°C transforma a argila em cerâmica'],
              ['04','Acabamento','Ouro, ródio ou platina aplicados com esmero'],
            ].map(([n, t, d]) => (
              <div key={n} className="text-center">
                <div className="font-display text-5xl font-light text-gold/30 mb-4" aria-hidden="true">{n}</div>
                <h3 className="font-display text-xl font-normal text-charcoal mb-3">{t}</h3>
                <p className="text-sm text-charcoal/55 font-light leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-charcoal px-8 py-20 text-center">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-body">Pronta para explorar?</p>
          <h2 className="font-display text-5xl font-light italic text-nude mb-10">Conheça as peças</h2>
          <Link href="/produtos"
            className="inline-flex items-center gap-3 px-10 py-5 bg-terra text-white text-[11px] tracking-[0.28em] uppercase font-body font-medium hover:bg-terra/90 transition-colors">
            Ver catálogo <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  )
}
