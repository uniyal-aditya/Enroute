import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogIn, ArrowRight, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getApiError } from '../api/client'
import DemoLoginBanner from '../components/DemoLoginBanner.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const user = await login(form.email, form.password)
      const destination =
        location.state?.from?.pathname || (user.role === 'DRIVER' ? '/driver' : '/routes')
      navigate(destination)
    } catch (err) {
      toast.error(getApiError(err, 'Login failed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemoFill = (email, password) => {
    setForm({ email, password })
    toast('Demo credentials populated!', { icon: '🔑' })
  }

  return (
    <div className="mx-auto mt-6 max-w-md py-6">
      {/* Quick Demo Filler Banner for SIH 2026 Judges */}
      <DemoLoginBanner onFill={handleDemoFill} />

      <div className="card p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">
            Sign in to access your Enroute shipments and route listings.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email Address
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
            <div className="flex items-center justify-between">
              <label className="label" htmlFor="password">
                Password
              </label>
            </div>
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
            className="btn-primary w-full !py-3 text-xs font-bold"
          >
            <LogIn className="h-4 w-4" />
            {submitting ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
