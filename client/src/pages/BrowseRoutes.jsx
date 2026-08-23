import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  MapPin,
  Truck,
  RotateCcw,
  List,
  Map as MapIcon,
  Package,
  IndianRupee,
  Calendar,
  Compass,
} from 'lucide-react'
import api from '../api/client'
import ListingCard from '../components/ListingCard.jsx'
import RouteMap from '../components/RouteMap.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'

const EMPTY_FILTERS = {
  origin: '',
  destination: '',
  truck_type: '',
  max_rate: '',
}

export default function BrowseRoutes() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [mobileView, setMobileView] = useState('list') // 'list' or 'map'

  const [filters, setFilters] = useState({
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    truck_type: searchParams.get('truck_type') || '',
    max_rate: searchParams.get('max_rate') || '',
  })

  const loadListings = () => {
    setLoading(true)
    const params = {}
    if (filters.origin) params.origin = filters.origin
    if (filters.destination) params.destination = filters.destination
    if (filters.truck_type) params.truck_type = filters.truck_type
    if (filters.max_rate) params.max_rate = filters.max_rate

    api
      .get('/routes/', { params })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : []
        setListings(data)
        if (data.length > 0) {
          setSelectedRoute(data[0])
        } else {
          setSelectedRoute(null)
        }
      })
      .catch(() => {
        setListings([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadListings()
  }, [filters])

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSearchParams({})
  }

  const listingsList = Array.isArray(listings) ? listings : []

  return (
    <div className="space-y-6 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Interstate Freight Corridors
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Browse Logistics Routes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover verified freight trucks with active spare payload volume along highway corridors.
          </p>
        </div>

        {/* Mobile List / Map toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 lg:hidden self-start shadow-xs">
          <button
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mobileView === 'list'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            List ({listingsList.length})
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mobileView === 'map'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            Interactive Map
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 shadow-sm border-slate-200/80">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3 relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="input !pl-10"
              placeholder="Origin (e.g. Delhi)"
              value={filters.origin}
              onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
            />
          </div>

          <div className="lg:col-span-3 relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="input !pl-10"
              placeholder="Destination (e.g. Jaipur)"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            />
          </div>

          <div className="lg:col-span-3 relative">
            <Truck className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              className="input !pl-10"
              placeholder="Truck Type (e.g. Tata 407)"
              value={filters.truck_type}
              onChange={(e) => setFilters({ ...filters, truck_type: e.target.value })}
            />
          </div>

          <div className="lg:col-span-2 relative">
            <IndianRupee className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="number"
              className="input !pl-10"
              placeholder="Max Rate/km"
              value={filters.max_rate}
              onChange={(e) => setFilters({ ...filters, max_rate: e.target.value })}
            />
          </div>

          <div className="lg:col-span-1 flex items-center">
            <button
              type="button"
              onClick={clearFilters}
              title="Reset Filters"
              className="btn-secondary w-full text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Listings Grid & Interactive Map Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Listings column */}
        <div
          className={`space-y-4 lg:col-span-7 ${
            mobileView === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">
              Showing <span className="font-bold text-slate-900">{listingsList.length}</span> active routes
            </p>
          </div>

          {loading ? (
            <div className="card py-20 text-center text-slate-400 space-y-3">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <p className="text-xs font-medium">Filtering logistics routes…</p>
            </div>
          ) : listingsList.length === 0 ? (
            <div className="card py-16 text-center space-y-3">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <p className="font-bold text-slate-800">No active corridors found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your origin or destination search, or check back soon as drivers post daily runs.
              </p>
              <button onClick={clearFilters} className="btn-secondary text-xs mt-2">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {listingsList.map((l) => (
                <div
                  key={l.id}
                  onMouseEnter={() => setSelectedRoute(l)}
                  onClick={() => setSelectedRoute(l)}
                >
                  <ListingCard listing={l} isSelected={selectedRoute?.id === l.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Interactive Map Preview Column */}
        <div
          className={`lg:col-span-5 ${
            mobileView === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="sticky top-20 space-y-4">
            <div className="card p-4 shadow-sm border-slate-200">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-blue-600" />
                  Live Corridor Radar
                </span>
                {selectedRoute && (
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {Math.round(selectedRoute.distance_km)} km
                  </span>
                )}
              </div>

              {selectedRoute ? (
                <div className="space-y-3">
                  <RouteMap
                    origin={{ lat: selectedRoute.origin_lat, lng: selectedRoute.origin_lng }}
                    destination={{ lat: selectedRoute.dest_lat, lng: selectedRoute.dest_lng }}
                    originLabel={selectedRoute.origin}
                    destinationLabel={selectedRoute.destination}
                    className="h-80 w-full"
                  />

                  <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-100">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{selectedRoute.origin} ➔ {selectedRoute.destination}</span>
                      <span className="text-blue-600 font-bold">₹{selectedRoute.rate_per_km}/km</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {selectedRoute.description || 'Regular scheduled freight run with spare volume.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400 border border-slate-100">
                  Select a route on the left to inspect polyline corridor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
