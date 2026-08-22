import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  User, 
  Clock, 
  Package, 
  Star, 
  AlertCircle, 
  Info 
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import RouteMap from '../components/RouteMap.jsx'
import StatusTimeline from '../components/StatusTimeline.jsx'
import { 
  formatDateTime, 
  formatDate, 
  StatusBadge, 
  whatsappLink, 
  phoneCallLink 
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
      toast.success('Booking request sent to driver!')
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
          <label className="label">Pickup Address / Area</label>
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
          <label className="label">Drop-off Address / Area</label>
          <input
            required
            maxLength={200}
            className="input"
            placeholder="e.g. Okhla Phase 3 Warehouse, Delhi"
            value={form.drop_location}
            onChange={(e) => setForm({ ...form, drop_location: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Goods / Cargo Description</label>
          <textarea
            required
            rows={2}
            maxLength={500}
            placeholder="e.g. 4 cartons of packaged electronics, fragile, dry cargo"
            className="input"
            value={form.goods_description}
            onChange={(e) => setForm({ ...form, goods_description: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Estimated Weight / Volume</label>
          <input
            required
            maxLength={50}
            placeholder="e.g. ~80 kg (2 medium cartons)"
            className="input"
            value={form.estimated_weight}
            onChange={(e) => setForm({ ...form, estimated_weight: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
        <p className="flex items-center gap-1.5 text-slate-800 font-semibold mb-0.5">
          <Info className="h-3.5 w-3.5 text-blue-600" />
          Direct Coordination Notice:
        </p>
        Driver contact will be disclosed once the driver accepts your shipment. Payments are handled offline upon pickup.
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
        {submitting ? 'Submitting Request…' : 'Request Delivery Space'}
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
  const [myBooking, setMyBooking] = useState(undefined)
  const [showRetryForm, setShowRetryForm] = useState(false)

  const loadListing = () => {
    api
      .get(`/routes/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }

  const loadMyBookings = () => {
    if (user?.role !== 'CUSTOMER') return
    api
      .get('/bookings/my-bookings')
      .then((res) => {
        const found = res.data.find((b) => b.route_id === Number(id))
        setMyBooking(found || null)
      })
      .catch(() => setMyBooking(null))
  }

  useEffect(() => {
    loadListing()
  }, [id])

  useEffect(() => {
    loadMyBookings()
  }, [id, user])

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-xs text-slate-500">Loading route details…</p>
      </div>
    )
  }

  if (notFound || !listing) {
    return (
      <div className="card mx-auto mt-12 max-w-md p-8 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900">Route not found</h2>
        <p className="text-xs text-slate-500">
          This route listing may have been cancelled by the driver or the link is invalid.
        </p>
        <Link to="/routes" className="btn-primary inline-flex text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Browse Active Routes
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === listing.driver_id

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb back */}
      <Link
        to="/routes"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all routes
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left 7 Cols: Route Visuals, Specs & Driver Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Route Card */}
          <div className="card p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {listing.origin} → {listing.destination}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Trip ID #{listing.id} · Listed {formatDateTime(listing.created_at)}
                </p>
              </div>
              <StatusBadge status={listing.status} />
            </div>

            {/* Interactive Route Map */}
            <RouteMap
              origin={{ lat: listing.origin_lat, lng: listing.origin_lng }}
              destination={{ lat: listing.dest_lat, lng: listing.dest_lng }}
              originLabel={listing.origin}
              destinationLabel={listing.destination}
              className="h-72 sm:h-80"
            />

            {/* Core Trip Specs Grid */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs sm:grid-cols-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Departure Time
                </span>
                <p className="mt-1 font-bold text-slate-900 text-sm">
                  {formatDateTime(listing.departure_date)}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Total Distance
                </span>
                <p className="mt-1 font-bold text-slate-900 text-sm">
                  {Math.round(listing.distance_km)} km
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Freight Rate
                </span>
                <p className="mt-1 font-bold text-blue-600 text-sm font-display">
                  ₹{listing.rate_per_km}/km
                </p>
                {listing.flat_rate && (
                  <span className="text-[10px] text-emerald-700 font-semibold">₹{listing.flat_rate} flat</span>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Truck Model
                </span>
                <p className="mt-1 font-bold text-slate-800">{listing.truck_type}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Total Capacity
                </span>
                <p className="mt-1 font-bold text-slate-800">{listing.truck_capacity}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Available Space
                </span>
                <p className="mt-1 font-bold text-emerald-700">{listing.available_space}</p>
              </div>
            </div>

            {/* Driver Notes */}
            {listing.description && (
              <div className="border-t border-slate-200 pt-4 space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Notes from Driver
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {listing.description}
                </p>
              </div>
            )}
          </div>

          {/* Driver Profile Card */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Driver &amp; Vehicle Profile
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3" />
                Verified Driver Account
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white text-lg shadow-md shadow-blue-600/20">
                {listing.driver?.name?.charAt(0) || 'D'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{listing.driver?.name}</h4>
                  <div className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>4.9</span>
                    <span className="text-[10px] text-slate-400 font-normal">(18 trips)</span>
                  </div>
                </div>

                {listing.driver?.company_name && (
                  <p className="text-xs font-medium text-slate-700">
                    {listing.driver.company_name}
                  </p>
                )}

                {listing.driver?.vehicle_number && (
                  <p className="text-xs font-mono text-blue-600 font-semibold">
                    Vehicle: {listing.driver.vehicle_number}
                  </p>
                )}

                {listing.driver?.bio && (
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    {listing.driver.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Booking Request & Dynamic Status Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card p-6 space-y-4 sticky top-20">
            {/* Unauthenticated view */}
            {!user && (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Need to Ship on this Route?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sign in or register as a Customer to send a delivery request to {listing.driver?.name}. Direct WhatsApp &amp; Phone call contact will unlock immediately upon driver approval.
                </p>
                <div className="space-y-2 pt-2">
                  <Link to="/login" className="btn-primary w-full text-xs">
                    Sign in to Request Delivery
                  </Link>
                  <Link to="/register" className="btn-secondary w-full text-xs">
                    Create Customer Account
                  </Link>
                </div>
              </div>
            )}

            {/* Driver owner viewing own listing */}
            {isOwner && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Truck className="h-5 w-5" />
                  <h3 className="text-base font-bold text-slate-900">Your Listed Route</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Incoming requests from senders for this trip appear on your Driver Dashboard. Accept them to reveal customer contact details.
                </p>
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200 space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Your Registered Phone</span>
                  <p className="font-mono font-bold text-slate-900">{listing.contact_phone}</p>
                </div>
                <Link to="/driver" className="btn-primary w-full text-xs">
                  Go to Driver Dashboard
                </Link>
              </div>
            )}

            {/* Other Driver viewing */}
            {user && !isOwner && user.role === 'DRIVER' && (
              <div className="space-y-3 text-center py-4">
                <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">Driver Account Detected</h3>
                <p className="text-xs text-slate-600">
                  Only Customer accounts can request goods transportation. Drivers post and manage their own routes.
                </p>
                <Link to="/driver" className="btn-secondary w-full text-xs">
                  Go to Your Driver Dashboard
                </Link>
              </div>
            )}

            {/* Customer viewing */}
            {user && !isOwner && user.role === 'CUSTOMER' && (
              <div className="space-y-5">
                {myBooking === undefined && (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Checking active booking status…
                  </div>
                )}

                {/* State A: Booking CONFIRMED -> Reveal Contact */}
                {myBooking?.status === 'CONFIRMED' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                        <ShieldCheck className="h-5 w-5" />
                        <span>Booking Confirmed by Driver!</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {listing.driver?.name} accepted your booking request #{myBooking.id}. You can now coordinate pickup location &amp; timings directly.
                      </p>
                    </div>

                    <StatusTimeline status="CONFIRMED" />

                    {/* Contact Actions */}
                    <div className="space-y-2 pt-2">
                      {myBooking.contact_phone && (
                        <>
                          <a
                            href={whatsappLink(
                              myBooking.contact_phone,
                              `Hi ${listing.driver?.name}, my Enroute booking #${myBooking.id} (${myBooking.pickup_location} → ${myBooking.drop_location}) is confirmed. Let's coordinate pickup.`
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-success w-full text-xs font-bold"
                          >
                            <MessageSquare className="h-4 w-4" />
                            WhatsApp Driver ({myBooking.contact_phone})
                          </a>

                          <a
                            href={phoneCallLink(myBooking.contact_phone)}
                            className="btn-secondary w-full text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            <PhoneCall className="h-4 w-4" />
                            Call Driver Directly
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* State B: Booking PENDING */}
                {myBooking?.status === 'PENDING' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                        <Clock className="h-5 w-5 animate-pulse text-amber-600" />
                        <span>Request Sent to Driver</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Your booking request #{myBooking.id} is waiting for {listing.driver?.name}'s review. Contact actions unlock immediately once confirmed.
                      </p>
                    </div>

                    <StatusTimeline status="PENDING" />

                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Your Submitted Shipment</span>
                      <p className="text-slate-800 font-medium">{myBooking.goods_description}</p>
                      <p className="text-slate-600 text-[11px]">Weight: {myBooking.estimated_weight}</p>
                    </div>
                  </div>
                )}

                {/* State C: Booking REJECTED */}
                {myBooking?.status === 'REJECTED' && !showRetryForm && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <span>Request Declined</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        The driver was unable to accommodate this shipment request. You can send a revised request with different volume details.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowRetryForm(true)}
                      className="btn-outline w-full text-xs"
                    >
                      Submit Revised Request
                    </button>
                  </div>
                )}

                {/* State D: No booking yet OR retrying */}
                {(myBooking === null || (myBooking?.status === 'REJECTED' && showRetryForm)) && (
                  <div>
                    {listing.status !== 'ACTIVE' ? (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 text-center">
                        This route is {listing.status.toLowerCase()} and is no longer accepting delivery requests.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            Request Delivery Space
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Submit your cargo details for {listing.driver?.name}'s review.
                          </p>
                        </div>

                        <BookingRequestForm
                          listing={listing}
                          onBooked={() => {
                            setMyBooking(undefined)
                            setShowRetryForm(false)
                            loadMyBookings()
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
