import { useState, useRef, useEffect } from 'react'
import { Truck, Package, ArrowLeftRight, ChevronDown, Check } from 'lucide-react'
import { useGuest } from '../context/GuestContext.jsx'

export default function RoleSwitcher() {
  const { role, switchRole, name } = useGuest()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isDriver = role === 'DRIVER'
  const targetRole = isDriver ? 'CUSTOMER' : 'DRIVER'

  const handleSwitch = (newRole) => {
    switchRole(newRole)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all hover:scale-[1.02] ${
          isDriver
            ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
            : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
        }`}
        title="Switch between Driver and Parcel Sender mode"
      >
        {isDriver ? (
          <Truck className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <Package className="h-3.5 w-3.5 shrink-0" />
        )}
        <span className="hidden sm:inline">{isDriver ? 'Driver Mode' : 'Parcel Mode'}</span>
        <ChevronDown className={`h-3 w-3 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Viewing as
          </div>

          {/* Driver option */}
          <button
            type="button"
            onClick={() => handleSwitch('DRIVER')}
            className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50 ${
              isDriver ? 'bg-blue-50/80' : ''
            }`}
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Truck className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">🚛 Driver</span>
                {isDriver && <Check className="h-3 w-3 text-blue-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Post trips and manage delivery requests</p>
            </div>
          </button>

          {/* Customer option */}
          <button
            type="button"
            onClick={() => handleSwitch('CUSTOMER')}
            className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-indigo-50 ${
              !isDriver ? 'bg-indigo-50/80' : ''
            }`}
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">📦 Parcel Sender</span>
                {!isDriver && <Check className="h-3 w-3 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Find routes and send delivery requests</p>
            </div>
          </button>

          <div className="border-t border-slate-100 mx-2 mt-1 pt-2 pb-1 px-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ArrowLeftRight className="h-3 w-3" />
              Switch anytime · No login required
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
