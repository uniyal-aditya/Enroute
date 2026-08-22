import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Brand & SIH Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/hero.png"
                alt="Enroute Logo"
                className="h-10 w-auto max-w-[50px] object-contain"
              />
              <span className="text-xl font-display font-extrabold tracking-tight text-slate-900">
                ENROUTE
              </span>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                Move Freight, Not Air
              </span>
            </div>
            <p className="max-w-md text-sm text-slate-600 leading-relaxed">
              Enroute connects cargo senders with trucks already heading their way. Move freight, not air — monetize unused vehicle space, eliminate empty backhauls, and make intercity goods delivery 40–60% more affordable.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-900">Smart India Hackathon 2026</span>
              <span className="text-slate-400">|</span>
              <span>Team AAPHAT · Transportation &amp; Logistics</span>
            </div>
          </div>

          {/* Col 2: Marketplace Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Marketplace
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/routes" className="hover:text-blue-600 transition flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                  Browse Live Routes
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600 transition flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-blue-500" />
                  List Spare Truck Space
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 transition">
                  Driver &amp; Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Trust &amp; Privacy
            </h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs leading-snug">
                  Direct phone &amp; WhatsApp coordination unlocks exclusively after mutual driver confirmation.
                </p>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal pt-1">
                Payment arrangements are handled directly offline between driver and sender upon pickup/delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Enroute Logistics Platform. Built for Smart India Hackathon 2026.</p>
          <div className="flex items-center gap-1 text-slate-600">
            <span>Engineered with passion by</span>
            <span className="font-bold text-slate-900">Team AAPHAT</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
