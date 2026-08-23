import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Truck, Package, User, Mail, Phone, Lock, Building2, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import { getApiError } from '../api/client'
import DemoLoginBanner from '../components/DemoLoginBanner.jsx'

export default function Register() {
  const { user, register, login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const dest = user.role === 'DRIVER' ? '/driver' : '/my-bookings'
      navigate(dest, { replace: true })
    }
  }, [user, navigate])

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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
        role: form.role,
        company_name: form.company_name?.trim() || null,
        vehicle_number: form.vehicle_number?.trim() || null,
        truck_type: form.truck_type?.trim() || null,
        truck_capacity: form.truck_capacity?.trim() || null,
        bio: form.bio?.trim() || null,
      }
      const newUser = await register(payload)
      navigate(newUser?.role === 'DRIVER' ? '/driver' : '/my-bookings', { replace: true })
    } catch (err) {
      toast.error(getApiError(err, 'Registration failed. Please check your inputs.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleFill = async (email, password) => {
    try {
      await login(email, password)
    } catch (err) {
      toast.error('Could not auto-login')
    }
  }

  const ROLES = [
    {
      value: 'CUSTOMER',
      icon: Package,
      title: t('register_role_shipper', 'Ship Goods / Cargo'),
      desc: t('register_role_shipper_desc', 'Book spare capacity on trucks already traveling your route.'),
    },
    {
      value: 'DRIVER',
      icon: Truck,
      title: t('register_role_driver', 'I Have a Truck / Fleet'),
      desc: t('register_role_driver_desc', 'List unused cargo space on scheduled trips and earn extra revenue.'),
    },
  ]

  return (
    <div className="mx-auto mt-4 max-w-lg py-6">
      {/* 1-Click Fast Track Demo Banner */}
      <DemoLoginBanner onFill={handleFill} />

      <div className="card p-6 sm:p-8 space-y-6 shadow-md border-slate-200/90">
        <div className="space-y-1 border-b border-slate-100 pb-4 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-2">
            <Sparkles className="h-5 w-5 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('register_title', 'Create Your Enroute Account')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('register_sub', 'Join thousands of shippers and truck drivers optimizing logistics across India.')}
          </p>
        </div>

        {/* Role Selection */}
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
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/60 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className={`block text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {r.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-500 leading-tight">
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
              {t('register_name', 'Full Name / Contact Person')}
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
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
                {t('login_email', 'Email Address')}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
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
                {t('register_phone', 'Phone / Mobile Number')}
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="phone"
                  required
                  minLength={6}
                  maxLength={20}
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
              {t('login_password', 'Password')} (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
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
            <label className="label">{t('register_company', 'Company / Business Name (Optional)')}</label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                maxLength={150}
                placeholder="e.g. Garhwal Logistics / Verma Handicrafts"
                className="input !pl-10"
                value={form.company_name}
                onChange={set('company_name')}
              />
            </div>
          </div>

          {/* Driver Fleet Details */}
          {form.role === 'DRIVER' && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-blue-600" />
                Fleet Vehicle Specifications (Optional)
              </span>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <input
                  maxLength={50}
                  placeholder="Reg. No. (UK-07-TA)"
                  className="input text-xs bg-white"
                  value={form.vehicle_number}
                  onChange={set('vehicle_number')}
                />
                <input
                  maxLength={100}
                  placeholder="Truck (Tata 407)"
                  className="input text-xs bg-white"
                  value={form.truck_type}
                  onChange={set('truck_type')}
                />
                <input
                  maxLength={50}
                  placeholder="Cap. (2.5 Tons)"
                  className="input text-xs bg-white"
                  value={form.truck_capacity}
                  onChange={set('truck_capacity')}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3 text-xs font-bold"
          >
            <Sparkles className="h-4 w-4" />
            {submitting ? 'Creating Account…' : t('register_btn', 'Complete Registration')}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          {t('register_already_account', 'Already have an account?')}{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            {t('nav_login', 'Sign In')}
          </Link>
        </div>
      </div>
    </div>
  )
}
