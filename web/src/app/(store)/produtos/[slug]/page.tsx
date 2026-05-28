'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { productsApi } from '@/lib/api'
import { Product } from '@/types'
import { fmt } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'
import { Heart, MessageCircle, Share2, ChevronDown, ShoppingBag } from 'lucide-react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceramicasrosemonteiro.com.br'

export default function ProductPage() {
  const { slug }   = useParams<{ slug: string }>()
  const [product,  setProduct]  = useState<Product | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [activeImg,setActiveImg]= useState(0)
  const [openAcc,  setOpenAcc]  = useState<string | null>('cuidados')
  const { addItem } = useCartStore()

  useEffect(() => {
    productsApi.get(slug)
      .then(r => setProduct(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  // ── Schema.org Product ─────────────────────────────────
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type':    'Product',
    name:        product.name,
    description: product.description || product.story,
    sku:         product.sku,
    image:       product.images.map(i => i.url),
    brand: { '@type': 'Brand', name: 'Rose Monteiro Joias' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Rose Monteiro Joias',
      url:  SITE_URL,
    },
    material:   product.material,
    url:        `${SITE_URL}/produtos/${product.slug}`,
    offers: {
      '@type':           'Offer',
      price:             product.price.toFixed(2),
      priceCurrency:     'BRL',
      availability:      product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url:               `${SITE_URL}/produtos/${product.slug}`,
      seller: { '@type': 'Organization', name: 'Rose Monteiro Joias' },
      shippingDetails: {
        '@type':             'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BR' },
      },
    },
    ...(product.reviews && product.reviews.length > 0 ? {
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue:   5,
        reviewCount:   product.reviews.length,
        bestRating:    5,
        worstRating:   1,
      },
      review: product.reviews.slice(0, 3).map(r => ({
        '@type':       'Review',
        reviewRating:  { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        author:        { '@type': 'Person', name: r.authorName },
        reviewBody:    r.comment,
        datePublished: r.createdAt,
      })),
    } : {}),
  } : null

  // Breadcrumb schema
  const breadcrumbSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início',   item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: `${SITE_URL}/produtos` },
      ...(product.category ? [{ '@type': 'ListItem', position: 3, name: product.category.name, item: `${SITE_URL}/categorias/${product.category.slug}` }] : []),
      { '@type': 'ListItem', position: (product.category ? 4 : 3), name: product.name, item: `${SITE_URL}/produtos/${product.slug}` },
    ],
  } : null

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="bg-nude/40 animate-pulse aspect-[4/5] md:aspect-auto" />
      <div className="p-12 space-y-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-nude/50 animate-pulse rounded" />)}
      </div>
    </div>
  )

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="font-display text-2xl italic text-charcoal/40">Produto não encontrado</p>
    </div>
  )

  const handleAdd = () => { addItem(product); toast.success('Adicionado ao carrinho!') }
  const waLink    = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5542999999999'}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre: ${product.name}`)}`

  const accordions = [
    { key: 'cuidados', label: 'Cuidados com a peça',   content: 'Evite contato com água, perfume e produtos químicos. Guarde em local seco, de preferência na embalagem original. Limpe com pano seco e macio.' },
    { key: 'entrega',  label: 'Entrega e prazos',       content: 'Enviamos para todo o Brasil via Correios (PAC e Sedex). Prazo de produção: até 3 dias úteis. Prazo de entrega: 5 a 12 dias úteis. Retirada em Curitiba/PR disponível.' },
    { key: 'trocas',   label: 'Trocas e devoluções',    content: 'Aceitamos trocas em até 7 dias após o recebimento. O produto deve estar sem sinais de uso. Entre em contato pelo WhatsApp.' },
  ]

  const title       = product.seoTitle || `${product.name} | Rose Monteiro Joias`
  const description = product.seoDesc  || product.description || `${product.name} — joia artesanal em cerâmica feita à mão. ${product.material ? `Material: ${product.material}.` : ''} Peça exclusiva da Rose Monteiro Joias.`

  return (
    <>
      {/* Dynamic head for client component */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      {product.images[0] && <meta property="og:image" content={product.images[0].url} />}
      <meta property="og:url" content={`${SITE_URL}/produtos/${product.slug}`} />
      <meta property="og:type" content="product" />
      <meta property="product:price:amount"   content={product.price.toString()} />
      <meta property="product:price:currency" content="BRL" />
      <link rel="canonical" href={`${SITE_URL}/produtos/${product.slug}`} />

      {/* Schema.org JSON-LD */}
      {productSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-8 md:px-12 py-4 flex gap-2 items-center text-[11px] text-charcoal/40">
        <Link href="/"        className="hover:text-charcoal transition-colors">Início</Link><span>/</span>
        <Link href="/produtos" className="hover:text-charcoal transition-colors">Produtos</Link>
        {product.category && <><span>/</span><Link href={`/categorias/${product.category.slug}`} className="hover:text-charcoal transition-colors">{product.category.name}</Link></>}
        <span>/</span><span className="text-charcoal/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Gallery */}
        <div className="px-8 md:pl-12 md:pr-6 pb-12">
          <div className="relative aspect-[4/5] bg-nude overflow-hidden mb-3 cursor-zoom-in">
            {product.images[activeImg] ? (
              <Image src={product.images[activeImg].url} alt={product.images[activeImg].alt || `${product.name} — Rose Monteiro Joias`}
                fill className="object-cover" priority={activeImg === 0} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-charcoal/15" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2" role="list" aria-label="Galeria de imagens">
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImg(i)} role="listitem"
                  aria-label={`Ver imagem ${i + 1} de ${product.images.length}`}
                  className={`w-16 h-16 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-charcoal' : 'border-transparent hover:border-nude'}`}>
                  <Image src={img.url} alt={img.alt || `${product.name} — foto ${i + 1}`} width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-8 md:pl-6 md:pr-12 pb-16 border-l border-nude">
          <div className="pt-2">
            <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-body">
              {product.category?.name}{product.collection && ` · ${product.collection.name}`}
            </p>
            <h1 className="font-display text-5xl font-normal italic text-charcoal leading-tight mb-2">{product.name}</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/35 mb-6">SKU: {product.sku}</p>

            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-6" aria-label={`Avaliação: 5 de 5 estrelas, ${product.reviews.length} avaliações`}>
                <div className="flex gap-0.5" aria-hidden="true">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-gold text-sm">★</span>)}
                </div>
                <span className="text-xs text-charcoal/50">{product.reviews.length} avaliações</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-nude">
              <span className="font-display text-4xl font-normal text-charcoal" aria-label={`Preço: ${fmt(product.price)}`}>
                {fmt(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="font-display text-xl text-sage line-through" aria-label={`Preço original: ${fmt(product.comparePrice)}`}>
                    {fmt(product.comparePrice)}
                  </span>
                  <span className="bg-terra text-white text-[9px] tracking-[0.18em] uppercase px-2 py-1">
                    −{Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Story */}
            {product.story && (
              <div className="mb-8 pb-8 border-b border-nude">
                <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-body">A história da peça</p>
                <p className="font-display text-lg italic font-light text-charcoal leading-[1.8]">{product.story}</p>
              </div>
            )}

            {/* Specs */}
            <div className="grid grid-cols-2 border border-nude mb-8" role="list" aria-label="Especificações do produto">
              {([
                ['Material',    product.material],
                ['Acabamento',  product.finish],
                ['Dimensões',   product.dimensions],
                ['Peso',        product.weight ? `${product.weight}g` : null],
              ] as [string, string | null | undefined][]).filter(([, v]) => v).map(([k, v], idx, arr) => (
                <div key={k} role="listitem"
                  className={`p-3 border-b border-nude ${idx % 2 === 0 ? 'border-r' : ''} ${idx >= arr.length - 2 ? 'border-b-0' : ''}`}>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-gold mb-1 font-body">{k}</p>
                  <p className="text-sm text-charcoal">{v}</p>
                </div>
              ))}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8" aria-live="polite">
              <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'AVAILABLE' ? 'bg-green-500' : product.stockStatus === 'LOW_STOCK' ? 'bg-gold' : 'bg-red-400'}`} aria-hidden="true" />
              <span className="text-xs text-charcoal/60">
                {product.stockStatus === 'AVAILABLE' ? `${product.stock} em estoque` :
                 product.stockStatus === 'LOW_STOCK'  ? `Apenas ${product.stock} unidades` : 'Esgotado'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-4">
              {product.stockStatus !== 'OUT_OF_STOCK' ? (
                <button onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-charcoal text-white text-[11px] tracking-[0.28em] uppercase font-body font-medium hover:bg-terra transition-colors"
                  aria-label={`Adicionar ${product.name} ao carrinho`}>
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" /> Adicionar ao carrinho
                </button>
              ) : (
                <button disabled className="flex-1 py-4 bg-charcoal/20 text-charcoal/40 text-[11px] tracking-[0.28em] uppercase font-body cursor-not-allowed">
                  Esgotado
                </button>
              )}
              <button className="w-14 h-14 border border-nude flex items-center justify-center hover:border-terra transition-colors group"
                aria-label="Adicionar à lista de desejos">
                <Heart className="w-5 h-5 text-charcoal/60 group-hover:text-terra" aria-hidden="true" />
              </button>
            </div>

            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 border border-nude text-charcoal text-[11px] tracking-[0.2em] uppercase font-body hover:border-[#25D366] hover:text-[#25D366] transition-colors mb-6"
              aria-label="Tirar dúvidas pelo WhatsApp">
              <MessageCircle className="w-4 h-4" aria-hidden="true" /> Tirar dúvidas pelo WhatsApp
            </a>

            {/* Share */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40">Compartilhar</span>
              <button onClick={() => { if (navigator.share) navigator.share({ title: product.name, url: window.location.href }) }}
                className="w-8 h-8 border border-nude flex items-center justify-center hover:border-charcoal transition-colors"
                aria-label="Compartilhar produto">
                <Share2 className="w-3.5 h-3.5 text-charcoal/55" aria-hidden="true" />
              </button>
            </div>

            {/* Accordion */}
            <div className="mt-8 border-t border-nude">
              {accordions.map(acc => (
                <div key={acc.key} className="border-b border-nude">
                  <button onClick={() => setOpenAcc(openAcc === acc.key ? null : acc.key)}
                    className="w-full flex items-center justify-between py-4 text-left"
                    aria-expanded={openAcc === acc.key} aria-controls={`acc-${acc.key}`}>
                    <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal font-body">{acc.label}</span>
                    <ChevronDown className={`w-4 h-4 text-charcoal/50 transition-transform ${openAcc === acc.key ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {openAcc === acc.key && (
                    <div id={`acc-${acc.key}`} className="pb-4">
                      <p className="text-sm text-charcoal/65 font-light leading-relaxed">{acc.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
