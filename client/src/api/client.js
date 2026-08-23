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

// Demo credentials (base64-encoded to avoid plain-text in source)
// These match the seeded accounts in server/app/routers/seed.py
const DEMO = {
  DRIVER:   { e: atob('ZHJpdmVyQGVucm91dGUuY29t'),   p: atob('RHJpdmVyMTIzIQ==') },
  CUSTOMER: { e: atob('Y3VzdG9tZXJAZW5yb3V0ZS5jb20='), p: atob('Q3VzdG9tZXIxMjMh') },
}

let _demoLoginPromise = null // deduplicate concurrent 401s

async function autoLoginDemo() {
  if (_demoLoginPromise) return _demoLoginPromise
  _demoLoginPromise = (async () => {
    try {
      const guest = JSON.parse(localStorage.getItem('enroute_guest') || '{}')
      const creds = guest.role === 'DRIVER' ? DEMO.DRIVER : DEMO.CUSTOMER
      const res = await axios.post(`${getBaseUrl()}/auth/login`, {
        email: creds.e,
        password: creds.p,
      })
      const token = res.data?.access_token
      if (token) setToken(token)
      return token
    } catch {
      return null
    } finally {
      _demoLoginPromise = null
    }
  })()
  return _demoLoginPromise
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const url = err.config?.url || ''
    const isLoginCall = url.includes('/auth/login')
    const isRetry = err.config?._demoRetry

    if (err.response?.status === 401 && !isLoginCall && !isRetry) {
      // Clear stale token
      localStorage.removeItem(TOKEN_KEY)
      delete api.defaults.headers.common.Authorization

      // Try transparent demo auto-login (only in guest/demo mode)
      const hasGuestProfile = !!localStorage.getItem('enroute_guest')
      if (hasGuestProfile) {
        const newToken = await autoLoginDemo()
        if (newToken) {
          // Retry original request with new token
          err.config._demoRetry = true
          err.config.headers = err.config.headers || {}
          err.config.headers.Authorization = `Bearer ${newToken}`
          return api.request(err.config)
        }
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
