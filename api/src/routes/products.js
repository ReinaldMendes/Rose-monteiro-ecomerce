const router  = require('express').Router()
const prisma  = require('../lib/prisma')
const slugify = require('slugify')
const { authenticate, requireAdmin } = require('../middleware/auth')

const include = {
  images:     { orderBy: { order: 'asc' } },
  category:   { select: { id: true, name: true, slug: true } },
  collection: { select: { id: true, name: true, slug: true } },
}

// GET /api/products
router.get('/', async (req, res) => {
  const {
    page = 1, limit = 12, category, collection,
    featured, search, sort = 'createdAt', order = 'desc',
    active = 'true',
  } = req.query

  const where = {}
  if (active !== 'all') where.active = active === 'true'
  if (category)   where.category   = { slug: category }
  if (collection) where.collection = { slug: collection }
  if (featured === 'true') where.featured = true
  if (search) {
    where.OR = [
      { name:        { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku:         { contains: search, mode: 'insensitive' } },
    ]
  }

  const validSorts = ['createdAt', 'price', 'name', 'stock']
  const orderBy = validSorts.includes(sort)
    ? { [sort]: order === 'asc' ? 'asc' : 'desc' }
    : { createdAt: 'desc' }

  const skip  = (Number(page) - 1) * Number(limit)
  const total = await prisma.product.count({ where })
  const products = await prisma.product.findMany({
    where, include, orderBy,
    skip, take: Number(limit),
  })

  res.json({
    products,
    pagination: {
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
})

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where:   { slug: req.params.slug },
    include: {
      ...include,
      reviews: {
        where:   { approved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
  res.json(product)
})

// POST /api/products  [ADMIN]
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const {
    name, description, story, price, priceWholesale, comparePrice,
    stock, material, finish, dimensions, weight,
    featured, active, seoTitle, seoDesc,
    categoryId, collectionId, sku,
  } = req.body

  if (!name || !price) return res.status(400).json({ error: 'Nome e preço são obrigatórios' })

  const slug = slugify(name, { lower: true, strict: true })
  const finalSku = sku || `RM-${Date.now()}`

  const product = await prisma.product.create({
    data: {
      name, slug, sku: finalSku, description, story,
      price:          Number(price),
      priceWholesale: priceWholesale ? Number(priceWholesale) : null,
      comparePrice:   comparePrice   ? Number(comparePrice)   : null,
      stock:          Number(stock || 0),
      stockStatus:    Number(stock || 0) === 0 ? 'OUT_OF_STOCK'
                    : Number(stock || 0) <= 3  ? 'LOW_STOCK' : 'AVAILABLE',
      material, finish, dimensions,
      weight:   weight ? Number(weight) : null,
      featured: featured === true || featured === 'true',
      active:   active  !== false && active  !== 'false',
      seoTitle, seoDesc,
      categoryId:   categoryId   || null,
      collectionId: collectionId || null,
    },
    include,
  })
  res.status(201).json(product)
})

// PUT /api/products/:id  [ADMIN]
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const {
    name, description, story, price, priceWholesale, comparePrice,
    stock, material, finish, dimensions, weight,
    featured, active, seoTitle, seoDesc,
    categoryId, collectionId, sku,
  } = req.body

  const data = {}
  if (name !== undefined) {
    data.name = name
    data.slug = slugify(name, { lower: true, strict: true })
  }
  if (sku              !== undefined) data.sku            = sku
  if (description      !== undefined) data.description    = description
  if (story            !== undefined) data.story          = story
  if (price            !== undefined) data.price          = Number(price)
  if (priceWholesale   !== undefined) data.priceWholesale = priceWholesale ? Number(priceWholesale) : null
  if (comparePrice     !== undefined) data.comparePrice   = comparePrice   ? Number(comparePrice)   : null
  if (stock            !== undefined) {
    data.stock       = Number(stock)
    data.stockStatus = Number(stock) === 0 ? 'OUT_OF_STOCK'
                     : Number(stock) <= 3  ? 'LOW_STOCK' : 'AVAILABLE'
  }
  if (material         !== undefined) data.material    = material
  if (finish           !== undefined) data.finish      = finish
  if (dimensions       !== undefined) data.dimensions  = dimensions
  if (weight           !== undefined) data.weight      = weight ? Number(weight) : null
  if (featured         !== undefined) data.featured    = featured === true || featured === 'true'
  if (active           !== undefined) data.active      = active  !== false && active  !== 'false'
  if (seoTitle         !== undefined) data.seoTitle    = seoTitle
  if (seoDesc          !== undefined) data.seoDesc     = seoDesc
  if (categoryId       !== undefined) data.categoryId  = categoryId   || null
  if (collectionId     !== undefined) data.collectionId= collectionId || null

  const product = await prisma.product.update({ where: { id: req.params.id }, data, include })
  res.json(product)
})

// DELETE /api/products/:id  [ADMIN]
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } })
  res.json({ message: 'Produto excluído' })
})

// POST /api/products/:id/duplicate  [ADMIN]
router.post('/:id/duplicate', authenticate, requireAdmin, async (req, res) => {
  const original = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { images: true },
  })
  if (!original) return res.status(404).json({ error: 'Produto não encontrado' })

  const { id, createdAt, updatedAt, slug, sku, ...data } = original
  const newSlug = `${slug}-copia-${Date.now()}`
  const newSku  = `${sku}-COPY`

  const product = await prisma.product.create({
    data: {
      ...data,
      slug: newSlug,
      sku:  newSku,
      name: `${data.name} (Cópia)`,
      active: false,
      images: {
        create: original.images.map(({ id, productId, ...img }) => img),
      },
    },
    include,
  })
  res.status(201).json(product)
})

// PUT /api/products/:id/images/reorder  [ADMIN]
router.put('/:id/images/reorder', authenticate, requireAdmin, async (req, res) => {
  const { images } = req.body // [{ id, order }]
  await Promise.all(
    images.map(({ id, order }) =>
      prisma.productImage.update({ where: { id }, data: { order } })
    )
  )
  res.json({ message: 'Ordem atualizada' })
})

// DELETE /api/products/:id/images/:imgId  [ADMIN]
router.delete('/:id/images/:imgId', authenticate, requireAdmin, async (req, res) => {
  const img = await prisma.productImage.findUnique({ where: { id: req.params.imgId } })
  if (img?.publicId) {
    const { deleteImage } = require('../lib/cloudinary')
    await deleteImage(img.publicId)
  }
  await prisma.productImage.delete({ where: { id: req.params.imgId } })
  res.json({ message: 'Imagem removida' })
})

module.exports = router
