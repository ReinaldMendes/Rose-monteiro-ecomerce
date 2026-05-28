'use client'
import { useEffect, useState } from 'react'
import { adminCategoriesApi } from '@/lib/api'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function CategoriasPage() {
  const [cats,    setCats]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [form,    setForm]    = useState({ name: '' })

  const fetch = async () => {
    setLoading(true)
    adminCategoriesApi.list().then(r => setCats(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [])

  const save = async () => {
    if (!form.name) return
    try {
      if (editing?.id) { await adminCategoriesApi.update(editing.id, form); toast.success('Atualizada') }
      else             { await adminCategoriesApi.create(form);             toast.success('Criada') }
      setEditing(null); setForm({ name: '' }); fetch()
    } catch { toast.error('Erro') }
  }

  const del = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return
    try { await adminCategoriesApi.delete(id); toast.success('Excluída'); fetch() }
    catch { toast.error('Erro ao excluir') }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl italic font-normal text-charcoal">Categorias</h1>
        <button onClick={() => { setEditing({}); setForm({ name: '' }) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white text-[11px] tracking-widest uppercase font-body hover:bg-terra transition-colors">
          <Plus size={14}/> Nova
        </button>
      </div>

      {editing !== null && (
        <div className="bg-white border border-black/8 p-5 mb-5">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-4 font-body">{editing?.id ? 'Editar' : 'Nova'} categoria</h2>
          <div className="flex gap-3">
            <input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="Nome da categoria"
              className="flex-1 px-4 py-2.5 border border-nude bg-off-white text-sm font-body focus:outline-none focus:border-charcoal" autoFocus />
            <button onClick={save} className="w-10 h-10 bg-charcoal flex items-center justify-center hover:bg-terra transition-colors">
              <Check size={15} className="text-white" />
            </button>
            <button onClick={() => setEditing(null)} className="w-10 h-10 border border-nude flex items-center justify-center hover:border-charcoal transition-colors">
              <X size={15} className="text-charcoal/55" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-black/8 overflow-hidden">
        {loading ? [...Array(4)].map((_,i) => <div key={i} className="h-12 border-b border-black/4 animate-pulse bg-nude/20" />) :
        cats.map(c => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5 border-b border-black/5 last:border-0 hover:bg-nude/10 transition-colors">
            <div>
              <span className="text-sm font-medium text-charcoal">{c.name}</span>
              <span className="text-xs text-charcoal/40 ml-3 font-body">{c._count?.products || 0} produtos</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(c); setForm({ name: c.name }) }}
                className="w-7 h-7 border border-nude flex items-center justify-center hover:border-charcoal transition-colors">
                <Edit size={13} className="text-charcoal/55" />
              </button>
              <button onClick={() => del(c.id, c.name)}
                className="w-7 h-7 border border-nude flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors">
                <Trash2 size={13} className="text-charcoal/55" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
