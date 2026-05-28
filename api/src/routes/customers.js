const router = require('express').Router()
const prisma = require('../lib/prisma')
const { authenticate, requireAdmin } = require('../middleware/auth')

router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { page = 1, limit = 20, search } = req.query
  const where = search ? {
    OR: [
      { name:  { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  } : {}
  const skip  = (Number(page) - 1) * Number(limit)
  const total = await prisma.customer.count({ where })
  const customers = await prisma.customer.findMany({
    where,
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
    skip,
    take: Number(limit),
  })
  res.json({ customers, pagination: { total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) } })
})

router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where:   { id: req.params.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: { select: { name: true } } } } },
      },
    },
  })
  if (!customer) return res.status(404).json({ error: 'Cliente não encontrado' })
  res.json(customer)
})

module.exports = router
