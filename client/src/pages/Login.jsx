import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogIn, Lock, Mail, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import { getApiError } from '../api/client'
import DemoLoginBanner from '../components/DemoLoginBanner.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const destination =
        location.state?.from?.pathname || (user.role === 'DRIVER' ? '/driver' : '/my-bookings')
      navigate(destination, { replace: true })
    }
  }, [user, navigate, location])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const loggedUser = await login(form.email.trim(), form.password)
      const destination =
        location.state?.from?.pathname || (loggedUser?.role === 'DRIVER' ? '/driver' : '/my-bookings')
      navigate(destination, { replace: true })
    } catch (err) {
      toast.error(getApiError(err, 'Login failed. Please check your email and password.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleFill = (email, password) => {
    setForm({ email, password })
  }

  return (
    <div className="mx-auto mt-4 max-w-md py-6">
      {/* 1-Click Fast Track Demo Banner */}
      <DemoLoginBanner onFill={handleFill} />

      <div className="card p-6 sm:p-8 space-y-6 shadow-md border-slate-200/90">
        <div className="space-y-1 border-b border-slate-100 pb-4 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-2">
            <LogIn className="h-5 w-5 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('login_welcome', 'Welcome Back to Enroute')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('login_sub', 'Sign in to access your freight bookings and route listings.')}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="password">
              {t('login_password', 'Password')}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input !pl-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3 text-xs font-bold"
          >
            <LogIn className="h-4 w-4" />
            {submitting ? 'Authenticating…' : t('login_btn', 'Sign In')}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          {t('login_no_account', "Don't have an account?")}{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            {t('login_register_link', 'Create an account')}
          </Link>
        </div>
      </div>
    </div>
  )
}
