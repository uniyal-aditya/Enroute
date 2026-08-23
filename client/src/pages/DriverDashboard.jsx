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
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  Calendar,
  Sparkles,
  User,
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import LocationPicker from '../components/LocationPicker.jsx'
import {
  formatDateTime,
  StatusBadge,
  whatsappLink,
  phoneCallLink,
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

const ROUTE_PRESETS = [
  {
    title: 'Dehradun ➔ Delhi NCR',
    origin: 'Dehradun Transport Nagar, UK',
    destination: 'Okhla Phase 3 / Connaught Place, New Delhi',
    originPoint: { lat: 30.3165, lng: 78.0322 },
    destPoint: { lat: 28.6139, lng: 77.2090 },
    distance: '245',
    rate: '18.5',
    space: '1.8 Tons (70% spare)',
  },
  {
    title: 'Haridwar ➔ Meerut Bypass',
    origin: 'Haridwar Industrial Area, UK',
    destination: 'Meerut Partapur Bypass, UP',
    originPoint: { lat: 29.9457, lng: 78.1642 },
    destPoint: { lat: 28.9845, lng: 77.7064 },
    distance: '145',
    rate: '18.0',
    space: '1.5 Tons (60% spare)',
  },
  {
    title: 'Rishikesh ➔ Chandigarh',
    origin: 'Rishikesh Main Market, UK',
    destination: 'Chandigarh Transport Area, Sector 26',
    originPoint: { lat: 30.0869, lng: 78.2676 },
    destPoint: { lat: 30.7333, lng: 76.7794 },
    distance: '215',
    rate: '19.0',
    space: '2.0 Tons (75% spare)',
  },
  {
    title: 'Jaipur ➔ Delhi Hub',
    origin: 'Jaipur VKIA Industrial Area, RJ',
    destination: 'Delhi Sanjay Gandhi Transport Nagar',
    originPoint: { lat: 26.9124, lng: 75.7873 },
    destPoint: { lat: 28.7500, lng: 77.1500 },
    distance: '280',
    rate: '17.5',
    space: '2.5 Tons (80% spare)',
  },
]

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

  const applyPreset = (preset) => {
    setOriginPoint(preset.originPoint)
    setDestPoint(preset.destPoint)
    setForm({
      ...form,
      origin: preset.origin,
      destination: preset.destination,
      distance_km: preset.distance,
      rate_per_km: preset.rate,
      available_space: preset.space,
      description: `Scheduled highway run along ${preset.title}. Waterproof container with secure cargo straps.`,
    })
    toast.success(`Loaded preset for ${preset.title}!`)
  }

  useEffect(() => {
    if (originPoint && destPoint) {
      const calculated = Math.round(haversineKm(originPoint, destPoint))
      setForm((f) => ({ ...f, distance_km: calculated > 0 ? calculated.toString() : f.distance_km }))
    }
  }, [originPoint, destPoint])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!originPoint || !destPoint) {
      toast.error('Please pinpoint both Origin and Destination coordinates on the map or select a quick preset.')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        origin_lat: originPoint.lat,
        origin_lng: originPoint.lng,
        dest_lat: destPoint.lat,
        dest_lng: destPoint.lng,
        distance_km: parseFloat(form.distance_km) || 0,
        rate_per_km: parseFloat(form.rate_per_km) || 0,
        flat_rate: form.flat_rate ? parseFloat(form.flat_rate) : null,
      }
      await api.post('/routes/', payload)
      toast.success('Route corridor published to live marketplace!')
      onCreated()
    } catch (err) {
      toast.error(getApiError(err, 'Could not create listing'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8 space-y-6 shadow-sm border-slate-200/90">
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider">
          <Truck className="h-4 w-4" />
          Publish Spare Truck Capacity
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Post a New Highway Corridor</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          List unused payload capacity on your scheduled trip to receive freight booking requests.
        </p>
      </div>

      {/* Quick Highway Corridors Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          1-Click Highway Presets (Smart Fill)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {ROUTE_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => applyPreset(p)}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs transition hover:border-blue-300 hover:bg-blue-50/50"
            >
              <div className="font-bold text-slate-800">{p.title}</div>
              <div className="text-[11px] text-slate-500">{p.distance} km • ₹{p.rate}/km</div>
            </button>
          ))}
        </div>
      </div>

      {/* Route Origins and Destinations */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Origin City / Transport Hub</label>
          <input
            required
            maxLength={100}
            className="input"
            placeholder="e.g. Dehradun Transport Nagar"
            value={form.origin}
            onChange={set('origin')}
          />
        </div>

        <div>
          <label className="label">Destination City / Unloading Point</label>
          <input
            required
            maxLength={100}
            className="input"
            placeholder="e.g. Connaught Place / Okhla, New Delhi"
            value={form.destination}
            onChange={set('destination')}
          />
        </div>
      </div>

      {/* Interactive Map Pickers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationPicker
          label="Origin Radar Coordinates (Pickup)"
          value={originPoint}
          onChange={setOriginPoint}
        />
        <LocationPicker
          label="Destination Radar Coordinates (Drop)"
          value={destPoint}
          onChange={setDestPoint}
        />
      </div>

      {/* Date, Distance, and Pricing */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Departure Date &amp; Time</label>
          <input
            type="datetime-local"
            required
            className="input text-xs"
            value={form.departure_date}
            onChange={set('departure_date')}
          />
        </div>

        <div>
          <label className="label">Est. Highway Distance (km)</label>
          <input
            type="number"
            step="0.1"
            required
            className="input"
            placeholder="e.g. 248"
            value={form.distance_km}
            onChange={set('distance_km')}
          />
        </div>

        <div>
          <label className="label">Rate per Kilometer (₹/km)</label>
          <input
            type="number"
            step="0.1"
            required
            className="input"
            placeholder="e.g. 18.5"
            value={form.rate_per_km}
            onChange={set('rate_per_km')}
          />
        </div>
      </div>

      {/* Vehicle Specs & Space */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Truck Model / Type</label>
          <input
            required
            maxLength={50}
            className="input"
            placeholder="e.g. Tata 407 (Medium Freight)"
            value={form.truck_type}
            onChange={set('truck_type')}
          />
        </div>

        <div>
          <label className="label">Gross Vehicle Capacity</label>
          <input
            required
            maxLength={50}
            className="input"
            placeholder="e.g. 2.5 Tons"
            value={form.truck_capacity}
            onChange={set('truck_capacity')}
          />
        </div>

        <div>
          <label className="label">Spare Available Space</label>
          <input
            required
            maxLength={50}
            className="input"
            placeholder="e.g. 1.2 Tons (~60% space)"
            value={form.available_space}
            onChange={set('available_space')}
          />
        </div>
      </div>

      {/* Description & Contact */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Direct Driver Contact Number</label>
          <input
            required
            maxLength={20}
            className="input"
            placeholder="e.g. 9876543210"
            value={form.contact_phone}
            onChange={set('contact_phone')}
          />
        </div>

        <div>
          <label className="label">Full Consignment Flat Rate (Optional ₹)</label>
          <input
            type="number"
            step="100"
            className="input"
            placeholder="e.g. 4500"
            value={form.flat_rate}
            onChange={set('flat_rate')}
          />
        </div>
      </div>

      <div>
        <label className="label">Route Notes &amp; Cargo Preference</label>
        <textarea
          rows={3}
          maxLength={1000}
          className="input"
          placeholder="e.g. Direct run via NH58. Dry covered container space available. Quick drop-offs along highway accommodated."
          value={form.description}
          onChange={set('description')}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3 text-xs font-bold"
        >
          <PlusCircle className="h-4 w-4" />
          {submitting ? 'Publishing Corridor…' : 'Publish Route to Live Marketplace'}
        </button>
      </div>
    </form>
  )
}

export default function DriverDashboard() {
  const { user } = useAuth()
  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' or 'post'

  const loadListings = () => {
    setLoading(true)
    api
      .get('/listings/my-listings')
      .then((res) => {
        setMyListings(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => setMyListings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadListings()
  }, [])

  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus })
      toast.success(
        newStatus === 'CONFIRMED'
          ? 'Consignment request confirmed!'
          : 'Booking request declined.'
      )
      loadListings()
    } catch (err) {
      toast.error(getApiError(err, 'Could not update booking status'))
    }
  }

  const allBookings = myListings.flatMap((l) =>
    (l.bookings || []).map((b) => ({ ...b, route: l }))
  )

  const pendingBookings = allBookings.filter((b) => b.status === 'PENDING')
  const confirmedBookings = allBookings.filter((b) => b.status === 'CONFIRMED')

  return (
    <div className="space-y-6 py-2">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Fleet Operator Terminal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Driver Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your active highway routes, published spare capacity, and incoming shipper requests.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Corridors &amp; Requests ({allBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'post'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            + Post New Route
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-4 space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <Truck className="h-4 w-4" />
            <span className="text-xl font-bold text-slate-900">{myListings.length}</span>
          </div>
          <p className="text-xs text-slate-500">Active Corridors</p>
        </div>

        <div className="card p-4 space-y-1">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="h-4 w-4" />
            <span className="text-xl font-bold text-slate-900">{pendingBookings.length}</span>
          </div>
          <p className="text-xs text-slate-500">Pending Requests</p>
        </div>

        <div className="card p-4 space-y-1">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xl font-bold text-slate-900">{confirmedBookings.length}</span>
          </div>
          <p className="text-xs text-slate-500">Confirmed Loads</p>
        </div>

        <div className="card p-4 space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <IndianRupee className="h-4 w-4" />
            <span className="text-xl font-bold text-slate-900">
              ₹
              {confirmedBookings
                .reduce((acc, b) => acc + (b.route?.flat_rate || (b.route?.distance_km || 0) * (b.route?.rate_per_km || 0)), 0)
                .toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500">Estimated Revenue</p>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'post' ? (
        <CreateListingForm
          onCreated={() => {
            setActiveTab('bookings')
            loadListings()
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Pending Approval Requests Section */}
          {pendingBookings.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                Action Required: Pending Consignment Requests ({pendingBookings.length})
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pendingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="card p-5 border-amber-200 bg-amber-50/40 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          {b.route?.origin} ➔ {b.route?.destination}
                        </span>
                        <div className="text-sm font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                          {b.customer?.name || 'Shipper'}
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-amber-100 text-slate-700">
                      <div><strong>Pickup:</strong> {b.pickup_location}</div>
                      <div><strong>Drop-off:</strong> {b.drop_location}</div>
                      <div><strong>Cargo:</strong> {b.goods_description}</div>
                      <div><strong>Weight:</strong> {b.estimated_weight}</div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleBookingAction(b.id, 'CONFIRMED')}
                        className="btn-success flex-1 text-xs py-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accept Load
                      </button>
                      <button
                        onClick={() => handleBookingAction(b.id, 'REJECTED')}
                        className="btn-danger flex-1 text-xs py-2"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Corridors List */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-blue-600" />
              Your Published Route Corridors ({myListings.length})
            </h2>

            {loading ? (
              <div className="card py-16 text-center text-slate-400">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <p className="text-xs mt-2">Loading terminal corridors…</p>
              </div>
            ) : myListings.length === 0 ? (
              <div className="card py-16 text-center space-y-3">
                <Truck className="mx-auto h-10 w-10 text-slate-300" />
                <p className="font-bold text-slate-800">No active corridors published yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the button below to publish your scheduled truck trip and start monetizing empty space.
                </p>
                <button
                  onClick={() => setActiveTab('post')}
                  className="btn-primary text-xs font-semibold mt-2"
                >
                  + Post First Route Corridor
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myListings.map((listing) => (
                  <div key={listing.id} className="card p-5 space-y-4 shadow-sm border-slate-200/90">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/routes/${listing.id}`}
                            className="text-base font-bold text-slate-900 hover:text-blue-600 transition flex items-center gap-1.5"
                          >
                            {listing.origin} ➔ {listing.destination}
                            <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                          </Link>
                          <StatusBadge status={listing.status} />
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{formatDateTime(listing.departure_date)}</span>
                          <span>•</span>
                          <span>{Math.round(listing.distance_km)} km</span>
                          <span>•</span>
                          <span className="font-semibold text-blue-600">₹{listing.rate_per_km}/km</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/routes/${listing.id}`}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          View Public Page
                        </Link>
                      </div>
                    </div>

                    {/* Bookings on this corridor */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-700">
                        Consignment Requests ({(listing.bookings || []).length}):
                      </div>
                      {(!listing.bookings || listing.bookings.length === 0) ? (
                        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 text-center border border-slate-100">
                          No cargo requests received yet for this trip.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {listing.bookings.map((bk) => (
                            <div
                              key={bk.id}
                              className="rounded-xl bg-slate-50 p-3.5 text-xs space-y-2 border border-slate-200/70"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">
                                  {bk.customer?.name || 'Shipper'}
                                </span>
                                <StatusBadge status={bk.status} />
                              </div>

                              <div className="text-[11px] text-slate-600 space-y-0.5">
                                <div><strong>Pickup:</strong> {bk.pickup_location}</div>
                                <div><strong>Drop:</strong> {bk.drop_location}</div>
                                <div><strong>Cargo:</strong> {bk.goods_description}</div>
                              </div>

                              {bk.status === 'CONFIRMED' && (
                                <div className="flex gap-1.5 pt-1 border-t border-slate-200">
                                  <a
                                    href={phoneCallLink(bk.customer?.phone)}
                                    className="btn-success flex-1 text-[11px] py-1"
                                  >
                                    <PhoneCall className="h-3 w-3" /> Call
                                  </a>
                                  <a
                                    href={whatsappLink(
                                      bk.customer?.phone,
                                      `Hi ${bk.customer?.name}, regarding your confirmed Enroute consignment for ${listing.origin} ➔ ${listing.destination}.`
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-secondary flex-1 text-[11px] py-1"
                                  >
                                    <MessageSquare className="h-3 w-3" /> WhatsApp
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
