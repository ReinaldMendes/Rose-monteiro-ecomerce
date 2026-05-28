const router = require('express').Router()
const prisma = require('../lib/prisma')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { sendOrderConfirmation, sendNewOrderNotification } = require('../lib/email')

const genOrderNumber = async () => {
  const year  = new Date().getFullYear()
  const count = await prisma.order.count()
  return `RM-${year}-${String(count + 1).padStart(4, '0')}`
}

const orderInclude = {
  customer: true,
  items: {
    include: { product: { include: { images: { orderBy: { order: 'asc' }, take: 1 } } } },
  },
  timeline: { orderBy: { createdAt: 'asc' } },
}

// GET /api/orders  [ADMIN]
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query
  const where = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customer:    { name:  { contains: search, mode: 'insensitive' } } },
      { customer:    { phone: { contains: search, mode: 'insensitive' } } },
    ]
  }
  const skip  = (Number(page) - 1) * Number(limit)
  const total = await prisma.order.count({ where })
  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: true,
      items:    { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: Number(limit),
  })
  res.json({ orders, pagination: { total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) } })
})

// GET /api/orders/abandoned  [ADMIN]
router.get('/abandoned', authenticate, requireAdmin, async (req, res) => {
  const carts = await prisma.abandonedCart.findMany({
    where:   { recovered: false },
    orderBy: { createdAt: 'desc' },
  })
  res.json(carts)
})

// GET /api/orders/:id  [ADMIN]
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: orderInclude,
  })
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' })
  res.json(order)
})

// POST /api/orders  (público — checkout)
router.post('/', async (req, res) => {
  const { customer: cData, items, paymentMethod, deliveryMethod, notes } = req.body

  if (!cData?.name || !cData?.phone || !items?.length) {
    return res.status(400).json({ error: 'Dados obrigatórios: cliente, telefone e itens' })
  }

  // Upsert customer by phone
  let customer = await prisma.customer.findFirst({ where: { phone: cData.phone } })
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name:    cData.name,
        phone:   cData.phone,
        email:   cData.email   || null,
        address: cData.address || null,
        city:    cData.city    || null,
        state:   cData.state   || null,
        zip:     cData.zip     || null,
      },
    })
  }

  // Validate products + stock
  const orderItems = []
  let subtotal = 0
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product) return res.status(404).json({ error: `Produto não encontrado: ${item.productId}` })
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Estoque insuficiente: ${product.name}` })
    }
    const total = product.price * item.quantity
    subtotal += total
    orderItems.push({ productId: product.id, quantity: item.quantity, unitPrice: product.price, total })
  }

  const orderNumber  = await genOrderNumber()
  const shippingCost = deliveryMethod === 'DELIVERY' ? 0 : 0 // Calculado via WhatsApp
  const totalAmount  = subtotal + shippingCost

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status:         'PENDING',
      paymentMethod:  paymentMethod  || null,
      deliveryMethod: deliveryMethod || 'PICKUP',
      notes:          notes          || null,
      subtotal,
      shippingCost,
      total: totalAmount,
      customerId: customer.id,
      items:    { create: orderItems },
      timeline: { create: [{ status: 'PENDING', note: 'Pedido recebido' }] },
    },
    include: orderInclude,
  })

  // Decrement stock
  for (const item of orderItems) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    const newStock = product.stock - item.quantity
    await prisma.product.update({
      where: { id: item.productId },
      data:  {
        stock:       newStock,
        stockStatus: newStock === 0 ? 'OUT_OF_STOCK' : newStock <= 3 ? 'LOW_STOCK' : 'AVAILABLE',
      },
    })
  }

  // Send emails (non-blocking)
  try {
    await sendOrderConfirmation(order, customer)
    await sendNewOrderNotification(order, customer)
  } catch (e) {
    console.error('Email error:', e.message)
  }

  res.status(201).json(order)
})

// PUT /api/orders/:id/status  [ADMIN]
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  const { status, note } = req.body
  const validStatuses = ['PENDING','CONFIRMED','IN_PRODUCTION','READY','SHIPPED','DELIVERED','CANCELLED']
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Status inválido' })

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data:  {
      status,
      completedAt: status === 'DELIVERED' ? new Date() : undefined,
      timeline:    { create: [{ status, note: note || null }] },
    },
    include: orderInclude,
  })
  res.json(order)
})

// POST /api/orders/cart/abandon  (público)
router.post('/cart/abandon', async (req, res) => {
  const { sessionId, customerName, customerPhone, items, total } = req.body
  if (!sessionId || !items?.length) return res.status(400).json({ error: 'Dados insuficientes' })

  await prisma.abandonedCart.upsert({
    where:  { sessionId },
    update: { items, total, customerName, customerPhone, updatedAt: new Date() },
    create: { sessionId, items, total, customerName: customerName || null, customerPhone: customerPhone || null },
  })
  res.json({ message: 'Registrado' })
})

module.exports = router
