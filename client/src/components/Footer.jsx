import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, MapPin, Package, Heart, Sparkles } from 'lucide-react'
import { useTranslation } from '../context/LanguageContext.jsx'
import LanguageSelector from './LanguageSelector.jsx'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25">
                <Truck className="h-4 w-4 stroke-[2.2]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Enroute<span className="text-blue-600">.</span>
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                Smart Logistics Platform
              </span>
            </div>

            <p className="max-w-md text-xs text-slate-600 leading-relaxed">
              {t(
                'footer_desc',
                'Enroute connects commercial truck drivers with spare cargo space to businesses & shippers needing fast, affordable courier & freight delivery across India.'
              )}
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Smart India Hackathon 2026</span>
              <span className="text-slate-300">|</span>
              <span className="text-blue-600 font-semibold">Team AAPHAT</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t('footer_quick_links', 'Quick Links')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/routes" className="hover:text-blue-600 transition flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  {t('nav_browse', 'Browse Routes')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600 transition flex items-center gap-1.5 font-medium">
                  <Truck className="h-3.5 w-3.5 text-blue-600" />
                  {t('hero_cta_driver', 'List Your Truck Capacity')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 transition flex items-center gap-1.5 font-medium">
                  <Package className="h-3.5 w-3.5 text-blue-600" />
                  {t('nav_login', 'Sign In / Register')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Language & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Language &amp; Trust
            </h4>
            <div className="space-y-3">
              <LanguageSelector variant="footer" />
              <div className="flex items-start gap-2 text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs leading-snug">
                  Verified driver contact and phone coordination unlocks after confirmed consignment request.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Enroute Logistics. Built for Smart India Hackathon 2026.</p>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span>Designed with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>by Team AAPHAT</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
