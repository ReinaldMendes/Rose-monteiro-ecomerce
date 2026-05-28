'use client'
import Link from 'next/link'
import { useState } from 'react'
import { newsletterApi } from '@/lib/api'
import { toast } from 'sonner'
import { Phone, Mail, MapPin, Instagram, MessageCircle, Shield } from 'lucide-react'

export default function Footer() {
  const [email,   setEmail]   = useState('')
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
    finally   { setLoading(false) }
  }

  const waLink = `https://wa.me/5542999210868?text=${encodeURIComponent('Olá! Vim pelo site da Rose Monteiro Joias e gostaria de mais informações.')}`

  return (
    <footer>
      {/* ── Newsletter ───────────────────────────────────── */}
      <div className="bg-charcoal py-20 px-8 text-center">
        <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-body">Fique por dentro</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-white italic mb-3">
          Novidades do ateliê
        </h2>
        <p className="text-base text-sage font-light mb-10 tracking-wide">
          Lançamentos, bastidores e ofertas exclusivas para assinantes
        </p>
        <form onSubmit={handleNewsletter} className="flex max-w-md mx-auto">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="flex-1 px-5 py-4 bg-white/7 border border-nude/20 text-white text-base placeholder-white/30 focus:outline-none focus:border-nude/50 font-body"
          />
          <button type="submit" disabled={loading}
            className="px-7 py-4 bg-terra text-white text-[11px] tracking-[0.24em] uppercase font-body font-medium hover:bg-terra/90 transition-colors disabled:opacity-50 whitespace-nowrap">
            {loading ? '...' : 'Assinar'}
          </button>
        </form>
      </div>

      {/* ── Links + Info ─────────────────────────────────── */}
      <div className="bg-[#191c1a] px-8 md:px-16 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Marca */}
          <div className="md:col-span-1">
            <div className="font-display text-2xl font-medium tracking-widest text-nude mb-1">
              ROSE MONTEIRO
            </div>
            <div className="font-script text-terra text-base mb-5">Joias</div>
            <p className="text-sm text-nude/45 leading-relaxed font-light">
              Cerâmica artesanal com design autoral. Peças únicas feitas à mão, sem moldes,
              com acabamento em ouro e ródio.
            </p>
          </div>

          {/* Loja */}
          <div>
            <h4 className="text-[11px] tracking-[0.28em] uppercase text-gold mb-5 font-body">Loja</h4>
            {[
              ['Todos os produtos', '/produtos'],
              ['Coleções',          '/colecoes'],
              ['Brincos',           '/categorias/brincos'],
              ['Colares',           '/categorias/colares'],
              ['Anéis',             '/categorias/aneis'],
              ['Atacado',           '/atacado'],
            ].map(([l, h]) => (
              <Link key={h} href={h}
                className="block text-sm text-nude/50 hover:text-nude mb-3 transition-colors font-light">
                {l}
              </Link>
            ))}
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="text-[11px] tracking-[0.28em] uppercase text-gold mb-5 font-body">Atendimento</h4>

            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-3 mb-4 group">
              <MessageCircle size={16} className="text-[#25D366] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-nude/70 group-hover:text-nude transition-colors font-medium">
                  Cerâmicas Rose Monteiro
                </p>
                <p className="text-xs text-nude/35 font-light">WhatsApp</p>
              </div>
            </a>

            <a href="tel:+5542999210868" className="flex items-start gap-3 mb-4 group">
              <Phone size={16} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-nude/70 group-hover:text-nude transition-colors">(42) 9921-0868</p>
                <p className="text-xs text-nude/35 font-light">Ligue para nós</p>
              </div>
            </a>

            <a href="mailto:foggiattorm@hotmail.com" className="flex items-start gap-3 mb-4 group">
              <Mail size={16} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-nude/70 group-hover:text-nude transition-colors break-all">
                  foggiattorm@hotmail.com
                </p>
                <p className="text-xs text-nude/35 font-light">E-mail</p>
              </div>
            </a>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-nude/70 font-light leading-relaxed">
                  Estrada Eugênio Ricetti, 1771<br />
                  Casa 12, Oficinas<br />
                  Ponta Grossa, PR
                </p>
              </div>
            </div>
          </div>

          {/* Pagamento + Social */}
          <div>
            <h4 className="text-[11px] tracking-[0.28em] uppercase text-gold mb-5 font-body">
              Formas de pagamento
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Cartão de Crédito', 'Pix', 'Dinheiro'].map(p => (
                <span key={p}
                  className="text-[10px] tracking-wide px-3 py-1.5 border border-nude/20 text-nude/55 font-body">
                  {p}
                </span>
              ))}
            </div>

            <h4 className="text-[11px] tracking-[0.28em] uppercase text-gold mb-5 font-body">
              Redes sociais
            </h4>
            <a href="https://instagram.com/rosemonteiro.joias" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                <Instagram size={16} className="text-white" />
              </div>
              <span className="text-sm text-nude/55 group-hover:text-nude transition-colors">
                @rosemonteiro.joias
              </span>
            </a>

            {/* SSL Badge */}
            <div className="flex items-center gap-3 mt-8 border border-nude/15 px-4 py-3 w-fit">
              <Shield size={20} className="text-green-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-green-400 tracking-wide uppercase">Site 100% Seguro</p>
                <p className="text-[9px] text-nude/30 tracking-wide">Certificado SSL</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────── */}
        <div className="border-t border-nude/10 pt-8 space-y-2">
          <p className="text-sm text-nude/40 text-center font-light">
            Cerâmicas Rose Monteiro — Rosemari Monteiro Castilho Foggiatto Silveira
          </p>
          <p className="text-sm text-nude/30 text-center font-light">
            CNPJ: 54.313.517/0001-60 · Estrada Eugênio Ricetti, 1771, Casa 12, Oficinas, Ponta Grossa, PR
          </p>
          <p className="text-xs text-nude/20 text-center font-light mt-3">
            © {new Date().getFullYear()} Rose Monteiro Joias. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
