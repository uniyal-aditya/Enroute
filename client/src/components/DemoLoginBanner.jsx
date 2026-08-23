import { Truck, Package, Zap } from 'lucide-react'

export default function DemoLoginBanner({ onFill }) {
  return (
    <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-amber-50/80 to-orange-50/60 p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
          1-Click Demo Fast-Track (SIH 2026)
        </span>
      </div>
      <p className="text-xs text-amber-800/90 mb-3">
        Click below to auto-fill sample accounts with live seeded routes and active booking workflows:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onFill('driver@enroute.com', 'Driver123!')}
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white/90 p-2.5 text-left text-xs transition hover:border-blue-300 hover:bg-white hover:shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Demo Driver</div>
            <div className="text-[11px] text-slate-500">Rajesh Sharma (Tata 407)</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onFill('customer@enroute.com', 'Customer123!')}
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white/90 p-2.5 text-left text-xs transition hover:border-indigo-300 hover:bg-white hover:shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Demo Shipper</div>
            <div className="text-[11px] text-slate-500">Pooja Verma (Verma Textiles)</div>
          </div>
        </button>
      </div>
    </div>
  )
}
