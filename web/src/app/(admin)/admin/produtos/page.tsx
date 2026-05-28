'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { adminProductsApi } from '@/lib/api'
import { fmt } from '@/lib/utils'
import { Plus, Search, Edit, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'

const stockColors: Record<string, string> = {
  AVAILABLE:    'text-green-600',
  LOW_STOCK:    'text-gold',
  OUT_OF_STOCK: 'text-red-500',
}
const stockLabels: Record<string, string> = {
  AVAILABLE: 'Disponível', LOW_STOCK: 'Baixo', OUT_OF_STOCK: 'Esgotado',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const limit = 15

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await adminProductsApi.list({ page, limit, search: search || undefined })
      setProducts(res.data.products)
      setTotal(res.data.pagination.total)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [page])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetch() }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return
    try {
      await adminProductsApi.delete(id)
      toast.success('Produto excluído')
      fetch()
    } catch { toast.error('Erro ao excluir') }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await adminProductsApi.duplicate(id)
      toast.success('Produto duplicado como rascunho')
      fetch()
    } catch { toast.error('Erro ao duplicar') }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl italic font-normal text-charcoal">Produtos</h1>
          <p className="text-sm text-charcoal/45 mt-1">{total} produtos cadastrados</p>
        </div>
        <Link href="/admin/produtos/novo"
          className="flex items-center gap-2 px-5 py-3 bg-charcoal text-white text-[11px] tracking-[0.18em] uppercase font-body font-medium hover:bg-terra transition-colors">
          <Plus size={15} /> Novo produto
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="flex flex-1 max-w-sm">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, SKU..."
            className="flex-1 px-4 py-2.5 border border-nude bg-white text-sm font-body focus:outline-none focus:border-charcoal" />
          <button type="submit" className="px-4 bg-charcoal text-white hover:bg-terra transition-colors">
            <Search size={15} />
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white border border-black/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/6 bg-nude/20">
                {['','Produto','SKU','Categoria','Preço','Atacado','Estoque','Status',''].map((h,i) => (
                  <th key={i} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-charcoal/45 font-body font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(6)].map((_,i) => (
                <tr key={i} className="border-b border-black/4">
                  {[...Array(9)].map((_,j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-nude/50 animate-pulse rounded" /></td>)}
                </tr>
              )) : products.map(p => (
                <tr key={p.id} className="border-b border-black/4 hover:bg-nude/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-nude overflow-hidden flex-shrink-0">
                      {p.images?.[0] ? (
                        <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full bg-nude" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-charcoal max-w-[200px] truncate">{p.name}</p>
                    <p className="text-[11px] text-charcoal/40 mt-0.5">{p.active ? 'Ativo' : 'Inativo'}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal/50 font-mono">{p.sku}</td>
                  <td className="px-4 py-3 text-xs text-charcoal/70">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-charcoal whitespace-nowrap">{fmt(p.price)}</td>
                  <td className="px-4 py-3 text-xs text-charcoal/55 whitespace-nowrap">{p.priceWholesale ? fmt(p.priceWholesale) : '—'}</td>
                  <td className="px-4 py-3 text-sm text-charcoal">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium font-body ${stockColors[p.stockStatus]}`}>
                      {stockLabels[p.stockStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/produtos/${p.id}`}
                        className="w-7 h-7 border border-nude flex items-center justify-center hover:border-charcoal hover:bg-nude/30 transition-colors">
                        <Edit size={13} className="text-charcoal/55" />
                      </Link>
                      <button onClick={() => handleDuplicate(p.id)}
                        className="w-7 h-7 border border-nude flex items-center justify-center hover:border-charcoal hover:bg-nude/30 transition-colors">
                        <Copy size={13} className="text-charcoal/55" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="w-7 h-7 border border-nude flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors">
                        <Trash2 size={13} className="text-charcoal/55" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/6">
            <span className="text-xs text-charcoal/45">{total} produtos · Página {page} de {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="w-8 h-8 border border-nude flex items-center justify-center hover:border-charcoal transition-colors disabled:opacity-30">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className="w-8 h-8 border border-nude flex items-center justify-center hover:border-charcoal transition-colors disabled:opacity-30">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
