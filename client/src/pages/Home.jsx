import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Truck, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Leaf, 
  CheckCircle, 
  Users, 
  PhoneCall, 
  MessageSquare, 
  Search 
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import ListingCard from '../components/ListingCard.jsx'

export default function Home() {
  const navigate = useNavigate()
  const [featuredRoutes, setFeaturedRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickSearch, setQuickSearch] = useState({ origin: '', destination: '' })

  useEffect(() => {
    api
      .get('/routes/')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFeaturedRoutes(res.data.slice(0, 4))
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
    if (quickSearch.origin) query.set('origin', quickSearch.origin)
    if (quickSearch.destination) query.set('destination', quickSearch.destination)
    navigate(`/routes?${query.toString()}`)
  }

  const routesList = Array.isArray(featuredRoutes) ? featuredRoutes : []

  return (
    <div className="space-y-16 py-4 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 p-6 sm:p-10 lg:p-14 shadow-sm">
        {/* Subtle background glow effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Smart India Hackathon 2026 · Team AAPHAT
            </div>

            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight text-slate-900 leading-tight">
              Turn Empty Truck Space Into <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">Smart Deliveries.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Enroute connects senders with trucks already heading their way — making deliveries 40–60% more affordable while helping drivers earn from unused cargo capacity.
            </p>

            {/* Quick Route Search Form */}
            <form onSubmit={handleSearch} className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-md sm:flex sm:items-center sm:gap-2 max-w-xl">
              <div className="flex flex-1 items-center gap-2 px-3 py-2">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  placeholder="From (e.g. Dehradun)"
                  value={quickSearch.origin}
                  onChange={(e) => setQuickSearch({ ...quickSearch, origin: e.target.value })}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-200" />

              <div className="flex flex-1 items-center gap-2 px-3 py-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                <input
                  type="text"
                  placeholder="To (e.g. Delhi)"
                  value={quickSearch.destination}
                  onChange={(e) => setQuickSearch({ ...quickSearch, destination: e.target.value })}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto !py-2.5 px-5">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/routes" className="btn-primary !py-3 !px-6 text-sm">
                Find a Route
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-secondary !py-3 !px-6 text-sm">
                <Truck className="h-4 w-4 text-blue-600" />
                List Your Truck Space
              </Link>
            </div>
          </div>

          {/* Hero Right Image & Branding Graphic */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
              <div className="overflow-hidden rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <img
                  src="/hero.png"
                  alt="Enroute Smart Logistics"
                  className="mx-auto h-52 w-52 sm:h-64 sm:w-64 object-contain transition duration-500 hover:scale-105"
                />
              </div>

              {/* Floating metrics pill */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">40–60% Savings</div>
                  <div className="text-[10px] text-slate-500">On shared backhaul runs</div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 rounded-xl border border-blue-600 bg-blue-600 px-3 py-1.5 shadow-md text-white text-[11px] font-bold flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Zero Empty Kilometers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW ENROUTE WORKS */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold sm:text-3xl text-slate-900">
            How Enroute Works
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            A seamless, two-sided workflow connecting drivers making planned trips with senders who need fast, affordable parcel &amp; freight delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="card p-6 relative overflow-hidden group hover:border-blue-400 transition duration-200">
            <div className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-display">
              01
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 mb-5">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Driver Lists a Route</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A truck driver publishing their upcoming journey sets departure time, vehicle capacity, available spare space, and fair per-km or flat pricing.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card p-6 relative overflow-hidden group hover:border-indigo-400 transition duration-200">
            <div className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-display">
              02
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 mb-5">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Customer Requests Space</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Senders search available routes on an interactive map, view truck capacity, and submit goods details (pickup, drop, cartons/weight) in one click.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card p-6 relative overflow-hidden group hover:border-emerald-400 transition duration-200">
            <div className="absolute top-4 right-4 text-3xl font-black text-slate-100 font-display">
              03
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-5">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Driver Accepts &amp; Coordinates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The driver reviews the booking. Once confirmed, WhatsApp chat and direct phone call actions unlock immediately for pickup coordination.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY ENROUTE */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-extrabold sm:text-3xl text-slate-900">
            Why Choose Enroute?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Traditional couriers charge exorbitant rates and dispatch dedicated vehicles. Enroute monetizes cargo space that was already going to travel anyway.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">40–60% Cheaper</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cut shipping costs dramatically compared to standalone courier trucks by sharing active journeys.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Driver Extra Income</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Truck drivers turn empty return journeys or spare cargo volume into supplementary profit.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <MapPin className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Tier 2 &amp; 3 Connectivity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enables regular goods transit to smaller towns like Dehradun, Haridwar, and Rishikesh along highway corridors.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <Leaf className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Eco-Friendly Freight</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reduces road congestion and carbon emissions by maximizing truck payload efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED LIVE ROUTES */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-2xl font-extrabold text-slate-900">Featured Live Routes</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active routes posted by verified drivers with available cargo space.
            </p>
          </div>

          <Link to="/routes" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Browse all routes ({routesList.length}+)
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-6 animate-pulse space-y-3">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-8 w-full bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : routesList.length === 0 ? (
          <div className="card p-8 text-center text-slate-500 text-sm">
            No live routes found. Be the first driver to post a route!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routesList.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* 5. TRUST & DIRECT COORDINATION SECTION */}
      <section className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Privacy-First Coordination
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Direct WhatsApp &amp; Call Unlocks Only Upon Driver Acceptance
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We protect driver and sender privacy. Contact details and WhatsApp chat actions remain confidential until the truck driver explicitly accepts your booking request. Payments are coordinated directly offline upon pickup or handover.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 p-3 text-xs text-slate-800 shadow-xs">
              <PhoneCall className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Direct voice calling</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 p-3 text-xs text-slate-800 shadow-xs">
              <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Instant WhatsApp coordination</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DUAL AUDIENCE CALL TO ACTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-8 bg-gradient-to-br from-blue-50 via-white to-white border-blue-200 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Truck className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Have Space on Your Next Trip?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Truck drivers and logistics owners can list their scheduled routes in under two minutes and monetize spare cargo volume.
          </p>
          <Link to="/register" className="btn-primary !py-2.5 inline-flex text-xs font-bold">
            List Your Truck Space
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="card p-8 bg-gradient-to-br from-indigo-50 via-white to-white border-indigo-200 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Need to Send Goods or Parcels?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Individuals, shops, and small businesses can search live truck trips and book reliable shipping at a fraction of courier rates.
          </p>
          <Link to="/routes" className="btn-secondary !py-2.5 inline-flex text-xs font-bold">
            Search Available Routes
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
