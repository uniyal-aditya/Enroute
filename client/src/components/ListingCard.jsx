import { Link } from 'react-router-dom'
import { Calendar, Truck, ArrowRight, Package, MapPin, ShieldCheck } from 'lucide-react'
import { formatDateTime, StatusBadge } from '../utils/format.jsx'

export default function ListingCard({ listing, isSelected = false }) {
  return (
    <Link
      to={`/routes/${listing.id}`}
      className={`group block rounded-2xl border p-5 transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
          : 'border-slate-200/90 bg-white shadow-sm hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header: Route & Status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            <span className="truncate max-w-[130px] sm:max-w-[160px]">{listing.origin}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-blue-500 group-hover:translate-x-1 transition-transform" />
            <span className="truncate max-w-[130px] sm:max-w-[160px]">{listing.destination}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {formatDateTime(listing.departure_date)}
            </span>
            <span>•</span>
            <span className="font-medium text-slate-600">{Math.round(listing.distance_km)} km</span>
          </div>
        </div>
        <StatusBadge status={listing.status} />
      </div>

      {/* Cargo & Truck Badges */}
      <div className="mt-3.5 flex flex-wrap gap-1.5 text-xs">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
          <Truck className="h-3.5 w-3.5 text-blue-600" />
          {listing.truck_type}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
          <Package className="h-3.5 w-3.5 text-emerald-600" />
          Spare: {listing.available_space}
        </span>
      </div>

      {/* Driver info & Pricing Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {listing.driver?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              {listing.driver?.name || 'Verified Driver'}
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
            </p>
            {listing.driver?.company_name && (
              <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                {listing.driver.company_name}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline gap-0.5 justify-end">
            <span className="text-lg font-bold text-slate-900">
              ₹{listing.rate_per_km}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">/km</span>
          </div>
          {listing.flat_rate != null && (
            <p className="text-[11px] font-semibold text-blue-600">
              or ₹{listing.flat_rate.toLocaleString()} flat
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
