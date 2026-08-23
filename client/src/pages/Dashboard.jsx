import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Truck, Package, MapPin, ArrowRight, PlusCircle, Clock, CheckCircle2,
  XCircle, IndianRupee, Compass, LayoutDashboard, User, ArrowLeftRight,
  TrendingUp, Calendar, RefreshCw, Sparkles, ChevronRight, AlertCircle,
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useGuest } from '../context/GuestContext.jsx'
import RoleSwitcher from '../components/RoleSwitcher.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { formatDateTime, StatusBadge } from '../utils/format.jsx'

// ─── Greeting helper ─────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = 'blue', sub }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald:'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber:  'bg-amber-50 text-amber-600 border-amber-100',
    rose:   'bg-rose-50 text-rose-600 border-rose-100',
  }
  return (
    <div className="card p-5 flex items-start gap-4 border-slate-200/80 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value ?? '—'}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Quick action button ──────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, to, color = 'blue', onClick }) {
  const colors = {
    blue:   'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    emerald:'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  }
  const cls = `flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-bold transition hover:scale-[1.02] ${colors[color]}`
  if (to) return (
    <Link to={to} className={cls}>
      <Icon className="h-4 w-4 shrink-0" />
      {label}
      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
    </Link>
  )
  return (
    <button type="button" onClick={onClick} className={cls}>
      <Icon className="h-4 w-4 shrink-0" />
      {label}
      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
    </button>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ isDriver, onClearProfile }) {
  const links = isDriver
    ? [
        { icon: LayoutDashboard, label: 'Overview',        to: '/dashboard' },
        { icon: Truck,           label: 'My Trips',        to: '/routes' },
        { icon: Package,         label: 'Incoming Requests',to: '/dashboard#requests' },
        { icon: Compass,         label: 'Browse All',      to: '/routes' },
        { icon: User,            label: 'Profile',         to: '/profile' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Overview',        to: '/dashboard' },
        { icon: Compass,         label: 'Find Routes',     to: '/routes' },
        { icon: Package,         label: 'My Bookings',     to: '/dashboard#bookings' },
        { icon: User,            label: 'Profile',         to: '/profile' },
      ]

  return (
    <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-1 pt-2">
      {links.map(({ icon: Icon, label, to }) => (
        <Link
          key={label}
          to={to}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition"
        >
          <Icon className="h-4 w-4 text-slate-400" />
          {label}
        </Link>
      ))}
      <div className="mt-auto pt-6 border-t border-slate-200 mt-8">
        <button
          type="button"
          onClick={onClearProfile}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition w-full"
        >
          <XCircle className="h-3.5 w-3.5" />
          Reset Profile
        </button>
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { profile, isDriver, role, clearProfile, name } = useGuest()
  const navigate = useNavigate()

  const [routes, setRoutes]       = useState([])
  const [bookings, setBookings]   = useState([])
  const [requests, setRequests]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      // Always load public routes (no auth needed)
      const routeRes = await api.get('/routes/')
      setRoutes(Array.isArray(routeRes.data) ? routeRes.data : [])

      // Try to load authenticated data — silently skip if 401
      try {
        const bookRes = await api.get('/bookings/my-bookings')
        setBookings(Array.isArray(bookRes.data) ? bookRes.data : [])
      } catch { setBookings([]) }

      try {
        const reqRes = await api.get('/bookings/driver-requests')
        setRequests(Array.isArray(reqRes.data) ? reqRes.data : [])
      } catch { setRequests([]) }
    } catch {
      setRoutes([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadData() }, [role])

  const handleClearProfile = () => {
    clearProfile()
    navigate('/onboarding', { replace: true })
  }

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status })
      toast.success(`Request ${status.toLowerCase()}`)
      loadData(true)
    } catch (err) {
      toast.error(getApiError(err, 'Could not update status'))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  const activeRoutes    = routes.filter(r => r.status === 'ACTIVE')
  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED')
  const pendingRequests = requests.filter(r => r.status === 'PENDING')

  return (
    <div className="py-2">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-semibold text-slate-500">{getGreeting()} 👋</p>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {name || 'Welcome'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isDriver
              ? 'Ready to turn your empty cargo space into extra income?'
              : 'Ready to find a smarter route for your delivery?'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <RoleSwitcher />
        </div>
      </div>

      <div className="flex gap-6">
        <Sidebar isDriver={isDriver} onClearProfile={handleClearProfile} />

        <div className="flex-1 min-w-0 space-y-6">

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {isDriver ? (
              <>
                <StatCard icon={Truck}        label="Active Trips"        value={activeRoutes.length}     color="blue"    sub="On the road" />
                <StatCard icon={Package}      label="Pending Requests"    value={pendingRequests.length}  color="amber"   sub="Awaiting response" />
                <StatCard icon={CheckCircle2} label="Confirmed"           value={requests.filter(r=>r.status==='CONFIRMED').length} color="emerald" sub="Deliveries locked" />
                <StatCard icon={TrendingUp}   label="Total Routes"        value={routes.length}           color="indigo"  sub="Available on platform" />
              </>
            ) : (
              <>
                <StatCard icon={Package}      label="My Requests"         value={bookings.length}         color="indigo"  sub="All time" />
                <StatCard icon={Clock}        label="Pending"             value={pendingBookings.length}  color="amber"   sub="Awaiting driver" />
                <StatCard icon={CheckCircle2} label="Confirmed"           value={confirmedBookings.length}color="emerald" sub="Ready to ship" />
                <StatCard icon={Compass}      label="Available Routes"    value={activeRoutes.length}     color="blue"    sub="On the platform" />
              </>
            )}
          </div>

          {/* ── Quick Actions ── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {isDriver ? (
                <>
                  <QuickAction icon={PlusCircle} label="Post a New Trip"     to="/driver"    color="blue" />
                  <QuickAction icon={Package}    label="View Requests"       to="/driver"    color="amber" />
                  <QuickAction icon={Compass}    label="Browse All Routes"   to="/routes"   color="indigo" />
                </>
              ) : (
                <>
                  <QuickAction icon={Compass}    label="Find a Route"        to="/routes"   color="indigo" />
                  <QuickAction icon={Package}    label="My Bookings"         to="/my-bookings" color="blue" />
                  <QuickAction icon={Sparkles}   label="Browse All Routes"   to="/routes"   color="emerald" />
                </>
              )}
            </div>
          </div>

          {/* ── DRIVER: Incoming requests ── */}
          {isDriver && (
            <div id="requests">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-500" />
                  Incoming Cargo Requests
                  {pendingRequests.length > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                      {pendingRequests.length} pending
                    </span>
                  )}
                </h2>
                <Link to="/driver" className="text-xs font-semibold text-blue-600 hover:underline">
                  View all →
                </Link>
              </div>

              {requests.length === 0 ? (
                <div className="card p-6 text-center border-slate-200/80">
                  <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">No requests yet</p>
                  <p className="text-xs text-slate-400 mt-1">Post a trip to start receiving cargo requests.</p>
                  <Link to="/driver" className="btn-primary inline-flex text-xs mt-3">
                    <PlusCircle className="h-3.5 w-3.5" />Post a Trip
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 4).map((req) => (
                    <div key={req.id} className="card p-4 border-slate-200/80 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">
                              {req.customer?.name?.charAt(0) || 'C'}
                            </div>
                            <span className="text-xs font-bold text-slate-900">{req.customer?.name || 'Customer'}</span>
                            <StatusBadge status={req.status} />
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            {req.pickup_location}
                            <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                            {req.drop_location}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{req.goods_description} · {req.estimated_weight}</p>
                        </div>
                        {req.status === 'PENDING' && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleBookingStatus(req.id, 'CONFIRMED')}
                              className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />Accept
                            </button>
                            <button
                              onClick={() => handleBookingStatus(req.id, 'CANCELLED')}
                              className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 border border-rose-200 transition"
                            >
                              <XCircle className="h-3.5 w-3.5" />Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DRIVER: My active trips (public routes from API) ── */}
          {isDriver && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  Live Routes on Platform
                </h2>
                <Link to="/routes" className="text-xs font-semibold text-blue-600 hover:underline">Browse all →</Link>
              </div>
              {activeRoutes.length === 0 ? (
                <div className="card p-6 text-center border-slate-200/80">
                  <Truck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">No active routes found</p>
                  <p className="text-xs text-slate-400 mt-1">Post your first trip using the Driver Terminal.</p>
                  <Link to="/driver" className="btn-primary inline-flex text-xs mt-3">
                    <PlusCircle className="h-3.5 w-3.5" />Post a Trip
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeRoutes.slice(0, 4).map((r) => (
                    <ListingCard key={r.id} listing={r} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CUSTOMER: My bookings ── */}
          {!isDriver && (
            <div id="bookings">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-indigo-600" />
                  My Shipment Requests
                  {pendingBookings.length > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                      {pendingBookings.length} pending
                    </span>
                  )}
                </h2>
                <Link to="/my-bookings" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>
              </div>

              {bookings.length === 0 ? (
                <div className="card p-6 text-center border-slate-200/80">
                  <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">No shipment requests yet</p>
                  <p className="text-xs text-slate-400 mt-1">Browse available routes and request a delivery.</p>
                  <Link to="/routes" className="btn-primary inline-flex text-xs mt-3">
                    <Compass className="h-3.5 w-3.5" />Find a Route
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div key={b.id} className="card p-4 border-slate-200/80 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={b.status} />
                            <span className="text-xs text-slate-500">#{b.id}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            {b.pickup_location}
                            <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                            {b.drop_location}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{b.goods_description}</p>
                        </div>
                        <Link to="/my-bookings" className="text-xs font-semibold text-blue-600 hover:underline shrink-0">
                          Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CUSTOMER: Recommended routes ── */}
          {!isDriver && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-blue-600" />
                  Available Routes
                </h2>
                <Link to="/routes" className="text-xs font-semibold text-blue-600 hover:underline">Browse all →</Link>
              </div>
              {activeRoutes.length === 0 ? (
                <div className="card p-6 text-center border-slate-200/80">
                  <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">No routes available right now</p>
                  <p className="text-xs text-slate-400 mt-1">Check back soon or browse all listings.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeRoutes.slice(0, 4).map((r) => (
                    <ListingCard key={r.id} listing={r} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Profile summary card ── */}
          {profile && (
            <div className="card p-5 border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Profile</h2>
                <Link to="/profile" className="text-xs font-semibold text-blue-600 hover:underline">Edit →</Link>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-white ${isDriver ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                  {name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{name}</p>
                  <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold mt-0.5 ${isDriver ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'}`}>
                    {isDriver ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                    {isDriver ? 'Driver / Transporter' : 'Parcel Sender'}
                  </div>
                  {profile.phone && <p className="text-xs text-slate-400 mt-0.5">{profile.phone}</p>}
                  {isDriver && profile.truckType && (
                    <p className="text-xs text-slate-400">{profile.truckType} · {profile.truckCapacity}</p>
                  )}
                  {!isDriver && profile.pickup && (
                    <p className="text-xs text-slate-400">{profile.pickup} → {profile.destination}</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
