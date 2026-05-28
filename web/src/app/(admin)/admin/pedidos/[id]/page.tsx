'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { adminOrdersApi } from '@/lib/api'
import { fmt, statusLabels, statusColors } from '@/lib/utils'
import { ArrowLeft, MessageCircle, Check } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_FLOW = ['PENDING','CONFIRMED','IN_PRODUCTION','READY','SHIPPED','DELIVERED']

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order,   setOrder]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating,setUpdating]= useState(false)

  const fetchOrder = () => {
    adminOrdersApi.get(id).then(r => { setOrder(r.data); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { fetchOrder() }, [id])

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      await adminOrdersApi.updateStatus(id, status)
      toast.success(`Status atualizado: ${statusLabels[status]}`)
      fetchOrder()
    } catch { toast.error('Erro ao atualizar') }
    finally { setUpdating(false) }
  }

  if (loading) return <div className="p-8 text-charcoal/40 font-display text-xl italic">Carregando...</div>
  if (!order)  return <div className="p-8 text-charcoal/40 font-display text-xl italic">Pedido não encontrado</div>

  const waLink = `https://wa.me/${order.customer?.phone?.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá, ${order.customer?.name}! Referente ao pedido ${order.orderNumber} da Rose Monteiro Joias.`)}`
  const curIdx = STATUS_FLOW.indexOf(order.status)

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pedidos" className="text-charcoal/40 hover:text-charcoal"><ArrowLeft size={20}/></Link>
        <div className="flex-1">
          <h1 className="font-display text-3xl italic font-normal text-charcoal">{order.orderNumber}</h1>
          <p className="text-sm text-charcoal/45 mt-0.5">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
        </div>
        <span className={`text-[11px] tracking-wide px-3 py-1.5 font-body font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
      </div>

      {/* Progress */}
      {!['CANCELLED','ABANDONED'].includes(order.status) && (
        <div className="bg-white border border-black/8 p-6 mb-5">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Progresso do pedido</h2>
          <div className="flex items-center gap-0">
            {STATUS_FLOW.map((s, i) => {
              const done   = i <= curIdx
              const active = i === curIdx
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <button onClick={() => updateStatus(s)} disabled={updating || i <= curIdx}
                    className={`flex flex-col items-center gap-1.5 cursor-pointer disabled:cursor-default group`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                      ${done ? 'bg-gold border-gold' : 'border-nude bg-white group-hover:border-gold/50'}`}>
                      {done ? <Check size={14} className="text-white" /> : <span className="text-[10px] text-charcoal/30">{i+1}</span>}
                    </div>
                    <span className={`text-[9px] tracking-wide uppercase font-body whitespace-nowrap ${active ? 'text-gold font-medium' : 'text-charcoal/40'}`}>
                      {statusLabels[s]}
                    </span>
                  </button>
                  {i < STATUS_FLOW.length - 1 && <div className={`flex-1 h-px mx-1 ${i < curIdx ? 'bg-gold' : 'bg-nude'}`} />}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer */}
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-4 font-body">Cliente</h2>
          <p className="font-medium text-charcoal mb-1">{order.customer?.name}</p>
          <p className="text-sm text-charcoal/55">{order.customer?.phone}</p>
          {order.customer?.email && <p className="text-sm text-charcoal/55">{order.customer?.email}</p>}
          {order.customer?.address && (
            <div className="mt-3 pt-3 border-t border-nude">
              <p className="text-xs text-charcoal/45 mb-1 uppercase tracking-wide">Endereço</p>
              <p className="text-sm text-charcoal/70">{order.customer?.address}</p>
              <p className="text-sm text-charcoal/70">{order.customer?.city} — {order.customer?.state} {order.customer?.zip}</p>
            </div>
          )}
          <a href={waLink} target="_blank"
            className="flex items-center gap-2 mt-4 text-[11px] tracking-wide text-[#25D366] border border-[#25D366]/30 px-4 py-2 hover:bg-green-50 transition-colors font-body w-fit">
            <MessageCircle size={14}/> Contato WhatsApp
          </a>
        </div>

        {/* Order info */}
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-4 font-body">Detalhes</h2>
          {[
            ['Entrega', order.deliveryMethod === 'PICKUP' ? 'Retirada' : 'Envio'],
            ['Pagamento', order.paymentMethod || 'A definir'],
            ['Observações', order.notes || '—'],
          ].map(([k,v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-nude/50 last:border-0">
              <span className="text-xs text-charcoal/45 uppercase tracking-wide">{k}</span>
              <span className="text-sm text-charcoal text-right max-w-[60%]">{v}</span>
            </div>
          ))}
          {['PENDING','CONFIRMED'].includes(order.status) && (
            <button onClick={() => updateStatus('CANCELLED')} disabled={updating}
              className="mt-4 text-[10px] tracking-wide uppercase text-red-400 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition-colors font-body">
              Cancelar pedido
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-black/8 p-6 mt-5">
        <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-4 font-body">Itens do pedido</h2>
        <div className="space-y-3">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-nude/50 last:border-0">
              <div>
                <p className="font-medium text-charcoal text-sm">{item.product?.name}</p>
                <p className="text-xs text-charcoal/45 mt-0.5">SKU: {item.product?.sku} · Qtd: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-charcoal">{fmt(item.total)}</p>
                <p className="text-xs text-charcoal/45">{fmt(item.unitPrice)} cada</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-nude flex justify-between items-center">
          <span className="text-xs text-charcoal/45 uppercase tracking-wide">Total</span>
          <span className="font-display text-2xl font-normal text-charcoal">{fmt(order.total)}</span>
        </div>
      </div>

      {/* Timeline */}
      {order.timeline?.length > 0 && (
        <div className="bg-white border border-black/8 p-6 mt-5">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-4 font-body">Histórico</h2>
          <div className="space-y-3">
            {order.timeline.map((t: any) => (
              <div key={t.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <div>
                  <span className={`text-[10px] tracking-wide px-2 py-0.5 font-body font-medium ${statusColors[t.status]}`}>{statusLabels[t.status]}</span>
                  {t.note && <p className="text-xs text-charcoal/55 mt-0.5">{t.note}</p>}
                  <p className="text-[10px] text-charcoal/35 mt-0.5">{new Date(t.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
