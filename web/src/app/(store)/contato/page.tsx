'use client'
import { MapPin, Phone, Mail, Instagram, MessageCircle, Clock } from 'lucide-react'

export default function ContatoPage() {
  const waLink = `https://wa.me/5542999210868?text=${encodeURIComponent('Olá! Vim pelo site da Rose Monteiro Joias e gostaria de mais informações.')}`

  return (
    <div>
      <div className="bg-charcoal px-8 md:px-12 py-16">
        <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Fale conosco</p>
        <h1 className="font-display text-5xl font-light italic text-nude">Contato</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        {/* Contatos */}
        <div className="bg-nude px-10 md:px-14 py-14 flex flex-col justify-center">
          <h2 className="font-display text-3xl font-normal text-charcoal mb-8">Vamos conversar?</h2>

          <div className="space-y-7">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-1">WhatsApp</p>
                <p className="text-base font-medium text-charcoal group-hover:text-terra transition-colors">
                  Cerâmicas Rose Monteiro
                </p>
                <p className="text-sm text-charcoal/55">(42) 9921-0868</p>
              </div>
            </a>

            <a href="tel:+5542999210868" className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-charcoal flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-nude" />
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-1">Telefone</p>
                <p className="text-base text-charcoal group-hover:text-terra transition-colors">(42) 9921-0868</p>
              </div>
            </a>

            <a href="mailto:foggiattorm@hotmail.com" className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-charcoal flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-nude" />
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-1">E-mail</p>
                <p className="text-base text-charcoal group-hover:text-terra transition-colors break-all">
                  foggiattorm@hotmail.com
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-charcoal flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-nude" />
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-1">Ateliê</p>
                <p className="text-base text-charcoal leading-relaxed">
                  Estrada Eugênio Ricetti, 1771, Casa 12<br />
                  Oficinas — Ponta Grossa, PR
                </p>
                <p className="text-sm text-charcoal/45 font-light mt-1">Visitas com agendamento</p>
              </div>
            </div>

            <a href="https://instagram.com/rosemonteiro.joias" target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal/45 font-body mb-1">Instagram</p>
                <p className="text-base font-medium text-charcoal group-hover:text-terra transition-colors">
                  @rosemonteiro.joias
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Horários + CNPJ */}
        <div className="bg-off-white px-10 md:px-14 py-14 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-gold" />
            <h2 className="font-display text-2xl font-normal text-charcoal">Horários de atendimento</h2>
          </div>

          <div className="space-y-0 mb-10 border border-nude">
            {[
              ['Segunda a Sexta', '09h às 18h'],
              ['Sábado',          '10h às 14h'],
              ['Domingo',         'Fechado'],
            ].map(([d, h]) => (
              <div key={d} className="flex justify-between px-5 py-4 border-b border-nude last:border-0">
                <span className="text-base text-charcoal font-body">{d}</span>
                <span className="text-base text-charcoal/60 font-body">{h}</span>
              </div>
            ))}
          </div>

          {/* Dados empresariais */}
          <div className="bg-cream p-6 border border-nude">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4 font-body">Dados da empresa</h3>
            <div className="space-y-2">
              <p className="text-sm text-charcoal font-medium">Cerâmicas Rose Monteiro</p>
              <p className="text-sm text-charcoal/65 font-light">
                Rosemari Monteiro Castilho Foggiatto Silveira
              </p>
              <p className="text-sm text-charcoal/65 font-light">CNPJ: 54.313.517/0001-60</p>
              <p className="text-sm text-charcoal/65 font-light leading-relaxed">
                Estrada Eugênio Ricetti, 1771, Casa 12<br />
                Oficinas — Ponta Grossa, PR
              </p>
            </div>
          </div>

          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-charcoal text-white text-[11px] tracking-[0.2em] uppercase font-body font-medium hover:bg-terra transition-colors mt-8">
            <MessageCircle className="w-4 h-4" /> Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
