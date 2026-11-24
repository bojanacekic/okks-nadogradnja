import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Attach JWT token to every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const profileApi = {
  get: () => api.get('/profile'),
  updatePreferences: (data) => api.put('/profile/preferences', data),
}

export const productsApi = {
  getRecommendations: (id) => api.get(`/products/${id}/recommendations`),
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

export const ordersApi = {
  getMessages: (id) => api.get(`/orders/${id}/messages`),
  sendMessage: (id, data) => api.post(`/orders/${id}/messages`, data),
  assignCourier: (id, courierId) => api.patch(`/orders/${id}/courier`, { courierId }),
  place: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
}

export const adminApi = {
  getCouriers: () => api.get('/couriers'),
  getStats: () => api.get('/admin/stats'),
}

export default api
