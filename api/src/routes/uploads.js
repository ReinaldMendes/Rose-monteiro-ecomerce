const router = require('express').Router()
const { authenticate, requireAdmin } = require('../middleware/auth')
const upload = require('../middleware/upload')
const { uploadStream, deleteImage } = require('../lib/cloudinary')
const prisma = require('../lib/prisma')

// POST /api/uploads/product/:productId
router.post('/product/:productId', authenticate, requireAdmin, upload.array('images', 10), async (req, res) => {
  const { productId } = req.params
  if (!req.files?.length) return res.status(400).json({ error: 'Nenhuma imagem enviada' })

  const results = []
  const existingCount = await prisma.productImage.count({ where: { productId } })

  for (let i = 0; i < req.files.length; i++) {
    const file   = req.files[i]
    const result = await uploadStream(file.buffer, {
      folder:         'rose-monteiro/products',
      transformation: [{ width: 1200, height: 1500, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    })
    const img = await prisma.productImage.create({
      data: {
        productId,
        url:      result.secure_url,
        publicId: result.public_id,
        order:    existingCount + i,
      },
    })
    results.push(img)
  }
  res.status(201).json(results)
})

// DELETE /api/uploads/:publicId
router.delete('/:publicId', authenticate, requireAdmin, async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId)
  await deleteImage(publicId)
  res.json({ message: 'Imagem removida do Cloudinary' })
})

module.exports = router
