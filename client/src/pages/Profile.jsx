import { useState } from 'react'
import toast from 'react-hot-toast'
import { User, Truck, ShieldCheck, Save, Mail, Phone, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getApiError } from '../api/client'

export default function Profile() {
  const { user, updateProfile, isDriver } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    vehicle_number: user?.vehicle_number || '',
    truck_type: user?.truck_type || '',
    truck_capacity: user?.truck_capacity || '',
    company_name: user?.company_name || '',
    bio: user?.bio || '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateProfile(form)
    } catch (err) {
      toast.error(getApiError(err, 'Failed to update profile'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-2">
      <div className="border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Account Management
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Account Profile &amp; Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your verified {isDriver ? 'Fleet Driver' : 'Shipper'} details and contact information.
        </p>
      </div>

      <div className="card p-6 sm:p-8 space-y-6 shadow-sm border-slate-200/90">
        {/* Top Header Card */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                {user?.role === 'DRIVER' ? 'Fleet Driver' : 'Shipper'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <input
                required
                maxLength={100}
                className="input"
                value={form.name}
                onChange={set('name')}
              />
            </div>
            <div>
              <label className="label">Primary Phone Number</label>
              <input
                required
                minLength={6}
                maxLength={20}
                className="input"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
          </div>

          <div>
            <label className="label">Company / Business Name (Optional)</label>
            <input
              maxLength={150}
              className="input"
              placeholder="e.g. Verma Handicrafts / Garhwal Freight"
              value={form.company_name}
              onChange={set('company_name')}
            />
          </div>

          {/* Driver Fleet Details */}
          {isDriver && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                Fleet Vehicle Specifications
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Vehicle Reg. No.</label>
                  <input
                    maxLength={50}
                    className="input bg-white text-xs"
                    placeholder="e.g. UK-07-TA-4521"
                    value={form.vehicle_number}
                    onChange={set('vehicle_number')}
                  />
                </div>
                <div>
                  <label className="label">Truck Type</label>
                  <input
                    maxLength={100}
                    className="input bg-white text-xs"
                    placeholder="e.g. Tata 407"
                    value={form.truck_type}
                    onChange={set('truck_type')}
                  />
                </div>
                <div>
                  <label className="label">Rated Payload</label>
                  <input
                    maxLength={50}
                    className="input bg-white text-xs"
                    placeholder="e.g. 2.5 Tons"
                    value={form.truck_capacity}
                    onChange={set('truck_capacity')}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="label">Bio / Operational Overview (Optional)</label>
            <textarea
              rows={3}
              maxLength={2000}
              className="input"
              placeholder="Tell senders or transporters about your regular transit corridors, reliability, or business background."
              value={form.bio}
              onChange={set('bio')}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 text-xs font-bold"
            >
              <Save className="h-4 w-4" />
              {submitting ? 'Saving Changes…' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
