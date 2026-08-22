import { ShieldCheck, Truck, User } from 'lucide-react'

export default function DemoLoginBanner({ onFill }) {
  return (
    <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-indigo-950/60 p-4 shadow-lg backdrop-blur mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
          SIH 2026 Judge &amp; Demo Mode
        </span>
      </div>
      <p className="text-xs text-slate-300 mb-3">
        Click below to auto-fill sample accounts with live seeded routes and active booking workflows:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFill('driver@enroute.com', 'Driver123!')}
          className="flex items-center gap-2.5 rounded-xl border border-blue-500/30 bg-blue-600/20 px-3 py-2 text-left text-xs font-medium text-blue-200 transition hover:bg-blue-600/30 hover:border-blue-400 active:scale-[0.98]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/50 text-blue-300">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-white">Demo Driver</div>
            <div className="text-[10px] text-slate-400">Rajesh Sharma (Tata 407)</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onFill('customer@enroute.com', 'Customer123!')}
          className="flex items-center gap-2.5 rounded-xl border border-indigo-500/30 bg-indigo-600/20 px-3 py-2 text-left text-xs font-medium text-indigo-200 transition hover:bg-indigo-600/30 hover:border-indigo-400 active:scale-[0.98]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/50 text-indigo-300">
            <User className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-white">Demo Customer</div>
            <div className="text-[10px] text-slate-400">Pooja Verma (Textile Shipper)</div>
          </div>
        </button>
      </div>
    </div>
  )
}
