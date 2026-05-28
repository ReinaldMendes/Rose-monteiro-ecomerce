import { MetadataRoute } from 'next'
import { api } from '@/lib/api'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceramicasrosemonteiro.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/produtos`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/colecoes`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/sobre`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contato`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/atacado`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Categories
  const categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const cats = await api.get('/api/categories')
    for (const c of cats.data) {
      categoryRoutes.push({
        url: `${BASE}/categorias/${c.slug}`,
        lastModified: new Date(c.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  } catch {}

  // Products
  const productRoutes: MetadataRoute.Sitemap = []
  try {
    const prods = await api.get('/api/products', { params: { limit: 500, active: true } })
    for (const p of prods.data.products) {
      productRoutes.push({
        url: `${BASE}/produtos/${p.slug}`,
        lastModified: new Date(p.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
        ...(p.images?.[0] ? { images: [{ loc: p.images[0].url, title: p.name }] } : {}),
      })
    }
  } catch {}

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
