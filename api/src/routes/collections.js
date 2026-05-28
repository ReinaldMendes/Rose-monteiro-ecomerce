const router  = require('express').Router()
const prisma  = require('../lib/prisma')
const slugify = require('slugify')
const { authenticate, requireAdmin } = require('../middleware/auth')

router.get('/', async (req, res) => {
  const cols = await prisma.collection.findMany({
    where:   { active: true },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } },
  })
  res.json(cols)
})

router.get('/:slug', async (req, res) => {
  const col = await prisma.collection.findUnique({
    where:   { slug: req.params.slug },
    include: {
      products: {
        where:   { active: true },
        include: { images: { orderBy: { order: 'asc' }, take: 1 } },
      },
    },
  })
  if (!col) return res.status(404).json({ error: 'Coleção não encontrada' })
  res.json(col)
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { name, description, bannerUrl, featured } = req.body
  if (!name) return res.status(400).json({ error: 'Nome obrigatório' })
  const slug = slugify(name, { lower: true, strict: true })
  const col  = await prisma.collection.create({
    data: { name, slug, description, bannerUrl, featured: !!featured },
  })
  res.status(201).json(col)
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, description, bannerUrl, featured, active } = req.body
  const data = {}
  if (name        !== undefined) { data.name = name; data.slug = slugify(name, { lower: true, strict: true }) }
  if (description !== undefined) data.description = description
  if (bannerUrl   !== undefined) data.bannerUrl   = bannerUrl
  if (featured    !== undefined) data.featured    = !!featured
  if (active      !== undefined) data.active      = !!active
  const col = await prisma.collection.update({ where: { id: req.params.id }, data })
  res.json(col)
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.collection.delete({ where: { id: req.params.id } })
  res.json({ message: 'Coleção excluída' })
})

module.exports = router
