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
  User, 
  DollarSign, 
  ShieldCheck, 
  Fuel, 
  CheckSquare, 
  Navigation, 
  FileText, 
  Send,
  Zap
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

const ROUTE_PRESETS = [
  {
    title: 'Dehradun ➔ Delhi NCR',
    origin: 'Dehradun Transport Nagar, UK',
    destination: 'Okhla Phase 3 / Connaught Place, New Delhi',
    originPoint: { lat: 30.3165, lng: 78.0322 },
    destPoint: { lat: 28.6139, lng: 77.2090 },
    distance: '245',
    rate: '18.5',
    space: '1.8 Tons (70% capacity)',
  },
  {
    title: 'Haridwar ➔ Meerut Bypass',
    origin: 'Haridwar Industrial Area, UK',
    destination: 'Meerut Partapur Bypass, UP',
    originPoint: { lat: 29.9457, lng: 78.1642 },
    destPoint: { lat: 28.9845, lng: 77.7064 },
    distance: '145',
    rate: '18.0',
    space: '1.5 Tons (60% capacity)',
  },
  {
    title: 'Rishikesh ➔ Chandigarh',
    origin: 'Rishikesh Main Market, UK',
    destination: 'Chandigarh Transport Area, Sector 26',
    originPoint: { lat: 30.0869, lng: 78.2676 },
    destPoint: { lat: 30.7333, lng: 76.7794 },
    distance: '215',
    rate: '19.0',
    space: '2.0 Tons (75% capacity)',
  },
  {
    title: 'Jaipur ➔ Delhi Hub',
    origin: 'Jaipur VKIA Industrial Area, RJ',
    destination: 'Delhi Sanjay Gandhi Transport Nagar',
    originPoint: { lat: 26.9124, lng: 75.7873 },
    destPoint: { lat: 28.7500, lng: 77.1500 },
    distance: '280',
    rate: '17.5',
    space: '2.5 Tons (80% capacity)',
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

  const applyPreset = (p) => {
    setOriginPoint(p.originPoint)
    setDestPoint(p.destPoint)
    // Default departure tomorrow morning 8 AM
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(8, 0, 0, 0)
    const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)

    setForm({
      ...form,
      origin: p.origin,
      destination: p.destination,
      departure_date: localIso,
      distance_km: p.distance,
      rate_per_km: p.rate,
      available_space: p.space,
      description: `Leaving via Highway corridor. Heavy duty tarp cover available. Accommodates cartons, wooden crates, and parcel bags safely.`,
    })
    toast.success(`Corridor template loaded: ${p.title}`)
  }

  const autoDistance = () => {
    if (!originPoint || !destPoint) {
      toast.error('Pin both origin and destination on the maps first')
      return
    }
    const dist = haversineKm(originPoint, destPoint)
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

  // Live Earnings Calculator calculations
  const distanceNum = parseFloat(form.distance_km) || 0
  const rateNum = parseFloat(form.rate_per_km) || 0
  const estimatedGrossRevenue = Math.round(distanceNum * rateNum)
  const estimatedFuelExpense = Math.round(distanceNum * 8.5) // ~8.5 Rs/km fuel overhead for small trucks
  const estimatedNetProfit = Math.max(0, estimatedGrossRevenue - estimatedFuelExpense)

  return (
    <div className="space-y-6">
      {/* 1-Click Quick Corridor Templates */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
          <Zap className="h-4 w-4 text-blue-600" />
          <span>Quick Highway Corridor Templates (1-क्लिक रूट टेम्प्लेट्स)</span>
        </div>
        <p className="text-xs text-slate-600">
          Click any frequent trucking corridor below to auto-fill distance, map locations, and suggested freight rates:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {ROUTE_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => applyPreset(p)}
              className="rounded-xl border border-blue-200 bg-white p-2.5 text-left transition hover:border-blue-400 hover:bg-blue-50/80 shadow-xs group"
            >
              <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-700">
                {p.title}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {p.distance} km · ₹{p.rate}/km
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Origin City / Hub (रवाना होने का स्थान)</label>
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
            <label className="label">Destination City / Hub (गंतव्य स्थान)</label>
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
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Auto-Calculate Distance from Map Pins
          </button>
          {form.distance_km && (
            <span className="text-xs font-mono text-emerald-700 font-bold">
              {form.distance_km} km calculated
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Departure Date &amp; Time (प्रस्थान समय)</label>
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
            <label className="label">Freight Rate (₹ per km)</label>
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

        {/* Live Trip Earnings Estimator Box */}
        {distanceNum > 0 && rateNum > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Trip Revenue &amp; Extra Profit Estimate (अनुमानित अतिरिक्त कमाई)
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Based on {distanceNum} km trip distance @ ₹{rateNum}/km
                </p>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Gross Revenue</span>
                  <div className="text-lg font-extrabold text-slate-900 font-display">₹{estimatedGrossRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 uppercase font-bold">Estimated Extra Profit</span>
                  <div className="text-xl font-black text-emerald-700 font-display">₹{estimatedNetProfit.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

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
          className="btn-primary w-full sm:w-auto !py-3 px-8 text-sm font-bold"
        >
          {submitting ? 'Publishing Route Listing…' : 'Publish Route Listing (रूट लाइव करें)'}
        </button>
      </form>
    </div>
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

  const list = Array.isArray(listings) ? listings : []

  if (list.length === 0) {
    return (
      <div className="card p-12 text-center space-y-3">
        <Truck className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="text-base font-bold text-slate-900">You haven't listed any routes yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Publish your upcoming journeys to turn empty backhauls and unused truck capacity into steady earnings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {list.map((l) => (
        <div key={l.id} className="card p-5 space-y-4 hover:border-slate-300 transition">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <span>{l.origin}</span>
                <ArrowRight className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{l.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>Departs {formatDateTime(l.departure_date)}</span>
                <span>•</span>
                <span>{Math.round(l.distance_km)} km</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold font-display">₹{l.rate_per_km}/km</span>
              </div>
            </div>
            <StatusBadge status={l.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
              {l.truck_type} ({l.truck_capacity})
            </span>
            <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-emerald-700 font-semibold">
              Available: {l.available_space}
            </span>
            <span className="text-slate-500 font-mono">Contact: {l.contact_phone}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <Link
              to={`/routes/${l.id}`}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
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
      toast.success(
        status === 'CONFIRMED'
          ? 'Booking Accepted & Confirmed!'
          : status === 'COMPLETED'
          ? 'Delivery Marked as Delivered & Completed!'
          : 'Booking Declined'
      )
      onRefresh()
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  const reqList = Array.isArray(requests) ? requests : []

  if (reqList.length === 0) {
    return (
      <div className="card p-12 text-center space-y-3">
        <Package className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="text-base font-bold text-slate-900">No incoming booking requests yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          When customers request cargo space on your listed routes, they will appear here with cargo details and direct contact actions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reqList.map((b) => (
        <div
          key={b.id}
          className={`card p-5 space-y-4 ${
            b.status === 'PENDING'
              ? 'border-amber-200 bg-amber-50/30'
              : b.status === 'CONFIRMED'
              ? 'border-blue-200 bg-blue-50/20'
              : ''
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600">Request #{b.id}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-800">
                  {b.customer?.name || `Customer #${b.customer_id}`}
                </span>
                {b.customer?.company_name && (
                  <span className="text-[10px] text-slate-500">({b.customer.company_name})</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Route: <strong className="text-slate-900">{b.route?.origin} → {b.route?.destination}</strong> · Requested {formatDateTime(b.created_at)}
              </p>
            </div>
            <StatusBadge status={b.status} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Pickup Location (पिकअप स्थान)</span>
              <p className="text-slate-800 mt-0.5 font-medium">{b.pickup_location}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Drop-off Location (डिलीवरी स्थान)</span>
              <p className="text-slate-800 mt-0.5 font-medium">{b.drop_location}</p>
            </div>
            <div className="sm:col-span-2 border-t border-slate-200 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Cargo / Goods (सामान का विवरण)</span>
              <p className="text-slate-900 font-medium mt-0.5">{b.goods_description}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Weight: {b.estimated_weight}
              </span>
            </div>
          </div>

          {/* Pending Actions */}
          {b.status === 'PENDING' && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => handleStatus(b.id, 'CONFIRMED')}
                className="btn-success !py-2.5 !px-5 text-xs font-bold"
              >
                <CheckCircle2 className="h-4 w-4" />
                Accept &amp; Lock Space (स्वीकार करें)
              </button>
              <button
                onClick={() => handleStatus(b.id, 'REJECTED')}
                className="btn-danger !py-2.5 !px-4 text-xs font-bold"
              >
                <XCircle className="h-4 w-4" />
                Decline (अस्वीकार करें)
              </button>
            </div>
          )}

          {/* Confirmed Direct Contact & Progression Actions */}
          {b.status === 'CONFIRMED' && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Booking Confirmed — Ready for Pickup &amp; Dispatch
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Customer: <strong className="text-slate-900">{b.customer?.name}</strong> · Phone: <span className="font-mono font-bold text-slate-900">{b.customer_phone || b.customer?.phone}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleStatus(b.id, 'COMPLETED')}
                  className="btn-primary !py-1.5 !px-4 text-xs font-bold self-start sm:self-auto"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark Delivered (डिलीवरी पूरी मार्क करें)
                </button>
              </div>

              {/* One-Tap WhatsApp and Phone Actions with pre-formatted message */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-200/80">
                <a
                  href={whatsappLink(
                    b.customer_phone || b.customer?.phone,
                    `नमस्ते ${b.customer?.name || ''}! मैं आपका Enroute ड्राइवर हूँ। आपकी बुकिंग #${b.id} (${b.pickup_location} ➔ ${b.drop_location}) कन्फर्म है। पिकअप का सही समय तय करने के लिए संपर्क करें।`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-success !py-1.5 !px-3.5 text-xs font-bold"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  WhatsApp (हिंदी संदेश)
                </a>

                <a
                  href={whatsappLink(
                    b.customer_phone || b.customer?.phone,
                    `Hello ${b.customer?.name || 'Customer'}! I am your Enroute driver. Your booking #${b.id} (${b.pickup_location} -> ${b.drop_location}) is confirmed. Please confirm pickup time.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !py-1.5 !px-3 text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5 text-blue-600" />
                  WhatsApp (English)
                </a>

                <a
                  href={phoneCallLink(b.customer_phone || b.customer?.phone)}
                  className="btn-secondary !py-1.5 !px-3 text-xs font-bold text-blue-700"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Direct Call ({b.customer_phone || b.customer?.phone})
                </a>
              </div>
            </div>
          )}

          {b.status === 'COMPLETED' && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-xs text-blue-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              Delivery Completed &amp; Handover Done
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function DriverChecklist() {
  const [items, setItems] = useState([
    { id: 1, text: 'Covered Tarpaulin & Weatherproof Seal (तिरपाल सुरक्षा चेक)', done: true },
    { id: 2, text: 'Cargo Tie-Down Ratchet Straps (मजबूत रस्सियाँ / बेल्ट)', done: true },
    { id: 3, text: 'Valid Driver Licence, RC & Vehicle Insurance (ड्राइविंग लाइसेंस व बीमा)', done: true },
    { id: 4, text: 'Spare Tyre Pressure & Jack Tool Kit (स्टेपनी व टूल किट)', done: false },
    { id: 5, text: 'Offline Delivery Challan / Bilty Copy (बिल्टी / चालान तैयार)', done: false },
  ])

  const toggle = (id) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  const completedCount = items.filter((i) => i.done).length

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Pre-Trip Driver Safety &amp; Readiness Checklist
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick inspection before departing to ensure smooth transit and safety.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-bold font-mono">
          {completedCount} / {items.length} Ready
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <label
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
              item.done
                ? 'border-emerald-200 bg-emerald-50/40 text-slate-900 font-medium'
                : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => {}}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-xs">{item.text}</span>
          </label>
        ))}
      </div>
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
        setListings(Array.isArray(lRes.data) ? lRes.data : [])
        setRequests(Array.isArray(rRes.data) ? rRes.data : [])
      })
      .catch((err) => {
        setListings([])
        setRequests([])
        toast.error(getApiError(err, 'Failed to load driver dashboard'))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const safeRequests = Array.isArray(requests) ? requests : []
  const safeListings = Array.isArray(listings) ? listings : []

  const pendingCount = safeRequests.filter((r) => r.status === 'PENDING').length
  const confirmedCount = safeRequests.filter((r) => r.status === 'CONFIRMED').length
  const completedCount = safeRequests.filter((r) => r.status === 'COMPLETED').length
  const activeListingsCount = safeListings.filter((l) => l.status === 'ACTIVE').length

  const TABS = [
    { id: 'listings', label: `My Routes (${safeListings.length})`, icon: Truck },
    { id: 'new', label: 'Create New Route', icon: PlusCircle },
    { 
      id: 'requests', 
      label: `Booking Requests (${safeRequests.length})`, 
      icon: Package,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { id: 'checklist', label: 'Safety Checklist', icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6 py-4">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Driver Command Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Welcome, <strong className="text-slate-900">{user?.name}</strong> · Vehicle: <strong className="text-blue-700">{user?.vehicle_number || user?.truck_type || 'Verified Fleet'}</strong>
          </p>
        </div>

        <button
          onClick={() => setTab('new')}
          className="btn-primary !py-2.5 self-start sm:self-auto text-xs font-bold"
        >
          <PlusCircle className="h-4 w-4" />
          Publish New Journey (नया रूट लिस्ट करें)
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Active Routes (सक्रिय रूट)
          </span>
          <div className="text-2xl font-black text-slate-900 font-display">{activeListingsCount}</div>
          <p className="text-[10px] text-emerald-600 font-semibold">Live on marketplace</p>
        </div>

        <div className="card p-4 space-y-1 border-amber-200 bg-amber-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Pending Requests (नए अनुरोध)
          </span>
          <div className="text-2xl font-black text-amber-700 font-display">{pendingCount}</div>
          <p className="text-[10px] text-amber-700 font-semibold">Awaiting your approval</p>
        </div>

        <div className="card p-4 space-y-1 border-emerald-200 bg-emerald-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Confirmed Deliveries
          </span>
          <div className="text-2xl font-black text-emerald-700 font-display">{confirmedCount}</div>
          <p className="text-[10px] text-emerald-700 font-semibold">Ready for pickup &amp; transit</p>
        </div>

        <div className="card p-4 space-y-1 border-blue-200 bg-blue-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
            Completed Trips (सफल डिलीवरी)
          </span>
          <div className="text-2xl font-black text-blue-700 font-display">{completedCount}</div>
          <p className="text-[10px] text-blue-700 font-semibold">Delivered cargo runs</p>
        </div>
      </div>

      {/* Horn OK Please Highway Radio Driver Feature Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950 p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 z-10">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-3xl shadow-lg shadow-orange-500/30">
            🎺
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white tracking-tight font-display">
                हॉर्न ओके प्लीज · Horn OK Please
              </span>
              <span className="rounded-full bg-orange-500/20 border border-orange-400/40 px-2.5 py-0.5 text-[10px] font-bold text-orange-300">
                Highway Dhaba Radio
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              ट्रक ड्राइवर्स के लिए स्पेशल हाईवे म्यूज़िक, लाइव हॉर्न बीट्स, शायरी और नॉन-स्टॉप रोडट्रिप प्लेलिस्ट।
            </p>
          </div>
        </div>

        <Link
          to="/horn-ok-please"
          className="z-10 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-black text-black shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-400 active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <span>Open Radio (रेडियो शुरू करें)</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Ambient subtle glow in background */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-orange-500/20 blur-2xl" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-px overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-700 bg-blue-50/60'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
          <div className="py-16 text-center space-y-2 text-slate-500 text-xs">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p>Loading your routes and requests…</p>
          </div>
        ) : (
          <>
            {tab === 'listings' && <MyListings listings={safeListings} onRefresh={loadData} />}
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
            {tab === 'requests' && <BookingRequests requests={safeRequests} onRefresh={loadData} />}
            {tab === 'checklist' && <DriverChecklist />}
          </>
        )}
      </div>
    </div>
  )
}
