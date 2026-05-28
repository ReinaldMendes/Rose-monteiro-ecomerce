'use client'
import { useEffect, useState } from 'react'
import { adminReviewsApi } from '@/lib/api'
import { Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AvaliacoesPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [tab,     setTab]     = useState<'false'|'true'>('false')
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await adminReviewsApi.list({ approved: tab })
      setReviews(res.data)
    } finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [tab])

  const approve = async (id: string) => {
    try { await adminReviewsApi.approve(id); toast.success('Avaliação aprovada'); fetch() }
    catch { toast.error('Erro') }
  }
  const del = async (id: string) => {
    if (!confirm('Excluir avaliação?')) return
    try { await adminReviewsApi.delete(id); toast.success('Excluída'); fetch() }
    catch { toast.error('Erro') }
  }

  return (
    <div className="p-8">
      <div className="mb-8"><h1 className="font-display text-3xl italic font-normal text-charcoal">Avaliações</h1></div>
      <div className="flex gap-0 border-b border-nude mb-6">
        {[['false','Pendentes'],['true','Aprovadas']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v as any)}
            className={`px-4 py-2.5 text-[11px] tracking-widest uppercase font-body border-b-2 transition-colors
              ${tab === v ? 'text-charcoal border-terra' : 'text-charcoal/45 border-transparent hover:text-charcoal'}`}>{l}</button>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? [...Array(3)].map((_,i) => <div key={i} className="h-24 bg-nude/30 animate-pulse" />) :
        reviews.length === 0 ? <p className="font-display text-xl italic text-charcoal/35 py-8">Nenhuma avaliação</p> :
        reviews.map(r => (
          <div key={r.id} className="bg-white border border-black/8 p-5 flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <span key={i} className={`text-sm ${i < r.rating ? 'text-gold' : 'text-nude'}`}>★</span>)}</div>
                <span className="font-medium text-sm text-charcoal">{r.authorName}</span>
                <span className="text-xs text-charcoal/40">em <em>{r.product?.name}</em></span>
              </div>
              {r.comment && <p className="font-display text-base italic font-light text-charcoal/70">{r.comment}</p>}
              <p className="text-[10px] text-charcoal/35 mt-2">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="flex flex-col gap-2">
              {!r.approved && (
                <button onClick={() => approve(r.id)} className="w-8 h-8 border border-green-200 flex items-center justify-center hover:bg-green-50 transition-colors">
                  <Check size={14} className="text-green-600" />
                </button>
              )}
              <button onClick={() => del(r.id)} className="w-8 h-8 border border-nude flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors">
                <Trash2 size={14} className="text-charcoal/55" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
