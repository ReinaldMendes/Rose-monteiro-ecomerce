'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { adminProductsApi, adminCatalogApi } from '@/lib/api'
import { fmt } from '@/lib/utils'
import { FileDown, Printer, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

export default function AtacadoPage() {
  const [products,  setProducts]  = useState<any[]>([])
  const [selected,  setSelected]  = useState<Set<string>>(new Set())
  const [loading,   setLoading]   = useState(true)
  const [generating,setGenerating]= useState(false)

  useEffect(() => {
    adminProductsApi.list({ limit: 100, active: 'true' }).then(r => {
      const ps = r.data.products || []
      setProducts(ps)
      setSelected(new Set(ps.map((p:any) => p.id)))
    }).catch(()=>{}).finally(() => setLoading(false))
  }, [])

  const toggle = (id: string) => {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  const handleGenerate = async () => {
    if (selected.size === 0) return toast.error('Selecione ao menos um produto')
    setGenerating(true)
    try {
      const res = await adminCatalogApi.generate(Array.from(selected))
      const blob = new Blob([res.data], { type: 'text/html' })
      const url  = URL.createObjectURL(blob)
      const win  = window.open(url, '_blank')
      if (win) {
        win.onload = () => {
          setTimeout(() => { win.print(); URL.revokeObjectURL(url) }, 500)
        }
      }
      toast.success('Catálogo gerado! Use Ctrl+P para salvar como PDF.')
    } catch { toast.error('Erro ao gerar catálogo') }
    finally { setGenerating(false) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl italic font-normal text-charcoal">Catálogo Atacado</h1>
          <p className="text-sm text-charcoal/45 mt-1">Selecione os produtos e gere o catálogo PDF premium</p>
        </div>
        <button onClick={handleGenerate} disabled={generating || selected.size === 0}
          className="flex items-center gap-2 px-6 py-3 bg-terra text-white text-[11px] tracking-widest uppercase font-body font-medium hover:bg-terra/90 transition-colors disabled:opacity-40">
          {generating ? <>Gerando...</> : <><FileDown size={15}/> Gerar PDF ({selected.size})</>}
        </button>
      </div>

      <div className="bg-gold/6 border border-gold/20 border-l-4 border-l-gold p-4 mb-6 flex items-start gap-3">
        <Printer size={16} className="text-gold flex-shrink-0 mt-0.5" />
        <p className="text-sm text-charcoal/70 font-body">
          O catálogo abre em nova aba com layout editorial premium. Use <strong>Ctrl+P → Salvar como PDF</strong> para exportar e compartilhar pelo WhatsApp ou e-mail.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-charcoal/55 font-body">{selected.size} de {products.length} selecionados</span>
        <div className="flex gap-3">
          <button onClick={() => setSelected(new Set(products.map(p => p.id)))}
            className="text-[11px] tracking-wide text-terra hover:opacity-70 font-body">Selecionar todos</button>
          <button onClick={() => setSelected(new Set())}
            className="text-[11px] tracking-wide text-charcoal/45 hover:text-charcoal font-body">Limpar</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_,i) => <div key={i} className="h-20 bg-nude/30 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {products.map(p => {
            const isSelected = selected.has(p.id)
            return (
              <div key={p.id} onClick={() => toggle(p.id)}
                className={`flex items-center gap-3 p-4 border cursor-pointer transition-all
                  ${isSelected ? 'border-terra/40 bg-terra/4' : 'border-nude bg-white hover:border-charcoal/20'}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggle(p.id)}
                  onClick={e => e.stopPropagation()} className="accent-terra w-4 h-4 flex-shrink-0" />
                <div className="w-12 h-12 bg-nude flex-shrink-0 overflow-hidden">
                  {p.images?.[0] ? (
                    <Image src={p.images[0].url} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={16} className="text-charcoal/20" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                  <p className="text-[10px] text-charcoal/45 mt-0.5 font-body">{p.sku}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {p.priceWholesale && <p className="text-sm font-medium text-terra">{fmt(p.priceWholesale)}</p>}
                  <p className="text-[10px] text-charcoal/40 font-body">atacado</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
