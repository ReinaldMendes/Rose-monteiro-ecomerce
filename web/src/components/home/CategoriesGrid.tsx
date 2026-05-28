import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const cats = [
  { name:'Brincos',   slug:'brincos',    count:32, bg:'from-[#c9b89a] to-[#a8906e]' },
  { name:'Colares',   slug:'colares',    count:18, bg:'from-[#ABBAB0] to-[#8aa09a]' },
  { name:'Anéis',     slug:'aneis',      count:14, bg:'from-[#B75D45] to-[#8d3e2b]' },
  { name:'Ouro',      slug:'ouro',       count:22, bg:'from-[#9B8733] to-[#7a6a20]' },
]

export default function CategoriesGrid() {
  return (
    <section className="px-8 md:px-12 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Explorar</p>
          <h2 className="font-display text-5xl font-light italic text-charcoal">Categorias</h2>
        </div>
        <Link href="/produtos" className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-terra hover:opacity-70 transition-opacity">
          Ver todas <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map(cat => (
          <Link key={cat.slug} href={`/categorias/${cat.slug}`}
            className="group relative aspect-[2/3] overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-b ${cat.bg} transition-transform duration-700 group-hover:scale-105`} />
            <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/50 to-transparent">
              <div>
                <div className="font-display text-2xl text-white font-normal">{cat.name}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-white/55 mt-1">{cat.count} peças</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
