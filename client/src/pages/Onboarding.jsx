import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Package, ArrowRight, MapPin, Phone, ChevronRight, Zap } from 'lucide-react'
import { useGuest } from '../context/GuestContext.jsx'

const TRUCK_TYPES = [
  'Tata 407 (Medium)',
  'Eicher Pro (Closed Container)',
  'Mahindra Bolero Maxi',
  'Tata Ace (Mini)',
  'Ashok Leyland (Heavy)',
  'Other',
]

const GOODS_TYPES = [
  'Electronics / Fragile Goods',
  'Textiles & Garments',
  'Agricultural Produce',
  'FMCG / Packaged Goods',
  'Furniture / Heavy Items',
  'Industrial Equipment',
  'Medical Supplies',
  'Other',
]

export default function Onboarding() {
  const { setProfile } = useGuest()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1 = role pick, 2 = details
  const [role, setRole] = useState(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    // Driver fields
    vehicleNumber: '',
    truckType: '',
    truckCapacity: '',
    // Customer fields
    pickup: '',
    destination: '',
    goodsType: '',
    weight: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleRoleSelect = (r) => {
    setRole(r)
    setStep(2)
  }

  const handleContinue = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setProfile({ ...form, role })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-4">
            <Zap className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
            Smart India Hackathon 2026 · Team AAPHAT
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30">
              <Truck className="h-6 w-6 text-white stroke-[2.2]" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              Enroute<span className="text-blue-400">.</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            {step === 1 ? "Let's get you started" : `Welcome, tell us more`}
          </h1>
          <p className="text-sm text-blue-200/70 mt-1.5">
            {step === 1
              ? 'Tell us how you\'re using Enroute today.'
              : role === 'DRIVER'
              ? 'Set up your driver profile to post trips and earn from spare capacity.'
              : 'Set up your shipper profile to find trucks on your route.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'w-8 bg-blue-400' : 'w-2 bg-white/20'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'w-8 bg-blue-400' : 'w-2 bg-white/20'}`} />
        </div>

        {/* STEP 1 — Role Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleRoleSelect('DRIVER')}
              className="group relative flex flex-col items-start gap-4 rounded-3xl border border-blue-400/20 bg-white/5 p-6 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-400/60 hover:bg-blue-500/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.99]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30 group-hover:bg-blue-500/30 transition-colors">
                <Truck className="h-7 w-7 stroke-[1.8]" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">I have a truck</div>
                <div className="text-xs font-semibold text-blue-300 mt-0.5">Transport Capacity</div>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  I'm a driver or transporter with available space on an existing trip.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:gap-2.5 transition-all">
                Post trips & manage requests
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('CUSTOMER')}
              className="group relative flex flex-col items-start gap-4 rounded-3xl border border-indigo-400/20 bg-white/5 p-6 text-left backdrop-blur-sm transition-all duration-200 hover:border-indigo-400/60 hover:bg-indigo-500/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-[0.99]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30 group-hover:bg-indigo-500/30 transition-colors">
                <Package className="h-7 w-7 stroke-[1.8]" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">I need to send a parcel</div>
                <div className="text-xs font-semibold text-indigo-300 mt-0.5">Parcel Sender</div>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  I want to send goods using a truck already travelling my route.
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:gap-2.5 transition-all">
                Find routes & book space
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        )}

        {/* STEP 2 — Details form */}
        {step === 2 && (
          <form
            onSubmit={handleContinue}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm space-y-5"
          >
            {/* Role badge */}
            <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold ${
              role === 'DRIVER'
                ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30'
                : 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30'
            }`}>
              {role === 'DRIVER' ? <Truck className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
              {role === 'DRIVER' ? '🚛 Driver / Transporter' : '📦 Parcel Sender'}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="ml-1 text-white/40 hover:text-white/70 text-[10px] underline"
              >
                change
              </button>
            </div>

            {/* Common fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Your Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Aditya Uniyal"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                  <input
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-white/10 bg-white/10 pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* DRIVER fields */}
            {role === 'DRIVER' && (
              <div className="space-y-4 rounded-2xl border border-blue-400/15 bg-blue-500/5 p-4">
                <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" /> Vehicle Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">Vehicle Number</label>
                    <input
                      value={form.vehicleNumber}
                      onChange={set('vehicleNumber')}
                      placeholder="UK-07-TA-4521"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-400/60 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">Truck Type</label>
                    <select
                      value={form.truckType}
                      onChange={set('truckType')}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-400/60 transition"
                    >
                      <option value="">Select type</option>
                      {TRUCK_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">Capacity</label>
                    <input
                      value={form.truckCapacity}
                      onChange={set('truckCapacity')}
                      placeholder="e.g. 2.5 Tons"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-blue-400/60 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMER fields */}
            {role === 'CUSTOMER' && (
              <div className="space-y-4 rounded-2xl border border-indigo-400/15 bg-indigo-500/5 p-4">
                <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Shipment Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">
                      <MapPin className="inline h-3 w-3 mr-0.5" />Pickup Location
                    </label>
                    <input
                      value={form.pickup}
                      onChange={set('pickup')}
                      placeholder="e.g. Dehradun"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-indigo-400/60 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">
                      <MapPin className="inline h-3 w-3 mr-0.5" />Destination
                    </label>
                    <input
                      value={form.destination}
                      onChange={set('destination')}
                      placeholder="e.g. New Delhi"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-indigo-400/60 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">What are you sending?</label>
                    <select
                      value={form.goodsType}
                      onChange={set('goodsType')}
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-400/60 transition"
                    >
                      <option value="">Select goods type</option>
                      {GOODS_TYPES.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1.5">Approx. Weight</label>
                    <input
                      value={form.weight}
                      onChange={set('weight')}
                      placeholder="e.g. 200 kg"
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-indigo-400/60 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] ${
                role === 'DRIVER'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/30 hover:shadow-blue-500/40'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-indigo-500/30 hover:shadow-indigo-500/40'
              }`}
            >
              Continue to Enroute
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-[11px] text-white/30">
              No account needed · Switch between driver & shipper anytime
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
