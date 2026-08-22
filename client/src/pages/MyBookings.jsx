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
  CheckCircle2, 
  AlertCircle, 
  Search 
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import StatusTimeline from '../components/StatusTimeline.jsx'
import { 
  formatDateTime, 
  formatDate, 
  StatusBadge, 
  whatsappLink, 
  phoneCallLink 
} from '../utils/format.jsx'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = () => {
    setLoading(true)
    api
      .get('/bookings/my-bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => toast.error(getApiError(err, 'Could not load your shipments')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const pending = bookings.filter((b) => b.status === 'PENDING').length
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length
  const completed = bookings.filter((b) => b.status === 'COMPLETED').length

  return (
    <div className="space-y-6 py-4">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Shipments &amp; Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Track your parcel transportation requests and coordinate with verified drivers.
          </p>
        </div>

        <Link to="/routes" className="btn-primary !py-2.5 self-start sm:self-auto text-xs font-bold">
          <Search className="h-4 w-4" />
          Find New Route
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Requests
          </span>
          <div className="text-2xl font-black text-slate-900 font-display">{bookings.length}</div>
          <p className="text-[10px] text-slate-500">All submitted shipments</p>
        </div>

        <div className="card p-4 space-y-1 border-amber-200 bg-amber-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Pending Review
          </span>
          <div className="text-2xl font-black text-amber-700 font-display">{pending}</div>
          <p className="text-[10px] text-amber-700 font-semibold">Awaiting driver response</p>
        </div>

        <div className="card p-4 space-y-1 border-emerald-200 bg-emerald-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Confirmed Active
          </span>
          <div className="text-2xl font-black text-emerald-700 font-display">{confirmed}</div>
          <p className="text-[10px] text-emerald-700 font-semibold">Contact unlocked</p>
        </div>

        <div className="card p-4 space-y-1 border-blue-200 bg-blue-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
            Delivered / Done
          </span>
          <div className="text-2xl font-black text-blue-700 font-display">{completed}</div>
          <p className="text-[10px] text-blue-700 font-semibold">Completed journeys</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center space-y-2 text-slate-500 text-xs">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p>Loading your shipment requests…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No delivery bookings requested yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Search available truck journeys on our interactive marketplace and request cargo space in seconds.
              </p>
            </div>
            <Link to="/routes" className="btn-primary !py-2.5 text-xs font-bold inline-flex">
              Explore Active Routes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className={`card p-5 space-y-4 transition ${
                b.status === 'CONFIRMED'
                  ? 'border-emerald-300 bg-gradient-to-tr from-white via-white to-emerald-50/40'
                  : b.status === 'PENDING'
                  ? 'border-amber-200 bg-amber-50/20'
                  : ''
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <span>{b.route?.origin}</span>
                    <ArrowRight className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>{b.route?.destination}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking #{b.id} · Driver: <strong className="text-slate-800">{b.route?.driver?.name}</strong> · Departs {formatDateTime(b.route?.departure_date)}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              {/* Status Pipeline Progress Bar */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <StatusTimeline status={b.status} />
              </div>

              {/* Cargo Details Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Pickup Location</span>
                  <p className="text-slate-800 mt-0.5">{b.pickup_location}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Drop-off Location</span>
                  <p className="text-slate-800 mt-0.5">{b.drop_location}</p>
                </div>
                <div className="sm:col-span-2 border-t border-slate-200 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Shipping Item</span>
                  <p className="text-slate-900 font-medium mt-0.5">{b.goods_description}</p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Weight: {b.estimated_weight}
                  </span>
                </div>
              </div>

              {/* Actions Bottom Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <Link
                  to={`/routes/${b.route_id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View Route Map &amp; Truck Details <ArrowRight className="h-3 w-3" />
                </Link>

                {b.status === 'CONFIRMED' && b.contact_phone && (
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={whatsappLink(
                        b.contact_phone,
                        `Hi ${b.route?.driver?.name}, my Enroute booking #${b.id} (${b.pickup_location} → ${b.drop_location}) is confirmed. Let's coordinate pickup.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-success !py-1.5 !px-3.5 text-xs font-bold"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      WhatsApp Driver ({b.contact_phone})
                    </a>

                    <a
                      href={phoneCallLink(b.contact_phone)}
                      className="btn-secondary !py-1.5 !px-3 text-xs font-bold text-blue-600"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      Call Driver
                    </a>
                  </div>
                )}

                {b.status === 'PENDING' && (
                  <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 animate-pulse text-amber-600" />
                    Driver's phone unlocks on approval
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
