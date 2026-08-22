import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { getApiError } from '../api/client'
import { formatDateTime, StatusBadge, whatsappLink } from '../utils/format.jsx'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/bookings/my-bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => toast.error(getApiError(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="py-16 text-center text-slate-400">Loading your bookings…</p>

  return (
    <div>
      <h1 className="text-2xl font-extrabold">My Bookings</h1>
      <p className="mt-1 text-sm text-slate-500">Requests you've made on drivers' routes.</p>

      <div className="mt-6 space-y-3">
        {bookings.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-semibold text-slate-700">No bookings yet.</p>
            <Link to="/" className="btn-primary mt-4">
              Browse Routes
            </Link>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold">
                    {b.route?.origin} → {b.route?.destination}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Driver: {b.route?.driver?.name} · departs{' '}
                    {formatDateTime(b.route?.departure_date)} · requested{' '}
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

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/listings/${b.route_id}`} className="btn-outline !py-1.5">
                  View Route
                </Link>
                {b.status === 'CONFIRMED' && b.contact_phone && (
                  <a
                    href={whatsappLink(
                      b.contact_phone,
                      `Hi ${b.route?.driver?.name}, my Enroute booking #${b.id} (${b.pickup_location} → ${b.drop_location}) was confirmed. Let's coordinate.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-success !py-1.5"
                  >
                    WhatsApp Driver
                  </a>
                )}
                {b.status === 'PENDING' && (
                  <span className="text-xs text-slate-400 self-center">
                    Driver's contact unlocks after approval
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
