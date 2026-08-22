import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import LocationPicker from '../components/LocationPicker.jsx'
import { formatDateTime, StatusBadge, whatsappLink } from '../utils/format.jsx'

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
  const [originPoint, setOriginPoint] = useState(null)
  const [destPoint, setDestPoint] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    distance_km: '',
    truck_type: '',
    truck_capacity: '',
    available_space: '',
    rate_per_km: '',
    flat_rate: '',
    description: '',
    contact_phone: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const autoDistance = () => {
    if (!originPoint || !destPoint) {
      toast.error('Pick both origin and destination on the maps first')
      return
    }
    setForm({
      ...form,
      distance_km: haversineKm(originPoint, destPoint).toFixed(1),
    })
    toast.success('Distance estimated from map points')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!originPoint || !destPoint) {
      toast.error('Please pick origin and destination on the maps')
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
      toast.success('Route listed!')
      setForm({
        origin: '',
        destination: '',
        departure_date: '',
        distance_km: '',
        truck_type: '',
        truck_capacity: '',
        available_space: '',
        rate_per_km: '',
        flat_rate: '',
        description: '',
        contact_phone: '',
      })
      setOriginPoint(null)
      setDestPoint(null)
      onCreated()
    } catch (err) {
      toast.error(getApiError(err, 'Could not create listing'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Origin city</label>
          <input required maxLength={200} className="input" value={form.origin} onChange={set('origin')} placeholder="e.g. Delhi" />
        </div>
        <div>
          <label className="label">Destination city</label>
          <input required maxLength={200} className="input" value={form.destination} onChange={set('destination')} placeholder="e.g. Jaipur" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationPicker label="Pin origin on map" value={originPoint} onChange={setOriginPoint} />
        <LocationPicker label="Pin destination on map" value={destPoint} onChange={setDestPoint} />
      </div>

      <button type="button" onClick={autoDistance} className="btn-outline">
        Estimate distance from pins
      </button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Departure</label>
          <input required type="datetime-local" className="input" value={form.departure_date} onChange={set('departure_date')} />
        </div>
        <div>
          <label className="label">Distance (km)</label>
          <input required type="number" min="0.1" step="0.1" className="input" value={form.distance_km} onChange={set('distance_km')} />
        </div>
        <div>
          <label className="label">Rate ₹/km</label>
          <input required type="number" min="0" step="0.5" className="input" value={form.rate_per_km} onChange={set('rate_per_km')} />
        </div>
        <div>
          <label className="label">Flat rate (optional)</label>
          <input type="number" min="0" step="1" className="input" value={form.flat_rate} onChange={set('flat_rate')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Truck type</label>
          <input required maxLength={50} className="input" value={form.truck_type} onChange={set('truck_type')} placeholder="e.g. Tata 407" />
        </div>
        <div>
          <label className="label">Capacity</label>
          <input required maxLength={50} className="input" value={form.truck_capacity} onChange={set('truck_capacity')} placeholder="e.g. 2 tons" />
        </div>
        <div>
          <label className="label">Available space</label>
          <input required maxLength={100} className="input" value={form.available_space} onChange={set('available_space')} placeholder="e.g. half truck" />
        </div>
        <div>
          <label className="label">Contact phone</label>
          <input required minLength={6} maxLength={15} className="input" value={form.contact_phone} onChange={set('contact_phone')} />
        </div>
      </div>

      <div>
        <label className="label">Notes for customers (optional)</label>
        <textarea rows={2} maxLength={2000} className="input" value={form.description} onChange={set('description')} placeholder="e.g. Leaving early morning, can take fragile goods" />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Publishing…' : 'Publish Route'}
      </button>
    </form>
  )
}

function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api
      .get('/routes/my-listings')
      .then((res) => setListings(res.data))
      .catch((err) => toast.error(getApiError(err)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const cancelListing = async (id) => {
    if (!window.confirm('Cancel this route? Customers will no longer be able to book it.')) return
    try {
      await api.delete(`/routes/${id}`)
      toast.success('Route cancelled')
      load()
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  if (loading) return <p className="py-10 text-center text-slate-400">Loading your listings…</p>
  if (listings.length === 0)
    return (
      <div className="card p-8 text-center">
        <p className="font-semibold text-slate-700">You haven't listed any routes yet.</p>
        <p className="mt-1 text-sm text-slate-500">Create one from the "New Listing" tab above.</p>
      </div>
    )

  return (
    <div className="space-y-3">
      {listings.map((l) => (
        <div key={l.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h3 className="font-bold">
              {l.origin} → {l.destination}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Departs {formatDateTime(l.departure_date)} · {Math.round(l.distance_km)} km · ₹
              {l.rate_per_km}/km
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Contact: {l.contact_phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={l.status} />
            {l.status === 'ACTIVE' && (
              <button onClick={() => cancelListing(l.id)} className="btn-danger !py-1.5">
                Cancel Route
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function BookingRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api
      .get('/bookings/driver-requests')
      .then((res) => setRequests(res.data))
      .catch((err) => toast.error(getApiError(err)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status })
      toast.success(status === 'CONFIRMED' ? 'Booking confirmed' : 'Booking rejected')
      load()
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  if (loading) return <p className="py-10 text-center text-slate-400">Loading requests…</p>
  if (requests.length === 0)
    return (
      <div className="card p-8 text-center">
        <p className="font-semibold text-slate-700">No booking requests yet.</p>
        <p className="mt-1 text-sm text-slate-500">
          When customers request space on your routes, they show up here.
        </p>
      </div>
    )

  return (
    <div className="space-y-3">
      {requests.map((b) => (
        <div key={b.id} className="card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold">
                #{b.id} · Customer {b.customer_id}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                On route {b.route?.origin} → {b.route?.destination} · requested{' '}
                {formatDateTime(b.created_at)}
              </p>
            </div>
            <StatusBadge status={b.status} />
          </div>

          <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Pickup</dt>
              <dd>{b.pickup_location}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Drop</dt>
              <dd>{b.drop_location}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-slate-400">Goods</dt>
              <dd>
                {b.goods_description} · est. weight {b.estimated_weight}
              </dd>
            </div>
          </dl>

          {b.status === 'PENDING' && (
            <div className="mt-4 flex gap-2">
              <button onClick={() => setStatus(b.id, 'CONFIRMED')} className="btn-success !py-1.5">
                Accept
              </button>
              <button onClick={() => setStatus(b.id, 'REJECTED')} className="btn-danger !py-1.5">
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const TABS = [
  { id: 'listings', label: 'My Listings' },
  { id: 'new', label: 'New Listing' },
  { id: 'requests', label: 'Booking Requests' },
]

export default function DriverDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('listings')

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Driver Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome{user?.name ? `, ${user.name}` : ''}. Manage your routes and incoming booking
        requests.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'listings' && <MyListings />}
        {tab === 'new' && (
          <div className="card p-5">
            <CreateListingForm onCreated={() => setTab('listings')} />
          </div>
        )}
        {tab === 'requests' && <BookingRequests />}
      </div>
    </div>
  )
}
