'use client'
import Link from 'next/link'
import { useState } from 'react'
import { newsletterApi } from '@/lib/api'
import { toast } from 'sonner'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await newsletterApi.subscribe(email)
      toast.success('Inscrito com sucesso!')
      setEmail('')
    } catch { toast.error('Erro ao inscrever. Tente novamente.') }
    finally { setLoading(false) }
  }

  return (
    <footer>
      {/* Newsletter */}
      <div className="bg-charcoal py-20 px-8 text-center">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-body">Fique por dentro</p>
        <h2 className="font-display text-4xl font-light text-white italic mb-3">Novidades do ateliê</h2>
        <p className="text-sm text-sage font-light mb-10 tracking-wide">Lançamentos, bastidores e ofertas exclusivas</p>
        <form onSubmit={handleNewsletter} className="flex max-w-md mx-auto">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="flex-1 px-5 py-4 bg-white/7 border border-nude/20 text-white text-sm placeholder-white/30 focus:outline-none focus:border-nude/50 font-body"
          />
          <button type="submit" disabled={loading}
            className="px-7 py-4 bg-terra text-white text-[10px] tracking-[0.24em] uppercase font-body font-medium hover:bg-terra/90 transition-colors disabled:opacity-50 whitespace-nowrap">
            {loading ? '...' : 'Assinar'}
          </button>
        </form>
      </div>

      {/* Links */}
      <div className="bg-[#191c1a] px-8 md:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-display text-xl font-medium tracking-widest text-nude mb-1">ROSE MONTEIRO</div>
            <div className="font-script text-terra text-sm mb-4">Joias</div>
            <p className="text-xs text-nude/40 leading-relaxed font-light">Cerâmica artesanal com design autoral. Curitiba, PR.</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-gold mb-5 font-body">Loja</h4>
            {[['Todos os produtos','/produtos'],['Coleções','/colecoes'],['Brincos','/categorias/brincos'],['Atacado','/atacado']].map(([l,h]) => (
              <Link key={h} href={h} className="block text-xs text-nude/45 hover:text-nude mb-3 transition-colors font-light">{l}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-gold mb-5 font-body">Marca</h4>
            {[['Nossa história','/sobre'],['Processo criativo','/sobre'],['Contato','/contato']].map(([l,h]) => (
              <Link key={h} href={h} className="block text-xs text-nude/45 hover:text-nude mb-3 transition-colors font-light">{l}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-gold mb-5 font-body">Atendimento</h4>
            {[['WhatsApp','https://wa.me/5542999999999'],['Rastrear pedido','/contato'],['Trocas','/contato']].map(([l,h]) => (
              <a key={h} href={h} className="block text-xs text-nude/45 hover:text-nude mb-3 transition-colors font-light">{l}</a>
            ))}
          </div>
        </div>
        <div className="border-t border-nude/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-nude/28 font-light">© {new Date().getFullYear()} Rose Monteiro Joias. Todos os direitos reservados.</p>
          <p className="text-[11px] text-nude/28 font-light">Feito com cuidado em Curitiba, PR</p>
        </div>
      </div>
    </footer>
  )
}
