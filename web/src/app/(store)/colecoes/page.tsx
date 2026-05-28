'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collectionsApi } from '@/lib/api'
import { ArrowRight } from 'lucide-react'

export default function ColecoesPage() {
  const [cols, setCols] = useState<any[]>([])
  useEffect(() => { collectionsApi.list().then(r => setCols(r.data)).catch(()=>{}) }, [])
  return (
    <div>
      <div className="bg-charcoal px-8 md:px-12 py-16">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Universo Rose Monteiro</p>
        <h1 className="font-display text-5xl font-light italic text-nude">Coleções</h1>
      </div>
      <div className="px-8 md:px-12 py-16">
        {cols.length === 0 ? (
          <div className="text-center py-16 font-display text-2xl italic text-charcoal/35">Em breve, novas coleções</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cols.map(c => (
              <Link key={c.id} href={`/colecoes/${c.slug}`}
                className="group relative aspect-[3/2] overflow-hidden bg-nude flex items-end">
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                <div className="relative z-10 p-8">
                  <h2 className="font-display text-3xl font-normal text-white italic mb-2">{c.name}</h2>
                  {c.description && <p className="text-sm text-white/60 font-light mb-4">{c.description}</p>}
                  <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gold">
                    Explorar <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
