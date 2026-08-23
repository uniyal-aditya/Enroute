import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import LanguageSelector from './LanguageSelector.jsx'
import {
  Truck,
  Package,
  User as UserIcon,
  LogOut,
  LogIn,
  Menu,
  X,
  Zap,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react'

export default function Navbar() {
  const { user, login, logout, isDriver, isCustomer } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false)
  const userMenuRef = useRef(null)
  const demoMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target)) {
        setDemoDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate('/')
  }

  const handleQuickDemoLogin = async (role) => {
    try {
      if (role === 'CUSTOMER') {
        await login('customer@enroute.com', 'Customer123!')
        navigate('/my-bookings')
      } else {
        await login('driver@enroute.com', 'Driver123!')
        navigate('/driver')
      }
      setDemoDropdownOpen(false)
      setMobileMenuOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  const brandDestination = user ? (isDriver ? '/driver' : '/my-bookings') : '/'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to={brandDestination}
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30 transition-transform group-hover:scale-105">
            <Truck className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Enroute<span className="text-blue-600">.</span>
              </span>
              <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 sm:inline-block">
                SIH 2026
              </span>
            </div>
            <span className="hidden text-[10px] font-medium text-slate-500 sm:block -mt-1">
              {t('brand_tagline', 'Move Freight, Not Air')}
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/routes"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Compass className="h-3.5 w-3.5" />
            {t('nav_browse', 'Browse Routes')}
          </NavLink>

          {user && isCustomer && (
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Package className="h-3.5 w-3.5" />
              {t('nav_my_bookings', 'My Bookings')}
            </NavLink>
          )}

          {user && isDriver && (
            <NavLink
              to="/driver"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Truck className="h-3.5 w-3.5" />
              {t('nav_driver_terminal', 'Driver Terminal')}
            </NavLink>
          )}

          {/* Quick Demo Login Fast Track Dropdown */}
          <div className="relative inline-block" ref={demoMenuRef}>
            <button
              type="button"
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
            >
              <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
              <span className="hidden lg:inline">1-Click Demo</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {demoDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 z-50">
                <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Instant Test Accounts
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('DRIVER')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">Driver (Rajesh Sharma)</span>
                    <span className="text-[10px] text-slate-400">Dehradun ➔ Delhi Run</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('CUSTOMER')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-700">
                    <Package className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">Shipper (Pooja Verma)</span>
                    <span className="text-[10px] text-slate-400">Verma Textiles &amp; Cargo</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Desktop Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          {/* Language Selector */}
          <LanguageSelector variant="navbar" />

          {user ? (
            <div className="relative inline-block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {user.name || 'User'}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500">
                    {user.role === 'DRIVER' ? 'Fleet Driver' : 'Shipper'}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 z-50">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1 space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                      {t('nav_profile', 'Profile Settings')}
                    </Link>
                    {isDriver ? (
                      <Link
                        to="/driver"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Truck className="h-3.5 w-3.5 text-slate-500" />
                        {t('nav_driver_terminal', 'Driver Terminal')}
                      </Link>
                    ) : (
                      <Link
                        to="/my-bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Package className="h-3.5 w-3.5 text-slate-500" />
                        {t('nav_my_bookings', 'My Bookings')}
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {t('nav_logout', 'Sign Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                <LogIn className="h-3.5 w-3.5" />
                {t('nav_login', 'Sign In')}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-700"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t('nav_register', 'Get Started')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector variant="navbar" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 space-y-3 md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <Link
              to="/routes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Compass className="h-4 w-4 text-blue-600" />
              {t('nav_browse', 'Browse Routes')}
            </Link>

            {user && isCustomer && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Package className="h-4 w-4 text-blue-600" />
                {t('nav_my_bookings', 'My Bookings')}
              </Link>
            )}

            {user && isDriver && (
              <Link
                to="/driver"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Truck className="h-4 w-4 text-blue-600" />
                {t('nav_driver_terminal', 'Driver Terminal')}
              </Link>
            )}

            {user && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserIcon className="h-4 w-4 text-blue-600" />
                {t('nav_profile', 'Profile')}
              </Link>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quick Test Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('DRIVER')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700"
              >
                <Truck className="h-3.5 w-3.5" />
                Driver Login
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('CUSTOMER')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-2 text-xs font-semibold text-indigo-700"
              >
                <Package className="h-3.5 w-3.5" />
                Shipper Login
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                {t('nav_logout', 'Sign Out')}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-center text-xs"
                >
                  {t('nav_login', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center text-xs"
                >
                  {t('nav_register', 'Get Started')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
