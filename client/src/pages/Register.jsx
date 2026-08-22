import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { getApiError } from '../api/client'

const ROLES = [
  {
    value: 'CUSTOMER',
    title: 'I need to ship something',
    desc: 'Book space on trucks already making the trip',
  },
  {
    value: 'DRIVER',
    title: 'I have a truck',
    desc: 'List your route and fill your spare capacity',
  },
]

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
  })
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await register(form)
      await login(form.email, form.password)
      toast.success('Account created!')
      navigate(form.role === 'DRIVER' ? '/driver' : '/')
    } catch (err) {
      toast.error(getApiError(err, 'Registration failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <div className="card p-6">
        <h1 className="text-xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">Join Enroute as a driver or customer.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setForm({ ...form, role: r.value })}
                className={`rounded-xl border p-3 text-left transition ${
                  form.role === r.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="block text-sm font-bold">{r.title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{r.desc}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              required
              maxLength={100}
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                required
                minLength={6}
                maxLength={15}
                placeholder="10-digit mobile"
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password (min 6 chars)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
