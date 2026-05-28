require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors    = require('cors')

const authRoutes       = require('./routes/auth')
const productRoutes    = require('./routes/products')
const categoryRoutes   = require('./routes/categories')
const collectionRoutes = require('./routes/collections')
const orderRoutes      = require('./routes/orders')
const customerRoutes   = require('./routes/customers')
const uploadRoutes     = require('./routes/uploads')
const reviewRoutes     = require('./routes/reviews')
const newsletterRoutes = require('./routes/newsletter')
const analyticsRoutes  = require('./routes/analytics')
const catalogRoutes    = require('./routes/catalog')
const { errorHandler } = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 3001

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// ── MIDDLEWARES ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── HEALTH CHECK ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date().toISOString() })
})

// ── ROUTES ────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes)
app.use('/api/products',    productRoutes)
app.use('/api/categories',  categoryRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/orders',      orderRoutes)
app.use('/api/customers',   customerRoutes)
app.use('/api/uploads',     uploadRoutes)
app.use('/api/reviews',     reviewRoutes)
app.use('/api/newsletter',  newsletterRoutes)
app.use('/api/analytics',   analyticsRoutes)
app.use('/api/catalog',     catalogRoutes)

// ── ERROR HANDLER ─────────────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Rose Monteiro API rodando na porta ${PORT}`)
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`)
})

module.exports = app
