import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-off-white gap-6">
      <div className="font-display text-[120px] font-light text-nude leading-none">404</div>
      <h1 className="font-display text-3xl italic font-light text-charcoal">Página não encontrada</h1>
      <Link href="/" className="px-8 py-3 bg-charcoal text-white text-[10px] tracking-widest uppercase font-body hover:bg-terra transition-colors">
        Voltar ao início
      </Link>
    </div>
  )
}
