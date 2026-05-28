const router = require('express').Router()
const prisma = require('../lib/prisma')
const { authenticate, requireAdmin } = require('../middleware/auth')

// POST /api/reviews  (público)
router.post('/', async (req, res) => {
  const { productId, rating, comment, authorName } = req.body
  if (!productId || !rating || !authorName) return res.status(400).json({ error: 'Campos obrigatórios' })
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating deve ser entre 1 e 5' })
  const review = await prisma.review.create({ data: { productId, rating: Number(rating), comment, authorName } })
  res.status(201).json({ ...review, message: 'Avaliação enviada! Será publicada após aprovação.' })
})

// GET /api/reviews  [ADMIN]
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { approved } = req.query
  const where = {}
  if (approved !== undefined) where.approved = approved === 'true'
  const reviews = await prisma.review.findMany({
    where,
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(reviews)
})

// PUT /api/reviews/:id/approve  [ADMIN]
router.put('/:id/approve', authenticate, requireAdmin, async (req, res) => {
  const review = await prisma.review.update({ where: { id: req.params.id }, data: { approved: true } })
  res.json(review)
})

// DELETE /api/reviews/:id  [ADMIN]
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.review.delete({ where: { id: req.params.id } })
  res.json({ message: 'Avaliação excluída' })
})

module.exports = router
