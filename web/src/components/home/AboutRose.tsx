import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutRose() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[580px]">

      {/* ── Foto ─────────────────────────────────────────── */}
      <div className="relative bg-nude overflow-hidden min-h-[420px] md:min-h-0">
        {/*
          Substitua o bloco abaixo pela tag <Image> quando tiver a foto da Rose:
          <Image
            src="/rose-monteiro.jpg"
            alt="Rose Monteiro, criadora das Joias em Cerâmica"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        */}

        {/* Placeholder elegante enquanto não há foto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-nude via-[#ddc9b5] to-[#c9b09a]">
          <div className="w-40 h-40 rounded-full border border-white/40 bg-white/20 flex items-center justify-center">
            <span className="font-display text-6xl font-light text-charcoal/25 italic">R</span>
          </div>
          <p className="font-display text-sm tracking-[0.22em] uppercase text-charcoal/35 italic">
            Foto da Rose Monteiro
          </p>
        </div>

        {/* Tag flutuante — "joias em cerâmica" estilo do print */}
        <div className="absolute bottom-8 left-8 z-10">
          <p className="font-display text-3xl font-light italic text-charcoal/70 leading-tight">
            joias em
          </p>
          <p className="font-display text-3xl italic text-terra leading-tight">
            cerâmica
          </p>
        </div>

        {/* Selinhos decorativos */}
        <div className="absolute top-6 right-6 z-10 flex flex-col items-center gap-1">
          <div className="w-12 h-px bg-gold/50" />
          <div className="w-12 h-px bg-gold/30 mt-3" />
        </div>
      </div>

      {/* ── Texto ─────────────────────────────────────────── */}
      <div className="bg-off-white flex flex-col justify-center px-10 md:px-16 py-16">

        {/* Label */}
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-body">
          Quem é a Rose
        </p>

        {/* Título */}
        <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal italic leading-tight mb-6">
          Feito à mão,<br />
          <span className="font-normal not-italic">uma a uma.</span>
        </h2>

        {/* Texto principal — fino, elegante, fiel ao print */}
        <p className="text-[13px] text-charcoal/65 font-light leading-[1.95] mb-5 max-w-sm">
          As Joias de Cerâmica Rose Monteiro são feitas a mão, uma a uma, sem usar moldes.
          São peças autorais, exclusivas e sustentáveis — ressignificando o conceito de joias.
        </p>

        <p className="text-[13px] text-charcoal/55 font-light leading-[1.95] mb-8 max-w-sm">
          Cada peça nasce de uma intenção: transformar argila em arte, matéria-prima em
          significado. Um processo que leva dias, marcado pelo cuidado e pela presença
          artística de quem cria com as próprias mãos.
        </p>

        {/* Linha decorativa */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-px bg-gold/50" />
          <p className="font-display text-base italic text-gold font-light">
            Rose Monteiro
          </p>
          <div className="w-6 h-px bg-gold/30" />
        </div>

        {/* CTA */}
        <Link
          href="/sobre"
          className="inline-flex items-center gap-3 w-fit px-7 py-3.5 border border-charcoal text-charcoal text-[10px] tracking-[0.24em] uppercase font-body font-normal hover:bg-charcoal hover:text-white transition-colors duration-300"
        >
          Conheça a história <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  )
}
