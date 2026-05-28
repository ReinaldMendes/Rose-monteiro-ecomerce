import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user:  User | null
  token: string | null
  setAuth:   (user: User, token: string) => void
  clearAuth: () => void
  isAdmin:   () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:  null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('rm_token', token)
        set({ user, token })
      },
      clearAuth: () => {
        localStorage.removeItem('rm_token')
        set({ user: null, token: null })
      },
      isAdmin: () => ['ADMIN', 'SUPER_ADMIN'].includes(get().user?.role || ''),
    }),
    { name: 'rm-auth' }
  )
)
