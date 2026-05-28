import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSection       from '@/components/home/HeroSection'
import TickerBanner      from '@/components/home/TickerBanner'
import CategoriesGrid    from '@/components/home/CategoriesGrid'
import FeaturedProducts  from '@/components/home/FeaturedProducts'
import AboutRose         from '@/components/home/AboutRose'
import BrandStory        from '@/components/home/BrandStory'
import Testimonials      from '@/components/home/Testimonials'
import FAQ               from '@/components/home/FAQ'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ceramicasrosemonteiro.com.br'

export const metadata: Metadata = {
  title: 'Rose Monteiro Joias — Joias Artesanais em Cerâmica | Curitiba',
  description: 'Descubra joias únicas em cerâmica artesanal. Brincos, colares, anéis e pulseiras feitos à mão, sem moldes, com acabamento em ouro e ródio. Envio para todo o Brasil.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Rose Monteiro Joias — Cerâmica Artesanal',
    description: 'Peças únicas feitas à mão que carregam natureza, tempo, intenção e afeto.',
    url: SITE_URL,
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TickerBanner />
      <CategoriesGrid />
      <Suspense fallback={<div className="h-96 bg-cream animate-pulse" />}>
        <FeaturedProducts />
      </Suspense>
      <AboutRose />
      <BrandStory />
      <Testimonials />
      <FAQ />
    </>
  )
}
