'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import {
  LayoutDashboard, Diamond, ShoppingCart, Users, Tag,
  FileText, Star, Settings, LogOut, Menu, X, ExternalLink
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',      href: '/admin',            icon: LayoutDashboard, section: 'principal' },
  { label: 'Produtos',       href: '/admin/produtos',   icon: Diamond,         section: 'loja' },
  { label: 'Pedidos',        href: '/admin/pedidos',    icon: ShoppingCart,    section: 'loja', badge: true },
  { label: 'Clientes',       href: '/admin/clientes',   icon: Users,           section: 'loja' },
  { label: 'Categorias',     href: '/admin/categorias', icon: Tag,             section: 'loja' },
  { label: 'Catálogo Atacado', href: '/admin/atacado',  icon: FileText,        section: 'ferramentas' },
  { label: 'Avaliações',     href: '/admin/avaliacoes', icon: Star,            section: 'ferramentas' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, clearAuth, isAdmin } = useAuthStore()
  const [sideOpen, setSideOpen] = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    if (!localStorage.getItem('rm_token')) router.replace('/login')
  }, [router])

  useEffect(() => {
    import('@/lib/api').then(({ adminOrdersApi }) => {
      adminOrdersApi.list({ status: 'PENDING', limit: 1 })
        .then(r => setPendingCount(r.data.pagination?.total || 0))
        .catch(() => {})
    })
  }, [])

  if (!mounted) return null

  const handleLogout = () => { clearAuth(); router.push('/login') }
  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const Sidebar = () => (
    <aside className="w-[240px] bg-charcoal flex flex-col h-full">
      <div className="px-6 py-7 border-b border-nude/12">
        <div className="font-display text-lg font-medium tracking-[0.1em] text-nude">ROSE MONTEIRO</div>
        <div className="font-script text-terra text-xs mt-0.5">Painel Admin</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {['principal','loja','ferramentas'].map(section => {
          const items = navItems.filter(n => n.section === section)
          const labels: Record<string,string> = { principal:'Principal', loja:'Loja', ferramentas:'Ferramentas' }
          return (
            <div key={section}>
              <p className="text-[9px] tracking-[0.28em] uppercase text-nude/28 px-6 pt-4 pb-2 font-body">{labels[section]}</p>
              {items.map(item => {
                const Icon    = item.icon
                const active  = isActive(item.href)
                const hasBadge = item.badge && pendingCount > 0
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSideOpen(false)}
                    className={`flex items-center gap-3 px-6 py-2.5 border-l-2 transition-colors cursor-pointer
                      ${active ? 'bg-terra/15 border-terra' : 'border-transparent hover:bg-nude/7'}`}>
                    <Icon className={`w-4.5 h-4.5 ${active ? 'text-terra' : 'text-nude/50'}`} size={18} />
                    <span className={`text-[13px] font-body flex-1 ${active ? 'text-nude font-medium' : 'text-nude/58'}`}>{item.label}</span>
                    {hasBadge && (
                      <span className="bg-terra text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="px-6 py-5 border-t border-nude/12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold/25 flex items-center justify-center font-display text-sm font-medium text-gold">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-nude/70 font-body truncate">{user?.name}</div>
            <div className="text-[10px] text-nude/35">{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-[11px] text-nude/40 hover:text-nude/70 transition-colors font-body">
          <LogOut size={14} /> Sair
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f5f2]">
      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0"><Sidebar /></div>

      {/* Mobile sidebar */}
      {sideOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-[240px] h-full"><Sidebar /></div>
          <div className="flex-1 bg-black/40" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-black/8 h-14 flex items-center px-6 gap-4 flex-shrink-0">
          <button className="md:hidden" onClick={() => setSideOpen(true)}><Menu size={20} className="text-charcoal/60" /></button>
          <div className="flex-1" />
          <a href="/" target="_blank" className="flex items-center gap-1.5 text-[11px] text-charcoal/45 hover:text-charcoal transition-colors font-body">
            <ExternalLink size={13} /> Ver site
          </a>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
