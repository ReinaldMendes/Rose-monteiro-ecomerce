'use client'
import { useEffect, useState } from 'react'
import { adminAnalyticsApi, adminOrdersApi } from '@/lib/api'
import { fmt, statusLabels, statusColors } from '@/lib/utils'
import { TrendingUp, TrendingDown, ShoppingCart, Users, Diamond, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [data,    setData]    = useState<any>(null)
  const [revenue, setRevenue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminAnalyticsApi.dashboard(), adminAnalyticsApi.revenue()])
      .then(([d, r]) => { setData(d.data); setRevenue(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_,i) => <div key={i} className="bg-white border border-black/8 p-6 h-28 animate-pulse bg-nude/20" />)}
      </div>
    </div>
  )

  const maxRevenue = Math.max(...revenue.map((r: any) => r.revenue), 1)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl italic font-normal text-charcoal">Dashboard</h1>
        <p className="text-sm text-charcoal/45 mt-1 font-body">Visão geral do negócio</p>
      </div>

      {/* Alert */}
      {data?.abandonedCount > 0 && (
        <div className="flex items-start gap-3 p-4 bg-gold/8 border-l-3 border-gold mb-6" style={{borderLeftWidth:'3px'}}>
          <AlertTriangle size={18} className="text-gold flex-shrink-0 mt-0.5" />
          <p className="text-sm text-charcoal font-body">
            <strong>{data.abandonedCount} carrinho{data.abandonedCount > 1 ? 's' : ''} abandonado{data.abandonedCount > 1 ? 's' : ''}</strong> nas últimas 24h.{' '}
            <Link href="/admin/pedidos?status=ABANDONED" className="text-terra underline">Recuperar agora →</Link>
          </p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Faturamento', value: fmt(data?.revenueMonth || 0), change: data?.revenueGrowth, icon: TrendingUp },
          { label: 'Pedidos / mês', value: data?.ordersMonth || 0, icon: ShoppingCart },
          { label: 'Ticket médio', value: fmt(data?.avgTicket || 0), icon: Diamond },
          { label: 'Clientes', value: data?.totalCustomers || 0, icon: Users },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-black/8 p-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/45 mb-2 font-body">{m.label}</p>
            <p className="font-display text-3xl font-normal text-charcoal mb-1">{m.value}</p>
            {m.change && (
              <div className={`flex items-center gap-1 text-[11px] ${Number(m.change) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {Number(m.change) >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                {m.change}% vs mês anterior
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <div className="md:col-span-2 bg-white border border-black/8 p-6">
          <h3 className="text-[11px] tracking-[0.18em] uppercase text-charcoal/55 mb-5 font-body">Faturamento — últimos 6 meses</h3>
          <div className="flex items-end gap-3 h-36">
            {revenue.map((r: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gold/15 rounded-sm transition-all hover:bg-gold/25"
                  style={{ height: `${Math.max((r.revenue / maxRevenue) * 100, 4)}%` }} />
                <span className="text-[10px] text-charcoal/45 font-body">{r.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-black/8 p-6">
          <h3 className="text-[11px] tracking-[0.18em] uppercase text-charcoal/55 mb-4 font-body">Mais vendidos</h3>
          <div className="space-y-3">
            {(data?.topProducts || []).slice(0, 5).map((t: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-display text-lg font-light text-charcoal/30 w-5">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-charcoal truncate">{t.product?.name}</p>
                  <div className="h-1 bg-nude rounded mt-1">
                    <div className="h-full bg-gold rounded" style={{ width: `${(t._sum?.quantity / (data?.topProducts?.[0]?._sum?.quantity || 1)) * 100}%` }} />
                  </div>
                </div>
                <span className="text-[11px] text-charcoal/45 whitespace-nowrap">{t._sum?.quantity} un.</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-black/8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/6">
          <h3 className="text-[11px] tracking-[0.18em] uppercase text-charcoal/55 font-body">Pedidos recentes</h3>
          <Link href="/admin/pedidos" className="text-[10px] tracking-[0.15em] uppercase text-terra hover:opacity-70 font-body">Ver todos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                {['Pedido','Cliente','Total','Status','Data'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[9px] tracking-[0.22em] uppercase text-charcoal/40 font-body font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders || []).map((o: any) => (
                <tr key={o.id} className="border-b border-black/4 hover:bg-nude/10 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/admin/pedidos/${o.id}`} className="font-display text-sm font-medium text-charcoal hover:text-terra">{o.orderNumber}</Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-charcoal">{o.customer?.name}</td>
                  <td className="px-6 py-3 text-sm font-medium text-charcoal">{fmt(o.total)}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] tracking-wide px-2.5 py-1 font-body font-medium ${statusColors[o.status]}`}>
                      {statusLabels[o.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-charcoal/45">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
