import { ShieldCheck, Truck, User } from 'lucide-react'

export default function DemoLoginBanner({ onFill }) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm backdrop-blur mb-6">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
          SIH 2026 Judge &amp; Demo Mode
        </span>
      </div>
      <p className="text-xs text-slate-600 mb-3">
        Click below to auto-fill sample accounts with live seeded routes and active booking workflows:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFill('driver@enroute.com', 'Driver123!')}
          className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-800 transition hover:bg-blue-50/80 hover:border-blue-300 active:scale-[0.98] shadow-xs"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Demo Driver</div>
            <div className="text-[10px] text-slate-500">Rajesh Sharma (Tata 407)</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onFill('customer@enroute.com', 'Customer123!')}
          className="flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-800 transition hover:bg-indigo-50/80 hover:border-indigo-300 active:scale-[0.98] shadow-xs"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <User className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Demo Customer</div>
            <div className="text-[10px] text-slate-500">Pooja Verma (Textile Shipper)</div>
          </div>
        </button>
      </div>
    </div>
  )
}
