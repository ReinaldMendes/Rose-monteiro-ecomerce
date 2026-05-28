'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Script from 'next/script'
import { categoriesApi } from '@/lib/api'
import ProductCard from '@/components/products/ProductCard'
import { ShoppingBag } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceramicasrosemonteiro.com.br'

export default function CategoryPage() {
  const { slug }    = useParams<{ slug: string }>()
  const [cat,       setCat]    = useState<any>(null)
  const [loading,   setLoading]= useState(true)

  useEffect(() => {
    categoriesApi.get(slug).then(r => setCat(r.data)).finally(() => setLoading(false))
  }, [slug])

  const breadcrumbSchema = cat ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início',    item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Produtos',  item: `${BASE}/produtos` },
      { '@type': 'ListItem', position: 3, name: cat.name,    item: `${BASE}/categorias/${slug}` },
    ],
  } : null

  const collectionSchema = cat && cat.products?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.name} — Rose Monteiro Joias`,
    description: cat.description || `Joias artesanais em cerâmica na categoria ${cat.name}. Peças únicas feitas à mão pela Rose Monteiro.`,
    url: `${BASE}/categorias/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: cat.products.length,
      itemListElement: cat.products.slice(0, 10).map((p: any, i: number) => ({
        '@type': 'ListItem', position: i + 1,
        url: `${BASE}/produtos/${p.slug}`,
        name: p.name,
      })),
    },
  } : null

  if (loading) return <div className="p-12 text-center font-display text-2xl italic text-charcoal/40 animate-pulse">Carregando...</div>
  if (!cat)    return <div className="p-12 text-center font-display text-2xl italic text-charcoal/40">Categoria não encontrada</div>

  const title = `${cat.name} em Cerâmica — Rose Monteiro Joias`
  const desc  = cat.description || `Joias artesanais em cerâmica na categoria ${cat.name}. ${cat.products?.length || 0} peças únicas feitas à mão. Envio para todo o Brasil.`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:type"        content="website" />
      <link rel="canonical" href={`${BASE}/categorias/${slug}`} />

      {breadcrumbSchema  && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />}
      {collectionSchema  && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />}

      <div>
        <div className="bg-charcoal px-8 md:px-12 py-16">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-2 font-body">Categorias</p>
          <h1 className="font-display text-5xl font-light italic text-nude">{cat.name}</h1>
          {cat.description && <p className="text-sm text-sage font-light mt-3 max-w-md">{cat.description}</p>}
          {cat.products?.length > 0 && <p className="text-xs text-sage/60 mt-2">{cat.products.length} peças disponíveis</p>}
        </div>
        <div className="px-8 md:px-12 py-12">
          {cat.products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {cat.products.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-charcoal/35">
              <ShoppingBag className="w-12 h-12 mb-4" aria-hidden="true" />
              <p className="font-display text-2xl italic">Nenhum produto nesta categoria</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
