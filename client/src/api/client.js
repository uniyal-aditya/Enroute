import axios from 'axios'

const TOKEN_KEY = 'enroute_token'

// Prioritize VITE_API_URL or VITE_API_BASE, fallback to relative /api
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE
  if (envUrl) {
    // strip trailing slash
    const cleanUrl = envUrl.replace(/\/+$/, '')
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`
  }
  return '/api'
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
    }
    return Promise.reject(err)
  }
)

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const getApiError = (err, fallback = 'Something went wrong. Please check your connection.') => {
  if (err.code === 'ERR_NETWORK' || !err.response) {
    return 'Unable to connect to Enroute services. Please verify the backend is running.'
  }
  const detail = err?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const d = detail[0]
    const field = (d.loc || []).slice(1).join('.')
    return field ? `${field}: ${d.msg}` : d.msg
  }
  return err?.message || fallback
}

export default api
