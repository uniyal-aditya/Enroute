import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  Clock,
  Package,
  Calendar,
  MapPin,
  Truck,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import RouteMap from '../components/RouteMap.jsx'
import StatusTimeline from '../components/StatusTimeline.jsx'
import {
  formatDateTime,
  StatusBadge,
  whatsappLink,
  phoneCallLink,
} from '../utils/format.jsx'

function BookingRequestForm({ listing, onBooked }) {
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
      toast.success('Booking request dispatched to driver!')
      onBooked()
    } catch (err) {
      toast.error(getApiError(err, 'Could not submit booking request'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="label">Pickup Address / Hub</label>
          <input
            required
            maxLength={200}
            className="input"
            placeholder="e.g. Patel Nagar Wholesale Hub, Dehradun"
            value={form.pickup_location}
            onChange={(e) => setForm({ ...form, pickup_location: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Drop-off Address / Warehouse</label>
          <input
            required
            maxLength={200}
            className="input"
            placeholder="e.g. Okhla Phase 3 Warehouse, New Delhi"
            value={form.drop_location}
            onChange={(e) => setForm({ ...form, drop_location: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Cargo / Goods Description</label>
          <textarea
            required
            rows={2}
            maxLength={500}
            placeholder="e.g. 4 cartons of packaged electronics (fragile, keep dry)"
            className="input"
            value={form.goods_description}
            onChange={(e) => setForm({ ...form, goods_description: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Estimated Weight / Quantity</label>
          <input
            required
            maxLength={50}
            placeholder="e.g. ~80 kg / 2 cartons"
            className="input"
            value={form.estimated_weight}
            onChange={(e) => setForm({ ...form, estimated_weight: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full py-3 text-xs font-bold"
      >
        <Package className="h-4 w-4" />
        {submitting ? 'Dispatching Request…' : 'Submit Space Booking Request'}
      </button>

      <p className="text-center text-[11px] text-slate-500">
        No payment is charged now. Driver contact and direct handover are unlocked upon confirmation.
      </p>
    </form>
  )
}

export default function ListingDetail() {
  const { id } = useParams()
  const { user, isDriver } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myBooking, setMyBooking] = useState(null)

  const loadData = () => {
    setLoading(true)
    api
      .get(`/routes/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => toast.error(getApiError(err, 'Could not load route details')))
      .finally(() => setLoading(false))

    if (user && user.role === 'CUSTOMER') {
      api
        .get('/bookings/my-bookings')
        .then((res) => {
          if (Array.isArray(res.data)) {
            const matched = res.data.find((b) => b.route_id === Number(id))
            setMyBooking(matched || null)
          }
        })
        .catch(() => {})
    }
  }

  useEffect(() => {
    loadData()
  }, [id, user])

  if (loading) {
    return (
      <div className="card my-12 py-20 text-center text-slate-400 space-y-3">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-xs font-medium">Loading corridor intelligence…</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="card my-12 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900">Corridor Not Found</h2>
        <p className="text-xs text-slate-500">This route listing may have been completed or removed.</p>
        <Link to="/routes" className="btn-secondary inline-flex text-xs">
          <ArrowLeft className="h-4 w-4" />
          Back to Routes
        </Link>
      </div>
    )
  }

  const isMyListing = user && user.id === listing.driver_id

  return (
    <div className="space-y-6 py-2">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/routes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Corridors
        </Link>
      </div>

      {/* Main Grid: Details on Left, Booking/Contact Card on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Corridor Header, Map, Description, Specs */}
        <div className="space-y-6 lg:col-span-8">
          {/* Header Card */}
          <div className="card p-6 shadow-sm border-slate-200/90 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={listing.status} />
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {Math.round(listing.distance_km)} km Corridor
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Departure: {formatDateTime(listing.departure_date)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {listing.origin} ➔ {listing.destination}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Interstate highway transit via active freight transport corridor.
              </p>
            </div>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 pt-2">
              <div className="rounded-xl bg-slate-50 p-3 text-left border border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-blue-600" />
                  Vehicle Type
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{listing.truck_type}</div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-left border border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Package className="h-3.5 w-3.5 text-indigo-600" />
                  Total Capacity
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{listing.truck_capacity}</div>
              </div>

              <div className="rounded-xl bg-emerald-50/70 p-3 text-left border border-emerald-100 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Spare Available
                </div>
                <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                  {listing.available_space}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Route Map */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-blue-600" />
              Highway Route Corridor &amp; Waypoints
            </h2>
            <RouteMap
              origin={{ lat: listing.origin_lat, lng: listing.origin_lng }}
              destination={{ lat: listing.dest_lat, lng: listing.dest_lng }}
              originLabel={listing.origin}
              destinationLabel={listing.destination}
              className="h-80 w-full"
            />
          </div>

          {/* Driver Notes & Trip Details */}
          {listing.description && (
            <div className="card p-6 shadow-sm border-slate-200/90 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Trip &amp; Cargo Handling Instructions</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Driver Profile & Booking Form */}
        <div className="space-y-6 lg:col-span-4">
          {/* Pricing & Commercial Terms Card */}
          <div className="card p-6 shadow-sm border-slate-200/90 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Commercial Pricing
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{listing.rate_per_km}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ km rate</span>
              </div>
              {listing.flat_rate != null && (
                <div className="text-xs font-semibold text-blue-600 mt-1">
                  Full spare consignment flat rate: ₹{listing.flat_rate.toLocaleString()}
                </div>
              )}
            </div>

            {/* Driver Profile Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-sm">
                  {listing.driver?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    {listing.driver?.name || 'Verified Transporter'}
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  {listing.driver?.company_name && (
                    <div className="text-xs text-slate-500">{listing.driver.company_name}</div>
                  )}
                </div>
              </div>

              {listing.driver?.bio && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{listing.driver.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Booking Action / Status Card */}
          <div className="card p-6 shadow-sm border-slate-200/90">
            {isMyListing ? (
              <div className="text-center space-y-3 py-2">
                <Truck className="mx-auto h-8 w-8 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Your Active Route Listing</h3>
                <p className="text-xs text-slate-500">
                  You are the operator of this trip. Track incoming consignment requests from your Driver Terminal.
                </p>
                <Link to="/driver" className="btn-primary w-full text-xs">
                  Go to Driver Terminal
                </Link>
              </div>
            ) : myBooking ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Your Booking Status</h3>
                  <StatusBadge status={myBooking.status} />
                </div>

                <StatusTimeline status={myBooking.status} />

                {myBooking.status === 'CONFIRMED' && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-2 text-xs">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <PhoneCall className="h-4 w-4 text-emerald-600" />
                      Direct Driver Coordination Unlocked
                    </div>
                    <p className="text-emerald-800">
                      Call or WhatsApp driver at: <strong>{listing.contact_phone || listing.driver?.phone}</strong>
                    </p>
                    <div className="flex gap-2 pt-1">
                      <a
                        href={phoneCallLink(listing.contact_phone || listing.driver?.phone)}
                        className="btn-success flex-1 text-xs"
                      >
                        <PhoneCall className="h-3.5 w-3.5" /> Call Driver
                      </a>
                      <a
                        href={whatsappLink(
                          listing.contact_phone || listing.driver?.phone,
                          `Hello ${listing.driver?.name}, I have a confirmed Enroute booking for ${listing.origin} ➔ ${listing.destination}.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary flex-1 text-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : user && user.role === 'CUSTOMER' ? (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Request Cargo Space</h3>
                <BookingRequestForm listing={listing} onBooked={loadData} />
              </div>
            ) : user && isDriver ? (
              <div className="text-center space-y-3 py-2 text-xs text-slate-600">
                <p>You are currently logged in as a <strong>Fleet Driver</strong>. Booking requests are placed by Shippers.</p>
                <Link to="/driver" className="btn-secondary text-xs w-full">
                  Go to Driver Terminal
                </Link>
              </div>
            ) : (
              <div className="text-center space-y-3 py-4">
                <Package className="mx-auto h-8 w-8 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Want to Book Spare Space?</h3>
                <p className="text-xs text-slate-500">
                  Sign in or create a free Shipper account to place a cargo consignment request on this run.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/login" className="btn-secondary text-xs">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-xs">
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
