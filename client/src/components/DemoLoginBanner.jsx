import { useState } from 'react'
import { Truck, Package, Zap, LogIn, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getApiError } from '../api/client'
import toast from 'react-hot-toast'

// Demo credentials are seeded server-side on every cold start.
// We intentionally do NOT display the raw password strings in the rendered HTML
// so they don't appear as plain text to a casual observer.
const _d = (e, p) => ({ e, p })
const DEMO_ACCOUNTS = {
  driver:   _d('driver@enroute.com',   atob('RHJpdmVyMTIzIQ==')),
  customer: _d('customer@enroute.com', atob('Q3VzdG9tZXIxMjMh')),
}

export default function DemoLoginBanner({ onFill }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null) // 'driver' | 'customer' | null

  const handleOneClick = async (role) => {
    const acct = DEMO_ACCOUNTS[role]
    setLoading(role)
    try {
      const user = await login(acct.e, acct.p)
      const dest = user?.role === 'DRIVER' ? '/driver' : '/my-bookings'
      navigate(dest, { replace: true })
    } catch (err) {
      // If login failed it likely means the demo account doesn't exist yet in
      // production DB — fall back to filling the form so the user can see the
      // error message and we avoid a silent no-op.
      onFill(acct.e, acct.p)
      toast.error(
        getApiError(err, 'Demo login failed. The backend may still be seeding — try again in a moment.')
      )
    } finally {
      setLoading(null)
    }
  }

  const isLoading = loading !== null

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
        Instantly sign in as a pre-seeded demo account with live routes and active booking workflows:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleOneClick('driver')}
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white/90 p-2.5 text-left text-xs transition hover:border-blue-300 hover:bg-white hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
            {loading === 'driver'
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Truck className="h-4 w-4" />}
          </div>
          <div>
            <div className="font-bold text-slate-900">Demo Driver</div>
            <div className="text-[11px] text-slate-500">Rajesh Sharma — Tata 407</div>
          </div>
          {loading !== 'driver' && (
            <LogIn className="h-3.5 w-3.5 text-slate-400 ml-auto shrink-0" />
          )}
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleOneClick('customer')}
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white/90 p-2.5 text-left text-xs transition hover:border-indigo-300 hover:bg-white hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
            {loading === 'customer'
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Package className="h-4 w-4" />}
          </div>
          <div>
            <div className="font-bold text-slate-900">Demo Shipper</div>
            <div className="text-[11px] text-slate-500">Pooja Verma — Verma Textiles</div>
          </div>
          {loading !== 'customer' && (
            <LogIn className="h-3.5 w-3.5 text-slate-400 ml-auto shrink-0" />
          )}
        </button>
      </div>
    </div>
  )
}
