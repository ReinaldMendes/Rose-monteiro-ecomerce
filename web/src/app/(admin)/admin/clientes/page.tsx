'use client'
import { useEffect, useState } from 'react'
import { adminCustomersApi } from '@/lib/api'
import { fmt } from '@/lib/utils'
import { Search, MessageCircle } from 'lucide-react'

export default function ClientesPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await adminCustomersApi.list({ search: search || undefined })
      setCustomers(res.data.customers); setTotal(res.data.pagination.total)
    } finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  return (
    <div className="p-8">
      <div className="mb-8"><h1 className="font-display text-3xl italic font-normal text-charcoal">Clientes</h1><p className="text-sm text-charcoal/45 mt-1">{total} clientes</p></div>
      <form onSubmit={e => { e.preventDefault(); fetch() }} className="flex gap-3 mb-6 max-w-sm">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome, telefone ou e-mail..."
          className="flex-1 px-4 py-2.5 border border-nude bg-white text-sm font-body focus:outline-none focus:border-charcoal" />
        <button type="submit" className="px-4 bg-charcoal text-white hover:bg-terra transition-colors"><Search size={15}/></button>
      </form>
      <div className="bg-white border border-black/8 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-black/6 bg-nude/20">
            {['Cliente','Telefone','E-mail','Pedidos','WhatsApp'].map(h => (
              <th key={h} className="text-left px-6 py-3 text-[9px] tracking-[0.2em] uppercase text-charcoal/45 font-body font-normal">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? [...Array(5)].map((_,i) => <tr key={i} className="border-b border-black/4">{[...Array(5)].map((_,j) => <td key={j} className="px-6 py-3"><div className="h-3 bg-nude/50 animate-pulse rounded" /></td>)}</tr>)
            : customers.map(c => (
              <tr key={c.id} className="border-b border-black/4 hover:bg-nude/10 transition-colors">
                <td className="px-6 py-3 font-medium text-sm text-charcoal">{c.name}</td>
                <td className="px-6 py-3 text-sm text-charcoal/60">{c.phone}</td>
                <td className="px-6 py-3 text-sm text-charcoal/60">{c.email || '—'}</td>
                <td className="px-6 py-3 text-sm text-charcoal">{c._count?.orders || 0}</td>
                <td className="px-6 py-3">
                  <a href={`https://wa.me/${c.phone?.replace(/\D/g,'')}`} target="_blank"
                    className="flex items-center gap-1 text-[11px] text-[#25D366] hover:opacity-70 transition-opacity font-body">
                    <MessageCircle size={13}/> Contato
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
