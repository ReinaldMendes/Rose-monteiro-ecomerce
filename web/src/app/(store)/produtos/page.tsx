'use client'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { productsApi, categoriesApi } from '@/lib/api'
import ProductCard from '@/components/products/ProductCard'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Product, Category } from '@/types'

export default function ProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('')
  const [sort,       setSort]       = useState('createdAt')
  const [page,       setPage]       = useState(1)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productsApi.list({ page, limit: 12, search: search || undefined, category: category || undefined, sort })
      setProducts(res.data.products)
      setTotal(res.data.pagination.total)
    } finally { setLoading(false) }
  }

  useEffect(() => { categoriesApi.list().then(r => setCategories(r.data)) }, [])
  useEffect(() => { fetchProducts() }, [page, category, sort])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchProducts() }

  return (
    <>
      {/* SEO inline para página client-side */}
      <title>Produtos — Rose Monteiro Joias | Cerâmica Artesanal</title>

      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-charcoal px-8 md:px-12 py-16">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Catálogo</p>
          <h1 className="font-display text-5xl font-light italic text-nude">Todos os produtos</h1>
          <p className="text-sm text-sage font-light mt-3">{total} peças disponíveis</p>
        </div>

        <div className="px-8 md:px-12 py-10">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <form onSubmit={handleSearch} className="flex flex-1 max-w-sm">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produtos..."
                className="flex-1 px-4 py-3 border border-nude bg-white text-sm font-body text-charcoal placeholder-charcoal/35 focus:outline-none focus:border-charcoal"
                aria-label="Buscar produtos" />
              <button type="submit" className="px-4 py-3 bg-charcoal text-white hover:bg-terra transition-colors" aria-label="Buscar">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="flex gap-3">
              <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}
                className="px-4 py-3 border border-nude bg-white text-sm font-body text-charcoal focus:outline-none cursor-pointer"
                aria-label="Filtrar por categoria">
                <option value="">Todas categorias</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
                className="px-4 py-3 border border-nude bg-white text-sm font-body text-charcoal focus:outline-none cursor-pointer"
                aria-label="Ordenar produtos">
                <option value="createdAt">Mais recentes</option>
                <option value="price">Menor preço</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-nude/40 animate-pulse">
                  <div className="aspect-[4/5]" />
                  <div className="p-5 space-y-2">
                    <div className="h-2 bg-nude rounded w-1/3" />
                    <div className="h-4 bg-nude rounded w-3/4" />
                    <div className="h-3 bg-nude rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24 text-charcoal/40">
              <SlidersHorizontal className="w-12 h-12 mx-auto mb-4" />
              <p className="font-display text-2xl italic">Nenhum produto encontrado</p>
            </div>
          )}

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(Math.ceil(total / 12))].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 text-sm font-body border transition-colors
                    ${page === i + 1 ? 'bg-charcoal text-white border-charcoal' : 'border-nude text-charcoal hover:border-charcoal'}`}
                  aria-label={`Página ${i + 1}`} aria-current={page === i + 1 ? 'page' : undefined}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
