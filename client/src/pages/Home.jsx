import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Truck,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Search,
  Package,
  Sparkles,
  TrendingDown,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import ListingCard from '../components/ListingCard.jsx'

export default function Home() {
  const { user, isDriver } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [featuredRoutes, setFeaturedRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickSearch, setQuickSearch] = useState({ origin: '', destination: '', truck_type: '' })

  // Auto-navigate authenticated users to their corresponding dashboard
  useEffect(() => {
    if (user) {
      navigate(isDriver ? '/driver' : '/my-bookings', { replace: true })
    }
  }, [user, isDriver, navigate])

  useEffect(() => {
    api
      .get('/routes/')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFeaturedRoutes(res.data.slice(0, 6))
        } else {
          setFeaturedRoutes([])
        }
      })
      .catch(() => setFeaturedRoutes([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const query = new URLSearchParams()
    if (quickSearch.origin.trim()) query.set('origin', quickSearch.origin.trim())
    if (quickSearch.destination.trim()) query.set('destination', quickSearch.destination.trim())
    if (quickSearch.truck_type.trim()) query.set('truck_type', quickSearch.truck_type.trim())
    navigate(`/routes?${query.toString()}`)
  }

  const routesList = Array.isArray(featuredRoutes) ? featuredRoutes : []

  return (
    <div className="space-y-12 py-2 sm:space-y-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/10 p-8 sm:p-12 lg:p-14">
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Smart India Hackathon 2026 • Logistics &amp; Freight</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              {t('hero_title', 'Trucks are already going your way.')}
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-blue-100/90 leading-relaxed">
              {t(
                'hero_subtitle',
                'Enroute connects commercial truck drivers with spare cargo space to businesses & shippers needing fast, affordable courier & freight delivery across India.'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/routes"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-md shadow-black/10 transition hover:bg-blue-50 hover:shadow-lg active:scale-[0.98]"
              >
                <Search className="h-4 w-4 text-blue-600" />
                {t('hero_cta_browse', 'Explore Live Routes')}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]"
              >
                <Truck className="h-4 w-4 text-blue-200" />
                {t('hero_cta_driver', 'List Your Truck Capacity')}
              </Link>
            </div>
          </div>

          <div className="hidden lg:col-span-4 lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl" />
              <img
                src="/hero.png"
                alt="Enroute Smart Logistics"
                className="relative h-56 w-56 rounded-3xl object-contain p-2 ring-1 ring-white/30 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE TELEMETRY STATS */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-5 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-600">
            <TrendingDown className="h-5 w-5" />
            <span className="text-2xl font-extrabold text-slate-900">40–60%</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t('stat_freight_saved', 'Freight Cost Saved')}
          </p>
        </div>

        <div className="card p-5 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-2xl font-extrabold text-slate-900">100%</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t('stat_verified_trucks', 'Verified Fleet Drivers')}
          </p>
        </div>

        <div className="card p-5 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-600">
            <Truck className="h-5 w-5" />
            <span className="text-2xl font-extrabold text-slate-900">500+</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t('stat_active_corridors', 'Active Interstate Routes')}
          </p>
        </div>

        <div className="card p-5 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-600">
            <Leaf className="h-5 w-5" />
            <span className="text-2xl font-extrabold text-slate-900">-35%</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t('stat_carbon_reduction', 'CO₂ Emissions Reduced')}
          </p>
        </div>
      </section>

      {/* 3. CORRIDOR SEARCH BAR */}
      <section className="card p-6 shadow-md border-slate-200">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            {t('search_title', 'Find Available Cargo Space Along Interstate Corridors')}
          </h2>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-4 relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_origin', 'From Origin (e.g. Delhi)')}
              className="input !pl-10"
              value={quickSearch.origin}
              onChange={(e) => setQuickSearch({ ...quickSearch, origin: e.target.value })}
            />
          </div>

          <div className="sm:col-span-4 relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_destination', 'To Destination (e.g. Mumbai)')}
              className="input !pl-10"
              value={quickSearch.destination}
              onChange={(e) => setQuickSearch({ ...quickSearch, destination: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2 relative">
            <Truck className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_truck_type', 'Truck Type (e.g. Tata 407)')}
              className="input !pl-10"
              value={quickSearch.truck_type}
              onChange={(e) => setQuickSearch({ ...quickSearch, truck_type: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary w-full text-xs font-semibold">
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </form>
      </section>

      {/* 4. LIVE CORRIDORS & ACTIVE LISTINGS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Active Corridors</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time verified truck runs with spare cargo payload.
            </p>
          </div>
          <Link
            to="/routes"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>View all corridors</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="card py-16 text-center text-slate-400 space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-xs font-medium">{t('search_loading', 'Loading available routes…')}</p>
          </div>
        ) : routesList.length === 0 ? (
          <div className="card py-16 text-center space-y-2">
            <Package className="mx-auto h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-700">
              {t('search_no_results', 'No active routes found')}
            </p>
            <p className="text-xs text-slate-500">
              {t('search_no_results_desc', 'Try broadening your search filters or check back shortly.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routesList.map((route) => (
              <ListingCard key={route.id} listing={route} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW ENROUTE WORKS (TWO-SIDED VALUE) */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card p-8 space-y-4 border-blue-100 bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Package className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">For Shippers &amp; Businesses</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need to send urgent cartons, machinery parts, or wholesale parcels? Instead of booking a dedicated whole truck or paying high courier surge fees, place your consignment on a truck already making the journey.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>40%–60% lower costs than traditional courier</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct driver phone &amp; WhatsApp coordination</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Same-day or next-morning corridor delivery</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link to="/routes" className="btn-primary text-xs font-semibold">
              Find a Route Now
            </Link>
          </div>
        </div>

        <div className="card p-8 space-y-4 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <Truck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">For Fleet Drivers &amp; Transporters</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Running empty or with half-empty cargo container space on your regular runs? Publish your route in seconds, monetize your extra capacity, and earn ₹3,000–₹10,000 extra per interstate run.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Zero platform commission deduction</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>You control pickup spots and accept only suitable cargo</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Instant driver dashboard with 1-click publishing</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link to="/register" className="btn-secondary text-xs font-semibold">
              Register Your Truck
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
