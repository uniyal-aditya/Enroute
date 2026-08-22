import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { 
  Truck, 
  MapPin, 
  Package, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react'

export default function Navbar() {
  const { user, logout, isDriver, isCustomer } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
      isActive
        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-blue-50 text-blue-700 border border-blue-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`

  const brandDestination = user ? (isDriver ? '/driver' : '/my-bookings') : '/'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link 
          to={brandDestination} 
          className="flex items-center gap-3 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src="/hero.png"
            alt="Enroute Logo"
            className="h-10 w-auto max-w-[50px] object-contain transition duration-200 group-hover:scale-105"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-display font-black tracking-tight text-slate-900">
                ENROUTE
              </span>
              <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 border border-blue-200 md:inline-block">
                SIH 2026
              </span>
            </div>
            <span className="hidden text-[10px] uppercase font-bold tracking-widest text-slate-500 sm:block -mt-1">
              Move Freight, Not Air
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/routes" className={linkClass}>
            <MapPin className="h-4 w-4" />
            Browse Routes
          </NavLink>

          {isDriver && (
            <>
              <NavLink to="/driver" className={linkClass}>
                <Truck className="h-4 w-4" />
                Driver Dashboard
              </NavLink>
            </>
          )}

          {isCustomer && (
            <NavLink to="/my-bookings" className={linkClass}>
              <Package className="h-4 w-4" />
              My Bookings
            </NavLink>
          )}
        </nav>

        {/* Auth / Profile Area */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight text-slate-900">{user.name}</p>
                  <p className="text-[10px] font-medium text-slate-500 capitalize">
                    {user.role?.toLowerCase()}
                  </p>
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden animate-fade-in space-y-3 shadow-lg">
          <nav className="space-y-1">
            <NavLink to={brandDestination} end className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              {user ? 'My Dashboard' : 'Home'}
            </NavLink>
            <NavLink to="/routes" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              <MapPin className="h-4 w-4" />
              Browse Routes
            </NavLink>

            {isDriver && (
              <NavLink to="/driver" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <Truck className="h-4 w-4" />
                Driver Dashboard
              </NavLink>
            )}

            {isCustomer && (
              <NavLink to="/my-bookings" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <Package className="h-4 w-4" />
                My Bookings
              </NavLink>
            )}

            {user && (
              <NavLink to="/profile" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
                <UserIcon className="h-4 w-4" />
                Profile Settings
              </NavLink>
            )}
          </nav>

          <div className="border-t border-slate-200 pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role?.toLowerCase()}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="btn-secondary text-xs !py-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs !py-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
