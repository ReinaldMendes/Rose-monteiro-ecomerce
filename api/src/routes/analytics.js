const router = require('express').Router()
const prisma = require('../lib/prisma')
const { authenticate, requireAdmin } = require('../middleware/auth')

router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const prev  = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevE = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    ordersMonth, ordersPrev,
    totalOrders, totalCustomers, totalProducts,
    pendingOrders, abandonedCount,
    recentOrders, topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where:  { createdAt: { gte: start }, status: { notIn: ['CANCELLED','ABANDONED'] } },
      _sum:   { total: true },
      _count: { id: true },
    }),
    prisma.order.aggregate({
      where:  { createdAt: { gte: prev, lte: prevE }, status: { notIn: ['CANCELLED','ABANDONED'] } },
      _sum:   { total: true },
      _count: { id: true },
    }),
    prisma.order.count({ where: { status: { notIn: ['CANCELLED','ABANDONED'] } } }),
    prisma.customer.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.abandonedCart.count({ where: { recovered: false } }),
    prisma.order.findMany({
      where:   { status: { notIn: ['CANCELLED','ABANDONED'] } },
      orderBy: { createdAt: 'desc' },
      take:    5,
      include: { customer: { select: { name: true, phone: true } } },
    }),
    prisma.orderItem.groupBy({
      by:      ['productId'],
      _sum:    { quantity: true },
      _count:  { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take:    5,
    }),
  ])

  const topProductIds = topProducts.map(t => t.productId)
  const topProductDetails = await prisma.product.findMany({
    where:   { id: { in: topProductIds } },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  })

  const topWithDetails = topProducts.map(t => ({
    ...t,
    product: topProductDetails.find(p => p.id === t.productId),
  }))

  const revenueMonth = ordersMonth._sum.total || 0
  const revenuePrev  = ordersPrev._sum.total  || 0
  const revenueGrowth = revenuePrev > 0
    ? (((revenueMonth - revenuePrev) / revenuePrev) * 100).toFixed(1)
    : null

  const avgTicket = ordersMonth._count.id > 0
    ? (revenueMonth / ordersMonth._count.id).toFixed(2)
    : 0

  res.json({
    revenueMonth,
    revenueGrowth,
    ordersMonth:    ordersMonth._count.id,
    avgTicket:      Number(avgTicket),
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    abandonedCount,
    recentOrders,
    topProducts: topWithDetails,
  })
})

// Revenue by month (last 6)
router.get('/revenue', authenticate, requireAdmin, async (req, res) => {
  const months = []
  const now    = new Date()
  for (let i = 5; i >= 0; i--) {
    const d     = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const agg   = await prisma.order.aggregate({
      where:  { createdAt: { gte: d, lte: end }, status: { notIn: ['CANCELLED','ABANDONED'] } },
      _sum:   { total: true },
      _count: { id: true },
    })
    months.push({
      month:   d.toLocaleDateString('pt-BR', { month: 'short' }),
      revenue: agg._sum.total || 0,
      orders:  agg._count.id  || 0,
    })
  }
  res.json(months)
})

module.exports = router
