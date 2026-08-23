import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useGuest } from '../context/GuestContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import LanguageSelector from './LanguageSelector.jsx'
import RoleSwitcher from './RoleSwitcher.jsx'
import {
  Truck,
  Package,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  Compass,
  LayoutDashboard,
  ChevronDown,
  ArrowLeftRight,
  LogOut,
} from 'lucide-react'

export default function Navbar() {
  const { profile, hasProfile, name, isDriver, clearProfile, switchRole, role } = useGuest()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleReset = () => {
    clearProfile()
    setUserDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate('/onboarding')
  }

  const brandDestination = hasProfile ? '/dashboard' : '/'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
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

        {/* Desktop nav */}
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

          {hasProfile && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </NavLink>
          )}

          {hasProfile && isDriver && (
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
              Driver Terminal
            </NavLink>
          )}

          {hasProfile && !isDriver && (
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
              My Bookings
            </NavLink>
          )}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          <LanguageSelector variant="navbar" />

          {hasProfile ? (
            <div className="flex items-center gap-2">
              {/* Role switcher pill */}
              <RoleSwitcher />

              {/* Profile dropdown */}
              <div className="relative inline-block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none"
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white shadow-xs ${isDriver ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                    {name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-semibold text-slate-800 leading-tight">{name || 'Guest'}</div>
                    <div className="text-[10px] font-medium text-slate-500">
                      {isDriver ? '🚛 Driver' : '📦 Parcel Sender'}
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 z-50">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">{name}</p>
                      <p className="text-[11px] text-slate-500">{isDriver ? 'Driver Mode' : 'Parcel Mode'}</p>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          switchRole(isDriver ? 'CUSTOMER' : 'DRIVER')
                          setUserDropdownOpen(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <ArrowLeftRight className="h-3.5 w-3.5 text-slate-400" />
                        Switch to {isDriver ? 'Parcel Mode' : 'Driver Mode'}
                      </button>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Reset Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
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

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 space-y-3 md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <Link
              to="/routes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Compass className="h-4 w-4 text-blue-600" />
              Browse Routes
            </Link>

            {hasProfile && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                Dashboard
              </Link>
            )}

            {hasProfile && isDriver && (
              <Link
                to="/driver"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Truck className="h-4 w-4 text-blue-600" />
                Driver Terminal
              </Link>
            )}

            {hasProfile && !isDriver && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Package className="h-4 w-4 text-blue-600" />
                My Bookings
              </Link>
            )}

            {hasProfile && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserIcon className="h-4 w-4 text-blue-600" />
                Profile
              </Link>
            )}
          </div>

          {hasProfile ? (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{name}</span>
                <RoleSwitcher />
              </div>
              <button
                type="button"
                onClick={() => {
                  switchRole(isDriver ? 'CUSTOMER' : 'DRIVER')
                  setMobileMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Switch to {isDriver ? '📦 Parcel Mode' : '🚛 Driver Mode'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-500"
              >
                <LogOut className="h-4 w-4" />
                Reset Profile
              </button>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-3">
              <Link
                to="/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-center text-xs py-3"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
