'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminProductsApi, adminCategoriesApi, collectionsApi } from '@/lib/api'
import { toast } from 'sonner'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [categories,  setCategories]  = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [existingImgs,setExistingImgs]= useState<any[]>([])
  const [newImages,   setNewImages]   = useState<File[]>([])
  const [previews,    setPreviews]    = useState<string[]>([])
  const [form, setForm] = useState<any>({
    name:'', sku:'', description:'', story:'',
    price:'', priceWholesale:'', comparePrice:'',
    stock:'0', material:'', finish:'', dimensions:'', weight:'',
    categoryId:'', collectionId:'', featured: false, active: true,
  })

  useEffect(() => {
    Promise.all([
      adminProductsApi.list().then(r => r.data.products.find((p:any) => p.id === id)),
      adminCategoriesApi.list(),
      collectionsApi.list(),
    ]).then(([p, cats, cols]) => {
      setCategories(cats.data)
      setCollections(cols.data)
      if (p) {
        setForm({
          name: p.name, sku: p.sku, description: p.description||'', story: p.story||'',
          price: p.price, priceWholesale: p.priceWholesale||'', comparePrice: p.comparePrice||'',
          stock: p.stock, material: p.material||'', finish: p.finish||'',
          dimensions: p.dimensions||'', weight: p.weight||'',
          categoryId: p.categoryId||'', collectionId: p.collectionId||'',
          featured: p.featured, active: p.active,
        })
        setExistingImgs(p.images || [])
      }
    }).finally(() => setLoading(false))
  }, [id])

  const set = (k: string) => (e: React.ChangeEvent<any>) => setForm((f:any) => ({ ...f, [k]: e.target.value }))

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setNewImages(prev => [...prev, ...files])
    files.forEach(f => {
      const r = new FileReader(); r.onload = ev => setPreviews(prev => [...prev, ev.target?.result as string]); r.readAsDataURL(f)
    })
  }

  const deleteExistingImg = async (img: any) => {
    try { await adminProductsApi.deleteImage(id, img.id); setExistingImgs(prev => prev.filter(i => i.id !== img.id)); toast.success('Imagem removida') }
    catch { toast.error('Erro') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await adminProductsApi.update(id, {
        ...form, price: Number(form.price),
        priceWholesale: form.priceWholesale ? Number(form.priceWholesale) : null,
        comparePrice:   form.comparePrice   ? Number(form.comparePrice)   : null,
        stock:          Number(form.stock),
        categoryId:     form.categoryId     || null,
        collectionId:   form.collectionId   || null,
      })
      if (newImages.length > 0) {
        const fd = new FormData(); newImages.forEach(f => fd.append('images', f))
        await adminProductsApi.uploadImages(id, fd)
      }
      toast.success('Produto atualizado!'); router.push('/admin/produtos')
    } catch (err: any) { toast.error(err.response?.data?.error || 'Erro') }
    finally { setSaving(false) }
  }

  const cls = "w-full px-4 py-2.5 border border-nude bg-white text-sm font-body focus:outline-none focus:border-charcoal"
  const lbl = "block text-[10px] tracking-[0.2em] uppercase text-charcoal/55 mb-1.5 font-body"

  if (loading) return <div className="p-8 font-display text-xl italic text-charcoal/40">Carregando...</div>

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produtos" className="text-charcoal/40 hover:text-charcoal"><ArrowLeft size={20}/></Link>
        <h1 className="font-display text-3xl italic font-normal text-charcoal">Editar produto</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Informações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className={lbl}>Nome *</label><input value={form.name} onChange={set('name')} required className={cls} /></div>
            <div><label className={lbl}>SKU</label><input value={form.sku} onChange={set('sku')} className={cls} /></div>
            <div><label className={lbl}>Categoria</label>
              <select value={form.categoryId} onChange={set('categoryId')} className={cls + ' cursor-pointer'}>
                <option value="">Sem categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2"><label className={lbl}>Descrição</label><textarea value={form.description} onChange={set('description')} rows={3} className={cls + ' resize-none'} /></div>
            <div className="md:col-span-2"><label className={lbl}>História</label><textarea value={form.story} onChange={set('story')} rows={3} className={cls + ' resize-none'} /></div>
          </div>
        </div>
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Preços e estoque</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className={lbl}>Preço *</label><input type="number" step="0.01" value={form.price} onChange={set('price')} required className={cls} /></div>
            <div><label className={lbl}>Atacado</label><input type="number" step="0.01" value={form.priceWholesale} onChange={set('priceWholesale')} className={cls} /></div>
            <div><label className={lbl}>Original</label><input type="number" step="0.01" value={form.comparePrice} onChange={set('comparePrice')} className={cls} /></div>
            <div><label className={lbl}>Estoque</label><input type="number" value={form.stock} onChange={set('stock')} className={cls} min="0" /></div>
          </div>
        </div>
        <div className="bg-white border border-black/8 p-6">
          <h2 className="text-[11px] tracking-widest uppercase text-charcoal/55 mb-5 font-body">Imagens</h2>
          {existingImgs.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {existingImgs.map(img => (
                <div key={img.id} className="relative w-20 h-20">
                  <Image src={img.url} alt="" width={80} height={80} className="w-full h-full object-cover border border-nude" />
                  <button type="button" onClick={() => deleteExistingImg(img)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-nude hover:border-charcoal transition-colors cursor-pointer bg-nude/10">
            <Upload size={18} className="text-charcoal/40 mb-1.5" />
            <span className="text-sm text-charcoal/55">Adicionar mais imagens</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewImages} />
          </label>
          {previews.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {previews.map((src,i) => <div key={i} className="relative w-16 h-16"><Image src={src} alt="" width={64} height={64} className="w-full h-full object-cover border border-nude" /></div>)}
            </div>
          )}
        </div>
        <div className="bg-white border border-black/8 p-6">
          <div className="flex gap-6">
            {[['featured','Destaque'],['active','Ativo']].map(([k,l]) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[k]} onChange={e => setForm((f:any) => ({ ...f, [k]: e.target.checked }))} className="accent-charcoal w-4 h-4" />
                <span className="text-sm font-body text-charcoal">{l}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-8 py-3.5 bg-charcoal text-white text-[11px] tracking-widest uppercase font-body font-medium hover:bg-terra transition-colors disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
          <Link href="/admin/produtos" className="px-8 py-3.5 border border-nude text-charcoal text-[11px] tracking-widest uppercase font-body hover:border-charcoal transition-colors">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
