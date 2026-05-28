const reviews = [
  { text: '"A peça chegou ainda mais linda do que nas fotos. Sinto que carrego uma obra de arte. Qualidade impecável."', author: 'Carolina Martins', city: 'São Paulo, SP', initials: 'CM' },
  { text: '"Presenteei minha mãe e ela chorou. A embalagem, o produto, a atenção da Rose. Perfeito em todos os detalhes."', author: 'Juliana Pereira', city: 'Curitiba, PR', initials: 'JP' },
  { text: '"Compro há 3 anos. Cada peça conta uma história diferente. São joias que envelhecem com a gente."', author: 'Fernanda Souza', city: 'Porto Alegre, RS', initials: 'FS' },
]

export default function Testimonials() {
  return (
    <section className="px-8 md:px-12 py-20 bg-off-white">
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">O que dizem</p>
        <h2 className="font-display text-5xl font-light italic text-charcoal">Depoimentos</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white p-9 border border-nude/70">
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, j) => <span key={j} className="text-gold text-sm">★</span>)}
            </div>
            <p className="font-display text-lg italic font-light text-charcoal leading-[1.65] mb-6">{r.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-nude flex items-center justify-center font-display text-sm font-medium text-charcoal">{r.initials}</div>
              <div>
                <div className="text-[12px] font-medium text-charcoal">{r.author}</div>
                <div className="text-[11px] text-charcoal/40 font-light">{r.city}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
