import { Link } from 'react-router-dom'
import { formatDate, StatusBadge } from '../utils/format.jsx'

export default function ListingCard({ listing }) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="card block p-4 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold leading-snug">
          {listing.origin} → {listing.destination}
        </h3>
        <StatusBadge status={listing.status} />
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Departs {formatDate(listing.departure_date)} · {Math.round(listing.distance_km)} km · by{' '}
        {listing.driver?.name}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-0.5">{listing.truck_type}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5">{listing.truck_capacity}</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
          space: {listing.available_space}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1 border-t border-slate-100 pt-3">
        <span className="text-lg font-extrabold text-blue-700">₹{listing.rate_per_km}</span>
        <span className="text-xs text-slate-500">/ km</span>
        {listing.flat_rate != null && (
          <span className="ml-auto text-xs font-semibold text-slate-600">
            or ₹{listing.flat_rate} flat
          </span>
        )}
      </div>
    </Link>
  )
}
