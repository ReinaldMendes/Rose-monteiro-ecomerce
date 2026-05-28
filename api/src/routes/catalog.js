const router = require('express').Router()
const prisma = require('../lib/prisma')
const { authenticate, requireAdmin } = require('../middleware/auth')

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

// POST /api/catalog/generate  [ADMIN]
router.post('/generate', authenticate, requireAdmin, async (req, res) => {
  const { productIds } = req.body
  if (!productIds?.length) return res.status(400).json({ error: 'Selecione ao menos um produto' })

  const products = await prisma.product.findMany({
    where:   { id: { in: productIds } },
    include: { images: { orderBy: { order: 'asc' }, take: 1 }, category: true },
  })

  // Generate HTML for the catalog
  const productCards = products.map(p => `
    <div class="product-card">
      <div class="product-image">
        ${p.images[0] ? `<img src="${p.images[0].url}" alt="${p.name}" />` : `<div class="no-image">📷</div>`}
      </div>
      <div class="product-info">
        <div class="product-category">${p.category?.name || ''}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-sku">SKU: ${p.sku}</div>
        ${p.description ? `<p class="product-desc">${p.description}</p>` : ''}
        <div class="product-pricing">
          ${p.priceWholesale ? `
            <div class="price-wholesale">
              <span class="price-label">Preço Atacado</span>
              <span class="price-value">${fmt(p.priceWholesale)}</span>
            </div>` : ''}
          <div class="price-retail">
            <span class="price-label">Preço Varejo</span>
            <span class="price-value retail">${fmt(p.price)}</span>
          </div>
        </div>
        ${p.material ? `<div class="product-material">Material: ${p.material}</div>` : ''}
      </div>
    </div>
  `).join('')

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo Rose Monteiro Joias</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Red+Hat+Display:wght@300;400;500&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --gold: #9B8733; --charcoal: #383D3B; --terra: #B75D45;
        --nude: #E6D3C5; --cream: #F5F0EA;
      }
      body { font-family: 'Red Hat Display', sans-serif; background: white; color: var(--charcoal); }

      /* COVER */
      .cover {
        height: 100vh; min-height: 700px;
        background: var(--charcoal);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        page-break-after: always;
        position: relative; overflow: hidden;
      }
      .cover::before {
        content: 'RM';
        font-family: 'Cormorant Garamond', serif;
        font-size: 400px; font-weight: 600;
        color: white; opacity: 0.04;
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        letter-spacing: -0.02em;
      }
      .cover-inner { text-align: center; position: relative; z-index: 2; }
      .cover-tagline { font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); margin-bottom: 24px; }
      .cover-brand { font-family: 'Cormorant Garamond', serif; font-size: 72px; font-weight: 500; letter-spacing: 0.1em; color: var(--nude); line-height: 1; }
      .cover-sub { font-family: Georgia, serif; font-style: italic; font-size: 22px; color: var(--terra); margin-top: 8px; }
      .cover-line { width: 80px; height: 0.5px; background: var(--gold); margin: 32px auto; }
      .cover-desc { font-size: 13px; color: rgba(230,211,197,0.5); letter-spacing: 0.08em; line-height: 1.8; max-width: 320px; font-weight: 300; }
      .cover-year { position: absolute; bottom: 40px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(230,211,197,0.3); }

      /* PRODUCTS GRID */
      .products-section { padding: 60px 48px; }
      .section-header { text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 0.5px solid var(--nude); }
      .section-header h2 { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; font-style: italic; color: var(--charcoal); }
      .section-header p { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-top: 8px; }

      .products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
      .product-card { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; border: 0.5px solid var(--nude); page-break-inside: avoid; }
      .product-image { aspect-ratio: 3/4; overflow: hidden; background: var(--cream); display: flex; align-items: center; justify-content: center; }
      .product-image img { width: 100%; height: 100%; object-fit: cover; }
      .no-image { font-size: 40px; opacity: 0.3; }
      .product-info { display: flex; flex-direction: column; justify-content: space-between; }
      .product-category { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; font-weight: 400; }
      .product-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; font-style: italic; color: var(--charcoal); line-height: 1.2; margin-bottom: 6px; }
      .product-sku { font-size: 10px; color: rgba(56,61,59,0.4); letter-spacing: 0.1em; margin-bottom: 12px; }
      .product-desc { font-size: 12px; color: rgba(56,61,59,0.65); line-height: 1.7; font-weight: 300; margin-bottom: 16px; flex: 1; }
      .product-pricing { margin-top: auto; }
      .price-wholesale, .price-retail { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 0.5px solid var(--nude); }
      .price-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(56,61,59,0.5); font-weight: 400; }
      .price-value { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 500; color: var(--charcoal); }
      .price-value.retail { color: var(--terra); }
      .product-material { font-size: 10px; color: rgba(56,61,59,0.45); margin-top: 10px; letter-spacing: 0.05em; }

      /* FOOTER */
      .catalog-footer { padding: 48px; text-align: center; border-top: 0.5px solid var(--nude); margin-top: 48px; }
      .catalog-footer .brand { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 500; letter-spacing: 0.1em; color: var(--charcoal); }
      .catalog-footer .contact { font-size: 12px; color: rgba(56,61,59,0.5); margin-top: 8px; line-height: 1.7; font-weight: 300; }

      @media print {
        .cover { page-break-after: always; }
        .product-card { page-break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <div class="cover">
      <div class="cover-inner">
        <div class="cover-tagline">Catálogo Atacado</div>
        <div class="cover-brand">ROSE MONTEIRO</div>
        <div class="cover-sub">Joias</div>
        <div class="cover-line"></div>
        <div class="cover-desc">Cerâmica artesanal com design autoral.<br>Peças únicas que carregam natureza, tempo, intenção e afeto.</div>
      </div>
      <div class="cover-year">${new Date().getFullYear()} · Ponta Grossa, PR</div>
    </div>

    <div class="products-section">
      <div class="section-header">
        <p>${products.length} produto${products.length > 1 ? 's' : ''} selecionado${products.length > 1 ? 's' : ''}</p>
        <h2>Coleção de Joias em Cerâmica</h2>
      </div>
      <div class="products-grid">${productCards}</div>
    </div>

    <div class="catalog-footer">
      <div class="brand">ROSE MONTEIRO JOIAS</div>
      <div class="contact">
        Ponta Grossa, PR · ceramicasrosemonteiro.com.br<br>
        WhatsApp: (42) 9921-0868 · foggiattorm@hotmail.com<br>
        Pedido mínimo e condições sob consulta.
      </div>
    </div>
  </body>
  </html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(html)
})

module.exports = router
