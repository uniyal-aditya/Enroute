import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Package,
  MapPin,
  Truck,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Clock,
  Search,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import StatusTimeline from '../components/StatusTimeline.jsx'
import {
  formatDateTime,
  StatusBadge,
  whatsappLink,
  phoneCallLink,
} from '../utils/format.jsx'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = () => {
    setLoading(true)
    api
      .get('/bookings/my-bookings')
      .then((res) => setBookings(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        setBookings([])
        toast.error(getApiError(err, 'Could not load your shipments'))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) {
      return
    }
    try {
      await api.post(`/bookings/${bookingId}/cancel`)
      toast.success('Booking request cancelled.')
      loadBookings()
    } catch (err) {
      toast.error(getApiError(err, 'Could not cancel booking'))
    }
  }

  const safeBookings = Array.isArray(bookings) ? bookings : []
  const pending = safeBookings.filter((b) => b.status === 'PENDING').length
  const confirmed = safeBookings.filter((b) => b.status === 'CONFIRMED').length
  const completed = safeBookings.filter((b) => b.status === 'COMPLETED').length

  return (
    <div className="space-y-6 py-2">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Shipper Consignment Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            My Shipments &amp; Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track your parcel transportation requests and coordinate directly with verified drivers.
          </p>
        </div>

        <Link to="/routes" className="btn-primary self-start sm:self-auto text-xs font-semibold">
          <Search className="h-4 w-4" />
          Find New Route
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-4 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
          <div className="text-2xl font-bold text-slate-900">{safeBookings.length}</div>
          <p className="text-[11px] text-slate-400">All submitted consignments</p>
        </div>

        <div className="card p-4 space-y-1 bg-amber-50/50 border-amber-200/80">
          <span className="text-xs font-bold text-amber-800">Pending Review</span>
          <div className="text-2xl font-bold text-amber-900">{pending}</div>
          <p className="text-[11px] text-amber-700">Awaiting driver confirmation</p>
        </div>

        <div className="card p-4 space-y-1 bg-blue-50/50 border-blue-200/80">
          <span className="text-xs font-bold text-blue-800">Confirmed Active</span>
          <div className="text-2xl font-bold text-blue-900">{confirmed}</div>
          <p className="text-[11px] text-blue-700">Driver contact unlocked</p>
        </div>

        <div className="card p-4 space-y-1 bg-emerald-50/50 border-emerald-200/80">
          <span className="text-xs font-bold text-emerald-800">Delivered</span>
          <div className="text-2xl font-bold text-emerald-900">{completed}</div>
          <p className="text-[11px] text-emerald-700">Successfully transported</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-600" />
          Your Consignments ({safeBookings.length})
        </h2>

        {loading ? (
          <div className="card py-16 text-center text-slate-400 space-y-2">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-xs">Loading shipment status…</p>
          </div>
        ) : safeBookings.length === 0 ? (
          <div className="card py-16 text-center space-y-3">
            <Package className="mx-auto h-10 w-10 text-slate-300" />
            <p className="font-bold text-slate-800">No shipments placed yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Find an active highway corridor going your way and request space for your cargo.
            </p>
            <Link to="/routes" className="btn-primary text-xs mt-2">
              Browse Active Corridors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {safeBookings.map((b) => (
              <div
                key={b.id}
                className="card p-6 shadow-sm border-slate-200/90 space-y-5"
              >
                {/* Header: Route title & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/routes/${b.route_id}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition flex items-center gap-1.5"
                      >
                        {b.route?.origin} ➔ {b.route?.destination}
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </Link>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Departure: {formatDateTime(b.route?.departure_date)}
                      </span>
                      <span>•</span>
                      <span>{b.route?.truck_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="btn-outline text-rose-600 border-rose-200 hover:bg-rose-50 text-xs py-1.5 px-3"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel Request
                      </button>
                    )}
                    <Link
                      to={`/routes/${b.route_id}`}
                      className="btn-secondary text-xs self-start sm:self-auto py-1.5 px-3"
                    >
                      View Corridor Page
                    </Link>
                  </div>
                </div>

                {/* Status Stepper */}
                <StatusTimeline status={b.status} />

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <div className="space-y-1">
                    <div><strong>Pickup Hub:</strong> {b.pickup_location}</div>
                    <div><strong>Drop Location:</strong> {b.drop_location}</div>
                  </div>
                  <div className="space-y-1">
                    <div><strong>Cargo Description:</strong> {b.goods_description}</div>
                    <div><strong>Estimated Weight:</strong> {b.estimated_weight}</div>
                  </div>
                </div>

                {/* Driver Contact Unlocked on CONFIRMED */}
                {b.status === 'CONFIRMED' && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Driver Contact Unlocked
                      </div>
                      <p className="text-emerald-800">
                        Driver: <strong>{b.route?.driver?.name || 'Verified Transporter'}</strong> • Phone: <strong>{b.contact_phone || b.route?.contact_phone || b.route?.driver?.phone}</strong>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={phoneCallLink(b.contact_phone || b.route?.contact_phone || b.route?.driver?.phone)}
                        className="btn-success text-xs py-2 px-3"
                      >
                        <PhoneCall className="h-3.5 w-3.5" /> Call Driver
                      </a>
                      <a
                        href={whatsappLink(
                          b.contact_phone || b.route?.contact_phone || b.route?.driver?.phone,
                          `Hi ${b.route?.driver?.name}, I have a confirmed booking on your ${b.route?.origin} ➔ ${b.route?.destination} route.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary text-xs py-2 px-3"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
