import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  Truck, 
  MapPin, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  MessageSquare, 
  Package, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  User 
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import LocationPicker from '../components/LocationPicker.jsx'
import { 
  formatDateTime, 
  formatDate, 
  StatusBadge, 
  whatsappLink, 
  phoneCallLink 
} from '../utils/format.jsx'

function haversineKm(a, b) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

function CreateListingForm({ onCreated }) {
  const { user } = useAuth()
  const [originPoint, setOriginPoint] = useState(null)
  const [destPoint, setDestPoint] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    distance_km: '',
    truck_type: user?.truck_type || 'Tata 407 (Medium Freight)',
    truck_capacity: user?.truck_capacity || '2.5 Tons',
    available_space: '',
    rate_per_km: '18.5',
    flat_rate: '',
    description: '',
    contact_phone: user?.phone || '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const autoDistance = () => {
    if (!originPoint || !destPoint) {
      toast.error('Pin both origin and destination on the maps first')
      return
    }
    const dist = haversineKm(originPoint, destPoint)
    // Add 15% practical road detour factor over straight line
    const roadEstimated = (dist * 1.15).toFixed(1)
    setForm({
      ...form,
      distance_km: roadEstimated,
    })
    toast.success(`Distance estimated: ${roadEstimated} km`)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!originPoint || !destPoint) {
      toast.error('Please select both origin and destination pins on the map')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/routes/', {
        ...form,
        flat_rate: form.flat_rate === '' ? null : Number(form.flat_rate),
        distance_km: Number(form.distance_km),
        rate_per_km: Number(form.rate_per_km),
        departure_date: new Date(form.departure_date).toISOString(),
        origin_lat: originPoint.lat,
        origin_lng: originPoint.lng,
        dest_lat: destPoint.lat,
        dest_lng: destPoint.lng,
      })
      toast.success('Route listing published live!')
      onCreated()
    } catch (err) {
      toast.error(getApiError(err, 'Could not create route listing'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Origin City / Hub</label>
          <input
            required
            maxLength={200}
            className="input"
            value={form.origin}
            onChange={set('origin')}
            placeholder="e.g. Dehradun Transport Nagar, UK"
          />
        </div>
        <div>
          <label className="label">Destination City / Hub</label>
          <input
            required
            maxLength={200}
            className="input"
            value={form.destination}
            onChange={set('destination')}
            placeholder="e.g. Connaught Place, New Delhi"
          />
        </div>
      </div>

      {/* Map location pickers */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LocationPicker
          label="Pin Origin on Map"
          value={originPoint}
          onChange={(pt) => {
            setOriginPoint(pt)
            if (!form.origin && pt) {
              setForm((prev) => ({ ...prev, origin: 'Selected Pin Location' }))
            }
          }}
        />
        <LocationPicker
          label="Pin Destination on Map"
          value={destPoint}
          onChange={(pt) => {
            setDestPoint(pt)
            if (!form.destination && pt) {
              setForm((prev) => ({ ...prev, destination: 'Selected Pin Location' }))
            }
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={autoDistance}
          className="btn-secondary !py-2 text-xs font-semibold"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          Auto-Calculate Distance from Pins
        </button>
        {form.distance_km && (
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {form.distance_km} km calculated
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Departure Date &amp; Time</label>
          <input
            required
            type="datetime-local"
            className="input"
            value={form.departure_date}
            onChange={set('departure_date')}
          />
        </div>
        <div>
          <label className="label">Estimated Distance (km)</label>
          <input
            required
            type="number"
            min="1"
            step="0.1"
            className="input"
            value={form.distance_km}
            onChange={set('distance_km')}
          />
        </div>
        <div>
          <label className="label">Rate (₹ per km)</label>
          <input
            required
            type="number"
            min="0"
            step="0.5"
            className="input"
            value={form.rate_per_km}
            onChange={set('rate_per_km')}
          />
        </div>
        <div>
          <label className="label">Flat Trip Rate (₹ Optional)</label>
          <input
            type="number"
            min="0"
            step="50"
            className="input"
            placeholder="e.g. 4500"
            value={form.flat_rate}
            onChange={set('flat_rate')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Truck Model / Type</label>
          <input
            required
            maxLength={50}
            className="input"
            value={form.truck_type}
            onChange={set('truck_type')}
            placeholder="e.g. Tata 407 / Eicher Pro"
          />
        </div>
        <div>
          <label className="label">Total Truck Capacity</label>
          <input
            required
            maxLength={50}
            className="input"
            value={form.truck_capacity}
            onChange={set('truck_capacity')}
            placeholder="e.g. 2.5 Tons"
          />
        </div>
        <div>
          <label className="label">Available Spare Space</label>
          <input
            required
            maxLength={100}
            className="input"
            value={form.available_space}
            onChange={set('available_space')}
            placeholder="e.g. 1.2 Tons (~60% space)"
          />
        </div>
        <div>
          <label className="label">Contact Mobile Phone</label>
          <input
            required
            minLength={6}
            maxLength={15}
            className="input"
            value={form.contact_phone}
            onChange={set('contact_phone')}
            placeholder="10-digit mobile"
          />
        </div>
      </div>

      <div>
        <label className="label">Trip Notes for Senders (Optional)</label>
        <textarea
          rows={2}
          maxLength={1000}
          className="input"
          value={form.description}
          onChange={set('description')}
          placeholder="e.g. Leaving early morning via NH58. Covered waterproof tarp available. Suitable for fragile cartons or textile bales."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full sm:w-auto !py-3 px-8 text-sm"
      >
        {submitting ? 'Publishing Route Listing…' : 'Publish Route Listing'}
      </button>
    </form>
  )
}

function MyListings({ listings, onRefresh }) {
  const cancelListing = async (id) => {
    if (!window.confirm('Cancel this route? Customers will no longer be able to request space on it.')) return
    try {
      await api.delete(`/routes/${id}`)
      toast.success('Route listing cancelled')
      onRefresh()
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  if (listings.length === 0) {
    return (
      <div className="card p-12 text-center space-y-3">
        <Truck className="mx-auto h-12 w-12 text-slate-600" />
        <h3 className="text-base font-bold text-white">You haven't listed any routes yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Publish your upcoming journeys to turn empty backhauls and unused truck capacity into steady earnings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {listings.map((l) => (
        <div key={l.id} className="card p-5 space-y-4 hover:border-slate-700 transition">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <span>{l.origin}</span>
                <ArrowRight className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{l.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Departs {formatDateTime(l.departure_date)}</span>
                <span>•</span>
                <span>{Math.round(l.distance_km)} km</span>
                <span>•</span>
                <span className="text-blue-400 font-semibold font-display">₹{l.rate_per_km}/km</span>
              </div>
            </div>
            <StatusBadge status={l.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-slate-300">
              {l.truck_type} ({l.truck_capacity})
            </span>
            <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-emerald-300 font-semibold">
              Available: {l.available_space}
            </span>
            <span className="text-slate-500 font-mono">Contact: {l.contact_phone}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
            <Link
              to={`/routes/${l.id}`}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              Preview Public Page <ArrowRight className="h-3 w-3" />
            </Link>

            {l.status === 'ACTIVE' && (
              <button
                onClick={() => cancelListing(l.id)}
                className="btn-danger !py-1 !px-3 text-xs"
              >
                Cancel Route
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function BookingRequests({ requests, onRefresh }) {
  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status })
      toast.success(status === 'CONFIRMED' ? 'Booking Accepted & Confirmed!' : 'Booking Declined')
      onRefresh()
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  if (requests.length === 0) {
    return (
      <div className="card p-12 text-center space-y-3">
        <Package className="mx-auto h-12 w-12 text-slate-600" />
        <h3 className="text-base font-bold text-white">No incoming booking requests yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          When customers request cargo space on your listed routes, they will appear here with cargo details and contact actions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((b) => (
        <div
          key={b.id}
          className={`card p-5 space-y-4 ${
            b.status === 'PENDING' ? 'border-amber-500/30 bg-slate-850' : ''
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400">Request #{b.id}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-200">
                  {b.customer?.name || `Customer #${b.customer_id}`}
                </span>
                {b.customer?.company_name && (
                  <span className="text-[10px] text-slate-400">({b.customer.company_name})</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Route: <strong className="text-white">{b.route?.origin} → {b.route?.destination}</strong> · Requested {formatDateTime(b.created_at)}
              </p>
            </div>
            <StatusBadge status={b.status} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Pickup Location</span>
              <p className="text-slate-200 mt-0.5">{b.pickup_location}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Drop-off Location</span>
              <p className="text-slate-200 mt-0.5">{b.drop_location}</p>
            </div>
            <div className="sm:col-span-2 border-t border-slate-800/80 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Cargo / Goods</span>
              <p className="text-white font-medium mt-0.5">{b.goods_description}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                Weight: {b.estimated_weight}
              </span>
            </div>
          </div>

          {/* Pending Actions */}
          {b.status === 'PENDING' && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => handleStatus(b.id, 'CONFIRMED')}
                className="btn-success !py-2 !px-5 text-xs font-bold"
              >
                <CheckCircle2 className="h-4 w-4" />
                Accept Booking Request
              </button>
              <button
                onClick={() => handleStatus(b.id, 'REJECTED')}
                className="btn-danger !py-2 !px-4 text-xs font-bold"
              >
                <XCircle className="h-4 w-4" />
                Decline Request
              </button>
            </div>
          )}

          {/* Confirmed Direct Contact Actions */}
          {b.status === 'CONFIRMED' && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Booking Confirmed — Coordinate Pickup Directly
                </span>
                <p className="text-[11px] text-slate-300">
                  Customer Phone: <span className="font-mono font-bold text-white">{b.customer_phone || b.customer?.phone}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={whatsappLink(
                    b.customer_phone || b.customer?.phone,
                    `Hi ${b.customer?.name || 'Customer'}, I have accepted your Enroute cargo booking #${b.id} (${b.pickup_location} → ${b.drop_location}). Let's coordinate pickup time.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-success !py-1.5 !px-3 text-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  WhatsApp Customer
                </a>

                <a
                  href={phoneCallLink(b.customer_phone || b.customer?.phone)}
                  className="btn-secondary !py-1.5 !px-3 text-xs"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Call Customer
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function DriverDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('listings')
  const [listings, setListings] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      api.get('/routes/my-listings'),
      api.get('/bookings/driver-requests'),
    ])
      .then(([lRes, rRes]) => {
        setListings(lRes.data)
        setRequests(rRes.data)
      })
      .catch((err) => toast.error(getApiError(err, 'Failed to load driver dashboard')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length
  const confirmedCount = requests.filter((r) => r.status === 'CONFIRMED').length
  const activeListingsCount = listings.filter((l) => l.status === 'ACTIVE').length

  const TABS = [
    { id: 'listings', label: `My Routes (${listings.length})`, icon: Truck },
    { id: 'new', label: 'Create New Route', icon: PlusCircle },
    { 
      id: 'requests', 
      label: `Booking Requests (${requests.length})`, 
      icon: Package,
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ]

  return (
    <div className="space-y-6 py-4">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Driver Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Welcome back, <strong className="text-white">{user?.name}</strong>. Monetize your truck's spare space and manage shipments.
          </p>
        </div>

        <button
          onClick={() => setTab('new')}
          className="btn-primary !py-2.5 self-start sm:self-auto text-xs font-bold"
        >
          <PlusCircle className="h-4 w-4" />
          Publish New Journey
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Routes
          </span>
          <div className="text-2xl font-black text-white font-display">{activeListingsCount}</div>
          <p className="text-[10px] text-emerald-400">Live on marketplace</p>
        </div>

        <div className="card p-4 space-y-1 border-amber-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Pending Requests
          </span>
          <div className="text-2xl font-black text-amber-400 font-display">{pendingCount}</div>
          <p className="text-[10px] text-amber-400">Awaiting your approval</p>
        </div>

        <div className="card p-4 space-y-1 border-emerald-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Confirmed Deliveries
          </span>
          <div className="text-2xl font-black text-emerald-400 font-display">{confirmedCount}</div>
          <p className="text-[10px] text-emerald-400">Ready for pickup/drop</p>
        </div>

        <div className="card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Vehicle Specs
          </span>
          <div className="text-sm font-bold text-slate-200 truncate">
            {user?.truck_type || 'Tata 407'}
          </div>
          <p className="text-[10px] text-blue-400">{user?.truck_capacity || '2.5 Tons'} cap</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-px overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
              {t.badge && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-black px-1">
                  {t.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {loading ? (
          <div className="py-16 text-center space-y-2 text-slate-400 text-xs">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p>Loading your routes and requests…</p>
          </div>
        ) : (
          <>
            {tab === 'listings' && <MyListings listings={listings} onRefresh={loadData} />}
            {tab === 'new' && (
              <div className="card p-6 sm:p-8">
                <CreateListingForm
                  onCreated={() => {
                    loadData()
                    setTab('listings')
                  }}
                />
              </div>
            )}
            {tab === 'requests' && <BookingRequests requests={requests} onRefresh={loadData} />}
          </>
        )}
      </div>
    </div>
  )
}
