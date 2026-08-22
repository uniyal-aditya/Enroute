import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <img src="/favicon-32x32.png" alt="" className="h-7 w-7" />
          Enroute
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Browse
          </NavLink>

          {user?.role === 'DRIVER' && (
            <NavLink to="/driver" className={linkClass}>
              Driver Dashboard
            </NavLink>
          )}
          {user?.role === 'CUSTOMER' && (
            <NavLink to="/my-bookings" className={linkClass}>
              My Bookings
            </NavLink>
          )}

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <span className="hidden text-xs font-semibold text-slate-500 sm:block">
                {user.name} · {user.role.toLowerCase()}
              </span>
              <button onClick={handleLogout} className="btn-outline !py-1.5">
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/login" className="btn-outline !py-1.5">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-1.5">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
