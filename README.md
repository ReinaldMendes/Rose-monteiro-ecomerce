# Rose Monteiro Joias — Projeto Completo

E-commerce premium para joias artesanais em cerâmica.

## Estrutura

```
rose-monteiro/
├── api/    → Backend Node.js + Express + Prisma (Railway)
└── web/    → Frontend Next.js 14 (Vercel)
```

---

## 🚀 Deploy Rápido

### 1. Backend — Railway

1. Crie uma conta em [railway.app](https://railway.app)
2. Crie um **novo projeto** → **Deploy from GitHub**
3. Selecione a pasta `api/` (ou faça push da pasta separada)
4. Adicione um banco **PostgreSQL** pelo Railway Dashboard
5. Configure as **variáveis de ambiente** (veja `api/.env.example`)
6. O Railway roda automaticamente: `npm run prisma:generate && npm run prisma:migrate && npm start`

Após o deploy, copie a URL pública do Railway (ex: `https://rose-monteiro-api.up.railway.app`)

### 2. Frontend — Vercel

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Importe o repositório → selecione a pasta `web/`
3. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://sua-api.up.railway.app
   NEXT_PUBLIC_WHATSAPP=5542999210868
   NEXT_PUBLIC_SITE_URL=https://www.ceramicasrosemonteiro.com.br
   ```
4. Deploy automático!

---

## 🔑 Login Admin

Após o seed do banco:

- **E-mail:** foggiattorm@hotmail.com  
- **Senha:** admin123  
- **URL:** `https://seu-site.com/admin`

⚠️ **Troque a senha no primeiro login!**

---

## ⚙️ Variáveis de Ambiente

### API (`api/.env`)

```env
DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DB?sslmode=require
JWT_SECRET=chave-muito-secreta-aqui
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua-senha-de-app
EMAIL_FROM=Rose Monteiro Joias <noreply@rosemonteiro.com.br>
EMAIL_ADMIN=contato@rosemonteiro.com.br

WHATSAPP_NUMBER=5542999210868
FRONTEND_URL=https://www.ceramicasrosemonteiro.com.br
PORT=3001
NODE_ENV=production
```

### Web (`web/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://sua-api.up.railway.app
NEXT_PUBLIC_WHATSAPP=5542999210868
NEXT_PUBLIC_SITE_URL=https://www.ceramicasrosemonteiro.com.br
```

---

## 💻 Desenvolvimento Local

### Backend
```bash
cd api
npm install
cp .env.example .env        # preencha as variáveis
npx prisma migrate dev
npm run db:seed
npm run dev                  # http://localhost:3001
```

### Frontend
```bash
cd web
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev                  # http://localhost:3000
```

---

## 📋 Funcionalidades

### Loja Pública
- ✅ Home premium com hero, categorias, destaques, depoimentos, FAQ
- ✅ Listagem de produtos com busca, filtros e paginação
- ✅ Página de produto com galeria, storytelling, specs, avaliações
- ✅ Carrinho lateral com persistência (Zustand)
- ✅ Checkout completo (nome, telefone, endereço, pagamento)
- ✅ Confirmação de pedido + redirecionamento WhatsApp
- ✅ Páginas: Sobre, Contato, Categorias, Coleções, Atacado
- ✅ Newsletter
- ✅ Botão WhatsApp flutuante
- ✅ Design 100% fiel à identidade visual (cores, fontes, paleta)

### Painel Admin (`/admin`)
- ✅ Login seguro com JWT
- ✅ Dashboard com métricas, gráfico de faturamento, top produtos
- ✅ Alerta de carrinhos abandonados
- ✅ Gestão completa de produtos (CRUD, duplicar, upload de imagens)
- ✅ Gestão de pedidos com timeline de status
- ✅ Detalhe do pedido com avanço de status visual
- ✅ Lista de clientes com contato WhatsApp
- ✅ Gestão de categorias
- ✅ Avaliações (aprovar/excluir)
- ✅ Gerador de catálogo atacado PDF premium

### Backend
- ✅ REST API Express + Prisma + PostgreSQL
- ✅ Autenticação JWT + RBAC
- ✅ Upload de imagens Cloudinary
- ✅ E-mail de confirmação de pedido (Nodemailer)
- ✅ Seed com dados iniciais
- ✅ Carrinho abandonado
- ✅ Analytics de faturamento

---

## 🎨 Design System

| Token | Valor | Uso |
|---|---|---|
| `gold` | `#9B8733` | Acentos, labels, destaques |
| `charcoal` | `#383D3B` | Texto principal, fundos escuros |
| `terra` | `#B75D45` | CTAs, tags, alertas |
| `sage` | `#ABBAB0` | Texto secundário sobre escuro |
| `nude` | `#E6D3C5` | Fundos, bordas, cards |
| `cream` | `#F5F0EA` | Seções alternadas |

**Fontes:** Cormorant Garamond (display) + Red Hat Display (body)

---

## 📞 Suporte

Qualquer dúvida, entre em contato pelo WhatsApp ou abra uma issue no repositório.
