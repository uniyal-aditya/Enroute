import axios from 'axios'

const TOKEN_KEY = 'enroute_token'
const GUEST_KEY = 'enroute_guest'

// ---------------------------------------------------------------------------
// Base URL resolution
// ---------------------------------------------------------------------------
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '')
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`
  }
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
  headers: { 'Content-Type': 'application/json' },
})

// ---------------------------------------------------------------------------
// On startup: clear any stale JWT tokens so they never accidentally auth
// as the wrong user when we're in guest/demo mode.
// ---------------------------------------------------------------------------
const _guestProfile = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY) || 'null') } catch { return null }
}

if (_guestProfile()) {
  // Guest mode is active — purge any old JWT so it doesn't interfere
  localStorage.removeItem(TOKEN_KEY)
}

// ---------------------------------------------------------------------------
// Request interceptor — attach auth headers per request
// ---------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const guest = _guestProfile()

  if (guest) {
    // DEMO / GUEST MODE:
    // 1. Never send a JWT — backend will use X-Demo-Role instead
    // 2. Signal which demo account to use via X-Demo-Role header
    delete config.headers.Authorization
    config.headers['X-Demo-Role'] = guest.role || 'CUSTOMER'
  } else {
    // Normal JWT mode (future production flow)
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
  }
  return config
})

// ---------------------------------------------------------------------------
// Response interceptor — clean 401 handling, no auto-login in demo mode
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || ''
      const isLoginCall = url.includes('/auth/login')

      // Only clear JWT tokens on 401 — demo mode doesn't use them
      if (!isLoginCall) {
        localStorage.removeItem(TOKEN_KEY)
        delete api.defaults.headers.common.Authorization
      }
    }
    return Promise.reject(err)
  }
)

// ---------------------------------------------------------------------------
// Token helpers (used by AuthContext / future production auth)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Error message extractor
// ---------------------------------------------------------------------------
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
