const router = require('express').Router()
const prisma = require('../lib/prisma')
const { authenticate, requireAdmin } = require('../middleware/auth')

router.post('/', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email obrigatório' })
  try {
    await prisma.newsletter.create({ data: { email } })
    res.status(201).json({ message: 'Inscrito com sucesso!' })
  } catch (e) {
    if (e.code === 'P2002') return res.json({ message: 'Email já cadastrado' })
    throw e
  }
})

router.get('/', authenticate, requireAdmin, async (req, res) => {
  const list = await prisma.newsletter.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } })
  res.json(list)
})

module.exports = router
