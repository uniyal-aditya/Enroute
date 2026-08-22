import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api, { getApiError, setToken, clearToken, getToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
      return res.data
    } catch {
      clearToken()
      setUser(null)
      return null
    }
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    refreshUser().finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.access_token)
    const currentUser = res.data.user || (await refreshUser())
    setUser(currentUser)
    toast.success(`Welcome back, ${currentUser.name}!`)
    return currentUser
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    if (res.data.access_token) {
      setToken(res.data.access_token)
      setUser(res.data.user)
    }
    toast.success('Account created successfully!')
    return res.data.user
  }

  const updateProfile = async (payload) => {
    const res = await api.put('/auth/profile', payload)
    setUser(res.data)
    toast.success('Profile updated!')
    return res.data
  }

  const logout = () => {
    clearToken()
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        refreshUser,
        logout,
        isAuthenticated: !!user,
        isDriver: user?.role === 'DRIVER',
        isCustomer: user?.role === 'CUSTOMER',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
