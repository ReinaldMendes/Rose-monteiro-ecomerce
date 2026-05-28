'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form)
      setAuth(res.data.user, res.data.token)
      router.push('/admin')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6"
      style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(155,135,51,0.04) 0,rgba(155,135,51,0.04) 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-display text-3xl font-semibold tracking-[0.12em] text-nude">ROSE MONTEIRO</div>
          <div className="font-script text-terra text-sm mt-1">Joias · Painel Admin</div>
        </div>

        <div className="bg-off-white p-8">
          <h1 className="font-display text-xl italic font-normal text-charcoal mb-6">Entrar</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-charcoal/55 mb-1.5 font-body">E-mail</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required autoFocus
                className="w-full px-4 py-3 border border-nude bg-white text-sm font-body text-charcoal focus:outline-none focus:border-charcoal transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-charcoal/55 mb-1.5 font-body">Senha</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required
                  className="w-full px-4 py-3 border border-nude bg-white text-sm font-body text-charcoal focus:outline-none focus:border-charcoal transition-colors pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-charcoal text-white text-[11px] tracking-[0.25em] uppercase font-body font-medium hover:bg-terra transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-gold/8 border border-gold/20">
            <p className="text-[10px] text-charcoal/55 font-body leading-relaxed">
              <strong>Demo:</strong> admin@rosemonteiro.com.br / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
