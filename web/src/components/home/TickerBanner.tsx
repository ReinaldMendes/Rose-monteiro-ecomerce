export default function TickerBanner() {
  const items = ['Cerâmica artesanal','Feito à mão','Design autoral','Curitiba, PR','Frete para todo o Brasil','Peças únicas']
  const doubled = [...items, ...items]
  return (
    <div className="bg-gold py-3 overflow-hidden">
      <div className="ticker-inner gap-16">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-4 flex-shrink-0">
            <span className="text-[10px] tracking-[0.28em] uppercase text-white font-body">{item}</span>
            <span className="w-1 h-1 bg-white/45 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  )
}
