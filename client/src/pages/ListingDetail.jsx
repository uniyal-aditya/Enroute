import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import RouteMap from '../components/RouteMap.jsx'
import { formatDateTime, StatusBadge, whatsappLink } from '../utils/format.jsx'

function BookingForm({ listing, onBooked }) {
  const [form, setForm] = useState({
    pickup_location: '',
    drop_location: '',
    goods_description: '',
    estimated_weight: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/bookings/', { route_id: listing.id, ...form })
      toast.success('Booking request sent! The driver will respond soon.')
      onBooked()
    } catch (err) {
      toast.error(getApiError(err, 'Could not create booking'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Pickup location</label>
          <input
            required
            maxLength={200}
            className="input"
            value={form.pickup_location}
            onChange={(e) => setForm({ ...form, pickup_location: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Drop location</label>
          <input
            required
            maxLength={200}
            className="input"
            value={form.drop_location}
            onChange={(e) => setForm({ ...form, drop_location: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">What are you shipping?</label>
        <textarea
          required
          rows={2}
          maxLength={500}
          placeholder="e.g. 4 cartons of apparel, fragile"
          className="input"
          value={form.goods_description}
          onChange={(e) => setForm({ ...form, goods_description: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Estimated weight</label>
        <input
          required
          maxLength={50}
          placeholder="e.g. ~150 kg"
          className="input"
          value={form.estimated_weight}
          onChange={(e) => setForm({ ...form, estimated_weight: e.target.value })}
        />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Sending…' : 'Request Booking'}
      </button>
    </form>
  )
}

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  // undefined = still checking, null = no request yet
  const [myBooking, setMyBooking] = useState(undefined)
  const [showForm, setShowForm] = useState(false)

  const loadListing = () => {
    api
      .get(`/routes/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }

  useEffect(loadListing, [id])

  useEffect(() => {
    if (user?.role !== 'CUSTOMER') return undefined
    let cancelled = false
    api
      .get('/bookings/my-bookings')
      .then((res) => {
        if (!cancelled) {
          setMyBooking(res.data.find((b) => b.route_id === Number(id)) || null)
        }
      })
      .catch(() => !cancelled && setMyBooking(null))
    return () => {
      cancelled = true
    }
  }, [id, user])

  if (loading) return <div className="py-16 text-center text-slate-400">Loading route…</div>
  if (notFound)
    return (
      <div className="card mx-auto mt-10 max-w-md p-6 text-center">
        <p className="font-semibold">Route not found.</p>
        <Link to="/" className="btn-primary mt-4">
          Back to Browse
        </Link>
      </div>
    )

  const isOwner = user?.id === listing.driver_id

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      <div>
        <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">
          ← Back to all routes
        </Link>

        <div className="card mt-3 p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h1 className="text-2xl font-extrabold">
              {listing.origin} → {listing.destination}
            </h1>
            <StatusBadge status={listing.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Posted by {listing.driver?.name} · listed {formatDateTime(listing.created_at)}
          </p>

          <RouteMap
            origin={{ lat: listing.origin_lat, lng: listing.origin_lng }}
            destination={{ lat: listing.dest_lat, lng: listing.dest_lng }}
          />

          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Departure</dt>
              <dd className="mt-0.5 font-semibold">{formatDateTime(listing.departure_date)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Distance</dt>
              <dd className="mt-0.5 font-semibold">{Math.round(listing.distance_km)} km</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Rate</dt>
              <dd className="mt-0.5 font-semibold text-blue-700">₹{listing.rate_per_km}/km</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Truck</dt>
              <dd className="mt-0.5 font-semibold">{listing.truck_type}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Capacity</dt>
              <dd className="mt-0.5 font-semibold">{listing.truck_capacity}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Space left</dt>
              <dd className="mt-0.5 font-semibold">{listing.available_space}</dd>
            </div>
          </dl>

          {listing.description && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h2 className="text-sm font-bold">Notes from driver</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                {listing.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          {!user && (
            <>
              <h2 className="font-bold">Want to ship on this route?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Log in as a customer to send the driver a booking request. The driver's contact
                unlocks once they approve you.
              </p>
              <Link to="/login" className="btn-primary mt-4 w-full">
                Log in to request
              </Link>
            </>
          )}

          {isOwner && (
            <>
              <h2 className="font-bold">Your listing</h2>
              <p className="mt-2 text-sm text-slate-500">
                Booking requests appear on your Driver Dashboard. Approve one there to open the
                chat with that customer's shipment details.
              </p>
              <p className="mt-3 text-sm text-slate-600">Your contact: {listing.contact_phone}</p>
            </>
          )}

          {user && !isOwner && user.role === 'DRIVER' && (
            <>
              <h2 className="font-bold">Drivers cannot book</h2>
              <p className="mt-2 text-sm text-slate-500">
                Only customer accounts can send booking requests on routes.
              </p>
            </>
          )}

          {user && !isOwner && user.role === 'CUSTOMER' && (
            <>
              {myBooking === undefined && (
                <p className="text-sm text-slate-400">Checking your request…</p>
              )}

              {myBooking?.status === 'CONFIRMED' && (
                <>
                  <span className="badge bg-emerald-100 text-emerald-700">Request approved</span>
                  <p className="mt-2 text-sm text-slate-600">
                    {myBooking.route?.driver?.name} approved your request. Chat is now open.
                  </p>
                  <a
                    href={whatsappLink(
                      myBooking.contact_phone,
                      `Hi ${myBooking.route?.driver?.name}, my Enroute request #${myBooking.id} (${myBooking.pickup_location} → ${myBooking.drop_location}) was approved. Let's coordinate.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-success mt-4 w-full"
                  >
                    Chat on WhatsApp
                  </a>
                  {myBooking.contact_phone && (
                    <p className="mt-2 text-xs text-slate-400">{myBooking.contact_phone}</p>
                  )}
                </>
              )}

              {myBooking?.status === 'PENDING' && (
                <>
                  <span className="badge bg-amber-100 text-amber-700">Request sent</span>
                  <p className="mt-2 text-sm text-slate-500">
                    Waiting for {listing.driver?.name} to approve or reject your request. Their
                    contact unlocks right after approval.
                  </p>
                </>
              )}

              {myBooking?.status === 'REJECTED' && (
                <>
                  <span className="badge bg-red-100 text-red-700">Request rejected</span>
                  <p className="mt-2 text-sm text-slate-500">
                    The driver declined this request. You can try again with different cargo
                    details if it still fits.
                  </p>
                  {!showForm && (
                    <button onClick={() => setShowForm(true)} className="btn-outline mt-4 w-full">
                      Send a new request
                    </button>
                  )}
                </>
              )}

              {(myBooking === null || (myBooking?.status === 'REJECTED' && showForm)) && (
                <>
                  {listing.status !== 'ACTIVE' ? (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                      This route is {listing.status.toLowerCase()} and no longer accepting
                      requests.
                    </p>
                  ) : (
                    <>
                      <h2 className="font-bold">Request this route</h2>
                      <p className="mb-3 mt-1 text-xs text-slate-400">
                        The driver approves or rejects first — their number unlocks on approval.
                      </p>
                      <BookingForm
                        listing={listing}
                        onBooked={() => {
                          setMyBooking(undefined)
                          api
                            .get('/bookings/my-bookings')
                            .then(
                              (res) =>
                                setMyBooking(
                                  res.data.find((b) => b.route_id === Number(id)) || null
                                )
                            )
                            .catch(() => setMyBooking(null))
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {(!user || user.role === 'CUSTOMER') && (
          <div className="card bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
            How it works: 1) You send a request with pickup, drop and cargo info. 2) The driver
            reviews it on their dashboard and approves or rejects. 3) On approval, WhatsApp chat
            opens between you both.
          </div>
        )}
      </aside>
    </div>
  )
}
