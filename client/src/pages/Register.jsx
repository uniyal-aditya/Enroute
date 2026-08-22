import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Truck, Package, User, Mail, Phone, Lock, Building, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getApiError } from '../api/client'

const ROLES = [
  {
    value: 'CUSTOMER',
    icon: Package,
    title: 'I Need to Ship Goods',
    desc: 'Book spare space on trucks already making the journey',
  },
  {
    value: 'DRIVER',
    icon: Truck,
    title: 'I Have a Truck / Fleet',
    desc: 'List your route and monetize unused cargo capacity',
  },
]

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
    company_name: '',
    vehicle_number: '',
    truck_type: '',
    truck_capacity: '',
    bio: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await register(form)
      await login(form.email, form.password)
      navigate(form.role === 'DRIVER' ? '/driver' : '/routes')
    } catch (err) {
      toast.error(getApiError(err, 'Registration failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-6 max-w-lg py-6">
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white">Join Enroute</h1>
          <p className="text-xs text-slate-400">
            Create an account to start shipping freight or publishing truck routes.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="space-y-1.5">
          <label className="label">Select Account Type</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ROLES.map((r) => {
              const Icon = r.icon
              const isSelected = form.role === r.value
              return (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`rounded-2xl border p-4 text-left transition duration-150 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600/15 ring-2 ring-blue-500/20'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mb-2 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}
                  />
                  <span className="block text-xs font-bold text-white">{r.title}</span>
                  <span className="mt-1 block text-[11px] text-slate-400 leading-tight">
                    {r.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Full Name / Contact Person
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                id="name"
                required
                maxLength={100}
                placeholder="e.g. Rajesh Sharma"
                className="input !pl-10"
                value={form.name}
                onChange={set('name')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input !pl-10"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="phone">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  id="phone"
                  required
                  minLength={6}
                  maxLength={15}
                  placeholder="10-digit mobile"
                  className="input !pl-10"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="input !pl-10"
                value={form.password}
                onChange={set('password')}
              />
            </div>
          </div>

          <div>
            <label className="label">Company / Business Name (Optional)</label>
            <div className="relative">
              <Building className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                maxLength={100}
                placeholder="e.g. Garhwal Logistics / Verma Handicrafts"
                className="input !pl-10"
                value={form.company_name}
                onChange={set('company_name')}
              />
            </div>
          </div>

          {/* Driver specific dynamic fleet fields */}
          {form.role === 'DRIVER' && (
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Vehicle Details (Optional)
              </span>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <input
                    maxLength={30}
                    placeholder="Reg. No. (e.g. UK-07-TA)"
                    className="input text-xs"
                    value={form.vehicle_number}
                    onChange={set('vehicle_number')}
                  />
                </div>
                <div>
                  <input
                    maxLength={50}
                    placeholder="Truck (e.g. Tata 407)"
                    className="input text-xs"
                    value={form.truck_type}
                    onChange={set('truck_type')}
                  />
                </div>
                <div>
                  <input
                    maxLength={50}
                    placeholder="Capacity (e.g. 2.5T)"
                    className="input text-xs"
                    value={form.truck_capacity}
                    onChange={set('truck_capacity')}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full !py-3 text-xs font-bold"
          >
            {submitting ? 'Creating Account…' : 'Complete Registration'}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
