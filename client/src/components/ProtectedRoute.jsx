import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Loading…</div>
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (role && user.role !== role) {
    return (
      <div className="card mx-auto mt-10 max-w-md p-6 text-center">
        <h2 className="text-lg font-bold">Wrong account type</h2>
        <p className="mt-2 text-sm text-slate-500">
          This page is only for {role.toLowerCase()}s. You are signed in as a{' '}
          {user.role.toLowerCase()}.
        </p>
      </div>
    )
  }
  return <Outlet />
}
