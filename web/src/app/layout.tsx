import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Toaster } from 'sonner'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceramicasrosemonteiro.com.br'
const SITE_NAME = 'Rose Monteiro Joias'
const SITE_DESC = 'Joias artesanais em cerâmica com design autoral. Peças únicas feitas à mão, sem moldes, que carregam natureza, tempo, intenção e afeto. Curitiba, PR.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Joias Artesanais em Cerâmica`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    'joias cerâmica', 'joias artesanais', 'cerâmica artesanal',
    'Rose Monteiro', 'joias feitas à mão', 'brincos cerâmica',
    'colares cerâmica', 'anéis cerâmica', 'joias exclusivas',
    'joias autorais', 'joias sustentáveis', 'Curitiba', 'Paraná',
    'joias de cerâmica Curitiba', 'presente exclusivo feminino',
    'brinco artesanal', 'colar artesanal', 'joia única',
  ],
  authors: [{ name: 'Rose Monteiro', url: SITE_URL }],
  creator: 'Rose Monteiro',
  publisher: 'Rose Monteiro Joias',
  category: 'Joias e Acessórios',
  classification: 'E-commerce / Joias Artesanais',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Joias Artesanais em Cerâmica`,
    description: SITE_DESC,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Rose Monteiro Joias — Cerâmica Artesanal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Joias Artesanais em Cerâmica`,
    description: SITE_DESC,
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: SITE_URL },
  verification: {
    google: 'COLE_SEU_GOOGLE_VERIFICATION_CODE_AQUI',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

// Schema.org — Organization + WebSite
const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
      description: SITE_DESC,
      address: { '@type': 'PostalAddress', addressLocality: 'Curitiba', addressRegion: 'PR', addressCountry: 'BR' },
      contactPoint: { '@type': 'ContactPoint', telephone: '+55-42-99156-2593', contactType: 'customer service', availableLanguage: 'Portuguese' },
      sameAs: [
        'https://www.instagram.com/rosemonteiro.joias',
        `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5542999999999'}`,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESC,
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/produtos?search={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'pt-BR',
    },
    {
      '@type': 'OnlineStore',
      '@id': `${SITE_URL}/#store`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      currenciesAccepted: 'BRL',
      paymentAccepted: 'Pix, Cartão de crédito, Cartão de débito',
      priceRange: 'R$150 - R$800',
      address: { '@type': 'PostalAddress', addressLocality: 'Curitiba', addressRegion: 'PR', addressCountry: 'BR' },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '10:00', closes: '14:00' },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#383D3B" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="geo.region" content="BR-PR" />
        <meta name="geo.placename" content="Curitiba" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        {children}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  )
}
