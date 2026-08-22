import axios from 'axios'

const TOKEN_KEY = 'enroute_token'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE || ''}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const getApiError = (err, fallback = 'Something went wrong') => {
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
