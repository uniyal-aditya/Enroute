import { useState } from 'react'
import toast from 'react-hot-toast'
import { User, Truck, ShieldCheck, Save, Mail, Phone, Building } from 'lucide-react'
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
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Account Profile &amp; Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Manage your verified {isDriver ? 'Driver' : 'Customer'} logistics profile and contact details.
        </p>
      </div>

      <div className="card p-6 sm:p-8 space-y-6">
        {/* Top Header Card */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white shadow-xl shadow-blue-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <span className="badge bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
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
                maxLength={15}
                className="input"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
          </div>

          <div>
            <label className="label">Company / Business Name (Optional)</label>
            <input
              maxLength={100}
              className="input"
              placeholder="e.g. Garhwal Freight Logistics or Verma Textiles"
              value={form.company_name}
              onChange={set('company_name')}
            />
          </div>

          {/* Driver specific vehicle details */}
          {isDriver && (
            <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Truck className="h-4 w-4" />
                Vehicle &amp; Truck Fleet Details
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">Vehicle Reg. No.</label>
                  <input
                    maxLength={30}
                    className="input"
                    placeholder="e.g. UK-07-TA-4521"
                    value={form.vehicle_number}
                    onChange={set('vehicle_number')}
                  />
                </div>
                <div>
                  <label className="label">Truck Model / Type</label>
                  <input
                    maxLength={50}
                    className="input"
                    placeholder="e.g. Tata 407"
                    value={form.truck_type}
                    onChange={set('truck_type')}
                  />
                </div>
                <div>
                  <label className="label">Max Payload Capacity</label>
                  <input
                    maxLength={50}
                    className="input"
                    placeholder="e.g. 2.5 Tons"
                    value={form.truck_capacity}
                    onChange={set('truck_capacity')}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="label">About / Bio / Operating Corridors</label>
            <textarea
              rows={3}
              maxLength={1000}
              className="input"
              placeholder="e.g. Regular regional freight runner across Uttarakhand, Delhi NCR, and UP highways."
              value={form.bio}
              onChange={set('bio')}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary !py-2.5 px-6 text-xs font-bold inline-flex"
          >
            <Save className="h-4 w-4" />
            {submitting ? 'Saving Changes…' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
