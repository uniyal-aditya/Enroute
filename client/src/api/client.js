import axios from 'axios'

const TOKEN_KEY = 'enroute_token'

// Prioritize VITE_API_URL or VITE_API_BASE, fallback to relative /api
// In production (Vercel), VITE_API_BASE must be set to the Railway backend URL
// e.g. VITE_API_BASE=https://<your-project>.up.railway.app  (no /api suffix)
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '')
    // Guard against accidental double /api (e.g. VITE_API_BASE=https://host/api)
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`
  }
  // Fallback: relative path — only works locally via Vite dev proxy.
  // In production this WILL cause 405 errors if VITE_API_BASE is not set.
  if (import.meta.env.PROD) {
    console.error(
      '[Enroute] VITE_API_BASE is not set. ' +
        'API requests will fail in production. ' +
        'Set VITE_API_BASE=https://<railway-domain> in your Vercel environment variables.'
    )
  }
  return '/api'
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Initialize auth header from storage on startup
const initialToken = localStorage.getItem(TOKEN_KEY)
if (initialToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initialToken}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear token only on unauthorized protected calls (not initial login failures)
      const url = err.config?.url || ''
      if (!url.includes('/auth/login')) {
        localStorage.removeItem(TOKEN_KEY)
        delete api.defaults.headers.common.Authorization
      }
    }
    return Promise.reject(err)
  }
)

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  delete api.defaults.headers.common.Authorization
}

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
