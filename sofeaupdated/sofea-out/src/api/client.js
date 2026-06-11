import axios from 'axios'

// 切换到真实后端时，只需改这一行
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - attach JWT token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sofea_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor - handle 401
// Only redirect to /login when the request carried a token (expired session).
// Unauthenticated public requests that get 401 should fail silently.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = !!localStorage.getItem('sofea_token')
      localStorage.removeItem('sofea_token')
      if (hadToken) window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
