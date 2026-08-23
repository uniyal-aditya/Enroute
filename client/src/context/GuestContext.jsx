/**
 * GuestContext — localStorage-based profile for hackathon demo mode.
 *
 * Keeps the same shape as AuthContext so pages can import from either:
 *   import { useGuest } from './GuestContext'
 *
 * Real JWT auth (AuthContext) is left 100% intact and can be restored
 * by swapping the imports in App.jsx / main.jsx.
 */
import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'enroute_guest'

const GuestContext = createContext(null)

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function GuestProvider({ children }) {
  const [profile, setProfileState] = useState(() => loadProfile())

  const setProfile = useCallback((data) => {
    saveProfile(data)
    setProfileState(data)
  }, [])

  const switchRole = useCallback((newRole) => {
    setProfile({ ...loadProfile(), role: newRole })
  }, [setProfile])

  const updateProfile = useCallback((updates) => {
    const current = loadProfile() || {}
    setProfile({ ...current, ...updates })
  }, [setProfile])

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfileState(null)
  }, [])

  const hasProfile = !!profile

  return (
    <GuestContext.Provider
      value={{
        profile,
        hasProfile,
        setProfile,
        updateProfile,
        switchRole,
        clearProfile,
        // Convenience aliases used throughout pages
        name: profile?.name || '',
        role: profile?.role || 'CUSTOMER', // 'DRIVER' | 'CUSTOMER'
        isDriver: profile?.role === 'DRIVER',
        isCustomer: profile?.role === 'CUSTOMER',
      }}
    >
      {children}
    </GuestContext.Provider>
  )
}

export const useGuest = () => {
  const ctx = useContext(GuestContext)
  if (!ctx) throw new Error('useGuest must be used inside GuestProvider')
  return ctx
}
