const router  = require('express').Router()
const prisma  = require('../lib/prisma')
const slugify = require('slugify')
const { authenticate, requireAdmin } = require('../middleware/auth')

router.get('/', async (req, res) => {
  const { active } = req.query
  const where = {}
  if (active !== 'all') where.active = true
  const cats = await prisma.category.findMany({
    where,
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: { where: { active: true } } } } },
  })
  res.json(cats)
})

router.get('/:slug', async (req, res) => {
  const cat = await prisma.category.findUnique({
    where: { slug: req.params.slug },
    include: {
      products: {
        where:   { active: true },
        include: { images: { orderBy: { order: 'asc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!cat) return res.status(404).json({ error: 'Categoria não encontrada' })
  res.json(cat)
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { name, description, bannerUrl, order } = req.body
  if (!name) return res.status(400).json({ error: 'Nome obrigatório' })
  const slug = slugify(name, { lower: true, strict: true })
  const cat  = await prisma.category.create({
    data: { name, slug, description, bannerUrl, order: Number(order || 0) },
  })
  res.status(201).json(cat)
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, description, bannerUrl, order, active } = req.body
  const data = {}
  if (name        !== undefined) { data.name = name; data.slug = slugify(name, { lower: true, strict: true }) }
  if (description !== undefined) data.description = description
  if (bannerUrl   !== undefined) data.bannerUrl   = bannerUrl
  if (order       !== undefined) data.order       = Number(order)
  if (active      !== undefined) data.active      = active === true || active === 'true'
  const cat = await prisma.category.update({ where: { id: req.params.id }, data })
  res.json(cat)
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } })
  res.json({ message: 'Categoria excluída' })
})

module.exports = router
