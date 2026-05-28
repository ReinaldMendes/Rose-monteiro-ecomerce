const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const hash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rosemonteiro.com.br' },
    update: {},
    create: {
      name: 'Rose Monteiro',
      email: 'admin@rosemonteiro.com.br',
      password: hash,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Admin criado:', admin.email)

  // Categories
  const cats = [
    { name: 'Brincos', slug: 'brincos', order: 1 },
    { name: 'Colares', slug: 'colares', order: 2 },
    { name: 'Chokers', slug: 'chokers', order: 3 },
    { name: 'Braceletes', slug: 'braceletes', order: 4 },
    { name: 'Pulseiras', slug: 'pulseiras', order: 5 },
    { name: 'Anéis', slug: 'aneis', order: 6 },
    { name: 'Ouro', slug: 'ouro', order: 7 },
    { name: 'Prata e Ródio', slug: 'prata-e-rodio', order: 8 },
  ]

  for (const cat of cats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categorias criadas')

  // Collection
  await prisma.collection.upsert({
    where: { slug: 'colecao-folhas' },
    update: {},
    create: {
      name: 'Coleção Folhas',
      slug: 'colecao-folhas',
      description: 'Inspirada na natureza, peças que carregam leveza e elegância.',
      featured: true,
    },
  })
  console.log('✅ Coleção criada')

  // Sample products
  const brincos = await prisma.category.findUnique({ where: { slug: 'brincos' } })
  const colares = await prisma.category.findUnique({ where: { slug: 'colares' } })
  const aneis   = await prisma.category.findUnique({ where: { slug: 'aneis' } })
  const colecao = await prisma.collection.findUnique({ where: { slug: 'colecao-folhas' } })

  const products = [
    {
      name: 'Brinco Folha Dupla em Cerâmica',
      slug: 'brinco-folha-dupla-ceramica',
      sku: 'RM-BR-0042',
      description: 'Brinco artesanal em cerâmica branca com acabamento em ouro 18k.',
      story: 'Inspirado nas folhas que a Rose coleta durante suas caminhadas pelo campo.',
      price: 257.00,
      priceWholesale: 180.00,
      comparePrice: 310.00,
      stock: 3,
      stockStatus: 'LOW_STOCK',
      material: 'Cerâmica artesanal',
      finish: 'Ouro 18k',
      dimensions: '4,5 × 2,8 cm',
      weight: 4,
      featured: true,
      categoryId: brincos?.id,
      collectionId: colecao?.id,
    },
    {
      name: 'Colar Ellos Branco Caramelo',
      slug: 'colar-ellos-branco-caramelo',
      sku: 'RM-CO-0018',
      description: 'Colar em cerâmica bicolor branca e caramelo, peça única.',
      story: 'Cada peça é moldada à mão e pintada com engobes naturais.',
      price: 447.00,
      priceWholesale: 310.00,
      comparePrice: 520.00,
      stock: 12,
      stockStatus: 'AVAILABLE',
      material: 'Cerâmica artesanal',
      finish: 'Engobe natural',
      dimensions: '45 cm',
      weight: 18,
      featured: true,
      categoryId: colares?.id,
    },
    {
      name: 'Anel Grenat Terracota',
      slug: 'anel-grenat-terracota',
      sku: 'RM-AN-0007',
      description: 'Anel em cerâmica terracota com textura granulada única.',
      price: 187.00,
      priceWholesale: 130.00,
      stock: 0,
      stockStatus: 'OUT_OF_STOCK',
      material: 'Cerâmica artesanal',
      finish: 'Terracota natural',
      featured: false,
      categoryId: aneis?.id,
    },
    {
      name: 'Brinco Grenat Metal Retângulo',
      slug: 'brinco-grenat-metal-retangulo',
      sku: 'RM-BR-0031',
      description: 'Brinco em cerâmica grenat com argola retangular em metal dourado.',
      price: 187.00,
      priceWholesale: 130.00,
      stock: 8,
      stockStatus: 'AVAILABLE',
      material: 'Cerâmica + Metal dourado',
      featured: true,
      categoryId: brincos?.id,
    },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }
  console.log('✅ Produtos criados')

  console.log('\n🎉 Seed concluído!')
  console.log('📧 Login: admin@rosemonteiro.com.br')
  console.log('🔑 Senha: admin123')
  console.log('⚠️  Troque a senha após o primeiro login!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
