'use client'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5542999999999'
  const url   = `https://wa.me/${phone}?text=${encodeURIComponent('Olá! Vim pelo site da Rose Monteiro Joias.')}`
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
      aria-label="Falar pelo WhatsApp">
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  )
}
