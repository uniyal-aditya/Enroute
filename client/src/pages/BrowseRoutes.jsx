import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Truck, 
  Filter, 
  X, 
  Map as MapIcon, 
  List, 
  Calendar, 
  DollarSign, 
  RotateCcw 
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import ListingCard from '../components/ListingCard.jsx'
import RouteMap from '../components/RouteMap.jsx'

const EMPTY_FILTERS = {
  origin: '',
  destination: '',
  truck_type: '',
  max_rate: '',
}

export default function BrowseRoutes() {
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
      .catch((err) => {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Logistics Route Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Discover trucks with spare payload capacity along your required delivery corridors.
          </p>
        </div>

        {/* Mobile List / Map toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 lg:hidden self-start shadow-xs">
          <button
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mobileView === 'list'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            List View
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              mobileView === 'map'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            Live Map
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-emerald-600" />
            <input
              className="input !pl-9"
              placeholder="Origin (e.g. Dehradun)"
              value={filters.origin}
              onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
            />
          </div>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-600" />
            <input
              className="input !pl-9"
              placeholder="Destination (e.g. Delhi)"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            />
          </div>

          <div className="relative">
            <Truck className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className="input !pl-9"
              placeholder="Truck type (e.g. Tata 407)"
              value={filters.truck_type}
              onChange={(e) => setFilters({ ...filters, truck_type: e.target.value })}
            />
          </div>

          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="number"
              className="input !pl-9"
              placeholder="Max Rate (₹/km)"
              value={filters.max_rate}
              onChange={(e) => setFilters({ ...filters, max_rate: e.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="btn-outline flex items-center justify-center gap-1.5 text-xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Content Area: Split View (Listings on Left, Interactive Leaflet Map on Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Route Cards */}
        <div className={`lg:col-span-6 space-y-3.5 ${mobileView === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong className="text-slate-900">{listingsList.length}</strong> active routes</span>
            <span>Click any route to preview route map</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card p-5 animate-pulse space-y-3">
                  <div className="h-5 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-10 w-full bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : listingsList.length === 0 ? (
            <div className="card p-10 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No routes match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing some filters or searching for nearby major cities. Drivers post new journeys every morning.
              </p>
              <button onClick={clearFilters} className="btn-primary !py-2 text-xs">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {listingsList.map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => setSelectedRoute(listing)}
                  className="cursor-pointer"
                >
                  <ListingCard
                    listing={listing}
                    isSelected={selectedRoute?.id === listing.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Interactive Live Route Map */}
        <div className={`lg:col-span-6 lg:sticky lg:top-20 space-y-3 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedRoute
                    ? `${selectedRoute.origin} → ${selectedRoute.destination}`
                    : 'Selected Route Map'}
                </h3>
              </div>
              {selectedRoute && (
                <span className="text-xs font-mono font-bold text-blue-600">
                  {Math.round(selectedRoute.distance_km)} km
                </span>
              )}
            </div>

            {selectedRoute ? (
              <RouteMap
                origin={{ lat: selectedRoute.origin_lat, lng: selectedRoute.origin_lng }}
                destination={{ lat: selectedRoute.dest_lat, lng: selectedRoute.dest_lng }}
                originLabel={selectedRoute.origin}
                destinationLabel={selectedRoute.destination}
                className="h-80 sm:h-96"
              />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-500">
                Select a route from the list to preview on map
              </div>
            )}

            {selectedRoute && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Truck: </span>
                  <span className="font-semibold text-slate-900">{selectedRoute.truck_type}</span>
                  <span className="text-slate-500 ml-2">Space: </span>
                  <span className="font-semibold text-emerald-700">{selectedRoute.available_space}</span>
                </div>
                <span className="font-bold text-blue-600 text-sm font-display">
                  ₹{selectedRoute.rate_per_km}/km
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
