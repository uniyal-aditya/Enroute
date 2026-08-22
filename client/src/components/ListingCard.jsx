import { Link } from 'react-router-dom'
import { Calendar, Truck, ArrowRight, Gauge, Shield, Sparkles } from 'lucide-react'
import { formatDateTime, StatusBadge } from '../utils/format.jsx'

export default function ListingCard({ listing, isSelected = false }) {
  return (
    <Link
      to={`/routes/${listing.id}`}
      className={`card-glow block p-5 group ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-850' : ''
      }`}
    >
      {/* Top Header: Route & Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-white group-hover:text-blue-400 transition-colors">
            <span className="truncate max-w-[140px] sm:max-w-[180px]">{listing.origin}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            <span className="truncate max-w-[140px] sm:max-w-[180px]">{listing.destination}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {formatDateTime(listing.departure_date)}
            </span>
            <span>•</span>
            <span>{Math.round(listing.distance_km)} km</span>
          </div>
        </div>
        <StatusBadge status={listing.status} />
      </div>

      {/* Cargo & Truck Spec Badges */}
      <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700/60 px-2.5 py-1 text-slate-300 font-medium">
          <Truck className="h-3 w-3 text-blue-400" />
          {listing.truck_type}
        </span>
        <span className="rounded-lg bg-slate-800 border border-slate-700/60 px-2.5 py-1 text-slate-300 font-medium">
          Cap: {listing.truck_capacity}
        </span>
        <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-emerald-300 font-semibold">
          Space: {listing.available_space}
        </span>
      </div>

      {/* Driver info & Pricing Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/30 text-blue-400 font-bold text-[10px] border border-blue-500/30">
            {listing.driver?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <p className="font-semibold text-slate-200">{listing.driver?.name || 'Verified Driver'}</p>
            {listing.driver?.company_name && (
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {listing.driver.company_name}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-base font-extrabold text-blue-400 font-display">
              ₹{listing.rate_per_km}
            </span>
            <span className="text-[10px] text-slate-400">/ km</span>
          </div>
          {listing.flat_rate != null && (
            <p className="text-[10px] font-medium text-emerald-400">
              or ₹{listing.flat_rate.toLocaleString()} flat
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
