/**
 * GuestRoute — replaces ProtectedRoute for demo mode.
 * Redirects to /onboarding if no guest profile exists in localStorage.
 * The original ProtectedRoute (JWT-based) is preserved in ProtectedRoute.jsx
 * and can be restored by swapping this import in App.jsx.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useGuest } from '../context/GuestContext.jsx'

export default function GuestRoute() {
  const { hasProfile } = useGuest()
  const location = useLocation()

  if (!hasProfile) {
    return <Navigate to="/onboarding" replace state={{ from: location }} />
  }

  return <Outlet />
}
