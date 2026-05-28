'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const navLinks = [
  { label: 'Coleções',  href: '/colecoes' },
  { label: 'Brincos',   href: '/categorias/brincos' },
  { label: 'Colares',   href: '/categorias/colares' },
  { label: 'Anéis',     href: '/categorias/aneis' },
  { label: 'Sobre',     href: '/sobre' },
]

export default function Header() {
  const { openCart, count } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const qty = count()

  return (
    <header className="sticky top-0 z-40 bg-off-white border-b border-nude">
      <div className="flex items-center justify-between px-8 md:px-12 h-16">
        {/* Left nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.slice(0, 4).map(l => (
            <Link key={l.href} href={l.href}
              className="text-[10px] tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-colors font-body font-normal">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
          <div className="font-body text-[10px] tracking-[0.35em] uppercase text-charcoal">Rose Monteiro</div>
          <div className="font-display text-2xl font-semibold tracking-[0.12em] text-charcoal leading-none">JOIAS</div>
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-5 ml-auto">
          <Link href="/produtos" className="hidden md:block">
            <Search className="w-5 h-5 text-charcoal/60 hover:text-charcoal transition-colors" />
          </Link>
          <Heart className="hidden md:block w-5 h-5 text-charcoal/60 hover:text-charcoal transition-colors cursor-pointer" />
          <button onClick={openCart} className="relative">
            <ShoppingBag className="w-5 h-5 text-charcoal/60 hover:text-charcoal transition-colors" />
            {qty > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-terra text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {qty}
              </span>
            )}
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-off-white border-t border-nude px-8 py-6 flex flex-col gap-5">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-[11px] tracking-[0.2em] uppercase text-charcoal font-body">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
