import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmt = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const whatsappLink = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

export const orderWhatsapp = (orderNumber: string) => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '5542999999999'
  const msg   = `Olá! Acabei de fazer o pedido ${orderNumber} no site da Rose Monteiro Joias. Gostaria de confirmar os detalhes.`
  return whatsappLink(phone, msg)
}

export const statusLabels: Record<string, string> = {
  PENDING:       'Pendente',
  CONFIRMED:     'Confirmado',
  IN_PRODUCTION: 'Em produção',
  READY:         'Pronto',
  SHIPPED:       'Enviado',
  DELIVERED:     'Entregue',
  CANCELLED:     'Cancelado',
  ABANDONED:     'Abandonado',
}

export const statusColors: Record<string, string> = {
  PENDING:       'bg-yellow-50 text-yellow-700',
  CONFIRMED:     'bg-green-50 text-green-700',
  IN_PRODUCTION: 'bg-blue-50 text-blue-700',
  READY:         'bg-purple-50 text-purple-700',
  SHIPPED:       'bg-indigo-50 text-indigo-700',
  DELIVERED:     'bg-green-100 text-green-800',
  CANCELLED:     'bg-red-50 text-red-700',
  ABANDONED:     'bg-red-50 text-red-600',
}
