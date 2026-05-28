import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rm_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname
      if (path.startsWith('/admin') && path !== '/admin/login') {
        localStorage.removeItem('rm_token')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export const productsApi = {
  list:     (params?: Record<string, any>) => api.get('/api/products', { params }),
  get:      (slug: string) => api.get(`/api/products/${slug}`),
  featured: () => api.get('/api/products', { params: { featured: true, limit: 6 } }),
}
export const categoriesApi = {
  list: () => api.get('/api/categories'),
  get:  (slug: string) => api.get(`/api/categories/${slug}`),
}
export const collectionsApi = {
  list: () => api.get('/api/collections'),
  get:  (slug: string) => api.get(`/api/collections/${slug}`),
}
export const ordersApi = {
  create:  (data: any) => api.post('/api/orders', data),
  abandon: (data: any) => api.post('/api/orders/cart/abandon', data),
}
export const reviewsApi   = { create: (data: any) => api.post('/api/reviews', data) }
export const newsletterApi = { subscribe: (email: string) => api.post('/api/newsletter', { email }) }

export const authApi = {
  login:          (data: any) => api.post('/api/auth/login', data),
  me:             () => api.get('/api/auth/me'),
  changePassword: (data: any) => api.put('/api/auth/password', data),
}
export const adminProductsApi = {
  list:      (params?: any) => api.get('/api/products', { params: { ...params, active: 'all' } }),
  create:    (data: any) => api.post('/api/products', data),
  update:    (id: string, data: any) => api.put(`/api/products/${id}`, data),
  delete:    (id: string) => api.delete(`/api/products/${id}`),
  duplicate: (id: string) => api.post(`/api/products/${id}/duplicate`),
  uploadImages: (productId: string, files: FormData) =>
    api.post(`/api/uploads/product/${productId}`, files, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (productId: string, imgId: string) =>
    api.delete(`/api/products/${productId}/images/${imgId}`),
  reorderImages: (productId: string, images: any[]) =>
    api.put(`/api/products/${productId}/images/reorder`, { images }),
}
export const adminOrdersApi = {
  list:         (params?: any) => api.get('/api/orders', { params }),
  get:          (id: string) => api.get(`/api/orders/${id}`),
  updateStatus: (id: string, status: string, note?: string) =>
    api.put(`/api/orders/${id}/status`, { status, note }),
  abandoned:    () => api.get('/api/orders/abandoned'),
}
export const adminAnalyticsApi = {
  dashboard: () => api.get('/api/analytics/dashboard'),
  revenue:   () => api.get('/api/analytics/revenue'),
}
export const adminCatalogApi = {
  generate: (productIds: string[]) =>
    api.post('/api/catalog/generate', { productIds }, { responseType: 'text' }),
}
export const adminReviewsApi = {
  list:    (params?: any) => api.get('/api/reviews', { params }),
  approve: (id: string) => api.put(`/api/reviews/${id}/approve`),
  delete:  (id: string) => api.delete(`/api/reviews/${id}`),
}
export const adminCustomersApi = {
  list: (params?: any) => api.get('/api/customers', { params }),
  get:  (id: string) => api.get(`/api/customers/${id}`),
}
export const adminCategoriesApi = {
  list:   (params?: any) => api.get('/api/categories', { params: { active: 'all', ...params } }),
  create: (data: any) => api.post('/api/categories', data),
  update: (id: string, data: any) => api.put(`/api/categories/${id}`, data),
  delete: (id: string) => api.delete(`/api/categories/${id}`),
}
