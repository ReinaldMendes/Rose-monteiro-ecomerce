'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminProductsApi, adminCategoriesApi, collectionsApi } from '@/lib/api'
import { toast } from 'sonner'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [loading,     setLoading]     = useState(false)
  const [categories,  setCategories]  = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [images,      setImages]      = useState<File[]>([])
  const [previews,    setPreviews]    = useState<string[]>([])
  const [form, setForm] = useState({
    name:'', sku:'', description:'', story:'',
    price:'', priceWholesale:'', comparePrice:'',
    stock:'0', material:'', finish:'', dimensions:'', weight:'',
    categoryId:'', collectionId:'', featured: false, active: true,
    seoTitle:'', seoDesc:'',
  })

  useEffect(() => {
    adminCategoriesApi.list().then(r => setCategories(r.data)).catch(()=>{})
    collectionsApi.list().then(r => setCollections(r.data)).catch(()=>{})
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<any>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
    files.forEach(f => {
      const reader = new FileReader()
      reader.onload = ev => setPreviews(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) return toast.error('Nome e preço são obrigatórios')
    setLoading(true)
    try {
      const res = await adminProductsApi.create({
        ...form, price: Number(form.price),
        priceWholesale: form.priceWholesale ? Number(form.priceWholesale) : null,
        comparePrice:   form.comparePrice   ? Number(form.comparePrice)   : null,
        stock:          Number(form.stock),
        categoryId:     form.categoryId     || null,
        collectionId:   form.collectionId   || null,
      })
      if (images.length > 0) {
        const fd = new FormData()
        images.forEach(f => fd.append('images', f))
        await adminProductsApi.uploadImages(res.data.id, fd)
      }
      toast.success('Produto criado!')
      router.push('/admin/produtos')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao criar produto')
    } finally { setLoading(false) }
  }

  const cls = "w-full px-4 py-2.5 border border-nude bg-white text-sm font-body focus:outline-none focus:border-charcoal"
  const lbl = "block text-[10px] tracking-[0.2em] uppercase text-charcoal/55 mb-1.5 font-body"

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produtos" className="text-charcoal/40 hover:text-charcoal"><ArrowLeft size={20} /></Link>
        <h1 className="font-display text-3xl italic font-normal text-charcoal">Novo produto</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Informações básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className={lbl}>Nome *</label><input value={form.name} onChange={set('name')} required className={cls} /></div>
            <div><label className={lbl}>SKU</label><input value={form.sku} onChange={set('sku')} className={cls} placeholder="RM-BR-0001" /></div>
            <div><label className={lbl}>Categoria</label>
              <select value={form.categoryId} onChange={set('categoryId')} className={cls + ' cursor-pointer'}>
                <option value="">Sem categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className={lbl}>Coleção</label>
              <select value={form.collectionId} onChange={set('collectionId')} className={cls + ' cursor-pointer'}>
                <option value="">Sem coleção</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2"><label className={lbl}>Descrição</label><textarea value={form.description} onChange={set('description')} rows={3} className={cls + ' resize-none'} /></div>
            <div className="md:col-span-2"><label className={lbl}>História da peça</label><textarea value={form.story} onChange={set('story')} rows={3} className={cls + ' resize-none'} /></div>
          </div>
        </div>
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Preços e estoque</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className={lbl}>Preço *</label><input type="number" step="0.01" value={form.price} onChange={set('price')} required className={cls} /></div>
            <div><label className={lbl}>Atacado</label><input type="number" step="0.01" value={form.priceWholesale} onChange={set('priceWholesale')} className={cls} /></div>
            <div><label className={lbl}>Preço original</label><input type="number" step="0.01" value={form.comparePrice} onChange={set('comparePrice')} className={cls} /></div>
            <div><label className={lbl}>Estoque</label><input type="number" value={form.stock} onChange={set('stock')} className={cls} min="0" /></div>
          </div>
        </div>
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Especificações</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['material','Material'],['finish','Acabamento'],['dimensions','Dimensões'],['weight','Peso (g)']].map(([k,l]) => (
              <div key={k}><label className={lbl}>{l}</label><input value={(form as any)[k]} onChange={set(k)} className={cls} /></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Imagens</h2>
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-nude hover:border-charcoal transition-colors cursor-pointer bg-nude/10">
            <Upload size={20} className="text-charcoal/40 mb-2" />
            <span className="text-sm text-charcoal/55">Clique para adicionar imagens</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </label>
          {previews.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <Image src={src} alt="" width={80} height={80} className="w-full h-full object-cover border border-nude" />
                  <button type="button" onClick={() => { setImages(p => p.filter((_,j)=>j!==i)); setPreviews(p => p.filter((_,j)=>j!==i)) }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-terra rounded-full flex items-center justify-center">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white border border-black/8 p-6">
          <div className="flex gap-6">
            {[['featured','Destaque'],['active','Ativo']].map(([k,l]) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.checked }))} className="accent-charcoal w-4 h-4" />
                <span className="text-sm font-body text-charcoal">{l}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="px-8 py-3.5 bg-charcoal text-white text-[11px] tracking-widest uppercase font-body font-medium hover:bg-terra transition-colors disabled:opacity-50">
            {loading ? 'Salvando...' : 'Criar produto'}
          </button>
          <Link href="/admin/produtos" className="px-8 py-3.5 border border-nude text-charcoal text-[11px] tracking-widest uppercase font-body hover:border-charcoal transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
