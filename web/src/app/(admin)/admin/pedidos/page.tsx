'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { adminOrdersApi } from '@/lib/api'
import { fmt, statusLabels, statusColors } from '@/lib/utils'
import { Search, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'

const STATUSES = ['','PENDING','CONFIRMED','IN_PRODUCTION','READY','SHIPPED','DELIVERED','CANCELLED','ABANDONED']
const STATUS_TABS = [
  { value: '',           label: 'Todos' },
  { value: 'PENDING',    label: 'Pendentes' },
  { value: 'CONFIRMED',  label: 'Confirmados' },
  { value: 'SHIPPED',    label: 'Enviados' },
  { value: 'ABANDONED',  label: 'Abandonados' },
]

export default function AdminOrdersPage() {
  const searchParams = useSearchParams()
  const [orders,  setOrders]  = useState<any[]>([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState(searchParams.get('status') || '')
  const [page,    setPage]    = useState(1)
  const limit = 20

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await adminOrdersApi.list({ page, limit, status: status || undefined, search: search || undefined })
      setOrders(res.data.orders)
      setTotal(res.data.pagination.total)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [page, status])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetch() }

  const waLink = (phone: string, orderNum: string) =>
    `https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá! Referente ao pedido ${orderNum} da Rose Monteiro Joias.`)}`

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl italic font-normal text-charcoal">Pedidos</h1>
          <p className="text-sm text-charcoal/45 mt-1">{total} pedidos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-nude mb-6">
        {STATUS_TABS.map(t => (
          <button key={t.value} onClick={() => { setStatus(t.value); setPage(1) }}
            className={`px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase font-body border-b-2 transition-colors
              ${status === t.value ? 'text-charcoal border-terra' : 'text-charcoal/45 border-transparent hover:text-charcoal'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6 max-w-sm">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por pedido, cliente..."
          className="flex-1 px-4 py-2.5 border border-nude bg-white text-sm font-body focus:outline-none focus:border-charcoal" />
        <button type="submit" className="px-4 bg-charcoal text-white hover:bg-terra transition-colors"><Search size={15} /></button>
      </form>

      <div className="bg-white border border-black/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/6 bg-nude/20">
                {['Pedido','Cliente','Telefone','Total','Entrega','Pagamento','Status','Data',''].map((h,i) => (
                  <th key={i} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-charcoal/45 font-body font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_,i) => (
                <tr key={i} className="border-b border-black/4">
                  {[...Array(9)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-nude/50 animate-pulse rounded" /></td>)}
                </tr>
              )) : orders.map(o => (
                <tr key={o.id} className="border-b border-black/4 hover:bg-nude/10 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pedidos/${o.id}`} className="font-display text-sm font-medium text-charcoal hover:text-terra">{o.orderNumber}</Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal">{o.customer?.name}</td>
                  <td className="px-4 py-3 text-xs text-charcoal/55">{o.customer?.phone}</td>
                  <td className="px-4 py-3 text-sm font-medium text-charcoal whitespace-nowrap">{fmt(o.total)}</td>
                  <td className="px-4 py-3 text-xs text-charcoal/60">{o.deliveryMethod === 'PICKUP' ? 'Retirada' : 'Envio'}</td>
                  <td className="px-4 py-3 text-xs text-charcoal/60">{o.paymentMethod || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-wide px-2.5 py-1 font-body font-medium ${statusColors[o.status]}`}>
                      {statusLabels[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal/45 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Link href={`/admin/pedidos/${o.id}`}
                        className="w-7 h-7 border border-nude flex items-center justify-center hover:border-charcoal text-xs text-charcoal/55 font-body transition-colors">
                        Ver
                      </Link>
                      {o.customer?.phone && (
                        <a href={waLink(o.customer.phone, o.orderNumber)} target="_blank"
                          className="w-7 h-7 border border-nude flex items-center justify-center hover:border-[#25D366] hover:bg-green-50 transition-colors">
                          <MessageCircle size={13} className="text-charcoal/55" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {Math.ceil(total/limit) > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/6">
            <span className="text-xs text-charcoal/45">Página {page} de {Math.ceil(total/limit)}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="w-8 h-8 border border-nude flex items-center justify-center hover:border-charcoal disabled:opacity-30"><ChevronLeft size={14}/></button>
              <button onClick={() => setPage(p => Math.min(Math.ceil(total/limit),p+1))} disabled={page===Math.ceil(total/limit)}
                className="w-8 h-8 border border-nude flex items-center justify-center hover:border-charcoal disabled:opacity-30"><ChevronRight size={14}/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
