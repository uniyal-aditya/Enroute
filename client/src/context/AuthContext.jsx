import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api, { getApiError, setToken, clearToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('enroute_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const res = await api.post('/auth/login', form)
    setToken(res.data.access_token)
    const me = await api.get('/auth/me')
    setUser(me.data)
    toast.success(`Welcome back, ${me.data.name}!`)
    return me.data
  }

  const register = async (payload) => {
    await api.post('/auth/register', payload)
  }

  const logout = () => {
    clearToken()
    setUser(null)
    toast('Logged out')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
