import { useState } from 'react'
import toast from 'react-hot-toast'
import { User, Truck, Save, Phone, Package, ArrowLeftRight } from 'lucide-react'
import { useGuest } from '../context/GuestContext.jsx'
import RoleSwitcher from '../components/RoleSwitcher.jsx'

export default function Profile() {
  const { profile, isDriver, name, updateProfile, switchRole, role } = useGuest()

  const [form, setForm] = useState({
    name:          profile?.name          || '',
    phone:         profile?.phone         || '',
    vehicleNumber: profile?.vehicleNumber || '',
    truckType:     profile?.truckType     || '',
    truckCapacity: profile?.truckCapacity || '',
    pickup:        profile?.pickup        || '',
    destination:   profile?.destination   || '',
    goodsType:     profile?.goodsType     || '',
    weight:        profile?.weight        || '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    updateProfile(form)
    toast.success('Profile updated!')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-2">
      <div className="border-b border-slate-200/80 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Demo Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Profile & Settings</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your {isDriver ? 'driver' : 'shipper'} details. Saved locally for this session.
            </p>
          </div>
          <RoleSwitcher />
        </div>
      </div>

      <div className="card p-6 sm:p-8 space-y-6 shadow-sm border-slate-200/90">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm ${isDriver ? 'bg-blue-600' : 'bg-indigo-600'}`}>
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{name || 'Guest'}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isDriver ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'}`}>
                {isDriver ? '🚛 Driver' : '📦 Parcel Sender'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => switchRole(isDriver ? 'CUSTOMER' : 'DRIVER')}
              className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
            >
              <ArrowLeftRight className="h-3 w-3" />
              Switch to {isDriver ? 'Parcel Mode' : 'Driver Mode'}
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name *</label>
              <input required className="input" value={form.name} onChange={set('name')} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input className="input" value={form.phone} onChange={set('phone')} placeholder="9876543210" />
            </div>
          </div>

          {/* Driver fields */}
          {isDriver && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                Vehicle Details
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Vehicle Number</label>
                  <input className="input text-xs" placeholder="UK-07-TA-4521" value={form.vehicleNumber} onChange={set('vehicleNumber')} />
                </div>
                <div>
                  <label className="label">Truck Type</label>
                  <input className="input text-xs" placeholder="Tata 407" value={form.truckType} onChange={set('truckType')} />
                </div>
                <div>
                  <label className="label">Capacity</label>
                  <input className="input text-xs" placeholder="2.5 Tons" value={form.truckCapacity} onChange={set('truckCapacity')} />
                </div>
              </div>
            </div>
          )}

          {/* Customer fields */}
          {!isDriver && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-600" />
                Shipment Preferences
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Usual Pickup Location</label>
                  <input className="input text-xs" placeholder="e.g. Dehradun" value={form.pickup} onChange={set('pickup')} />
                </div>
                <div>
                  <label className="label">Usual Destination</label>
                  <input className="input text-xs" placeholder="e.g. New Delhi" value={form.destination} onChange={set('destination')} />
                </div>
                <div>
                  <label className="label">What do you usually send?</label>
                  <input className="input text-xs" placeholder="e.g. Textiles" value={form.goodsType} onChange={set('goodsType')} />
                </div>
                <div>
                  <label className="label">Typical Weight</label>
                  <input className="input text-xs" placeholder="e.g. 100 kg" value={form.weight} onChange={set('weight')} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold">
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}
