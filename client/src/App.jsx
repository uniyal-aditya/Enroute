import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import BrowseRoutes from './pages/BrowseRoutes.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DriverDashboard from './pages/DriverDashboard.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Profile from './pages/Profile.jsx'
import { AlertCircle, ArrowLeft } from 'lucide-react'

function NotFound() {
  return (
    <div className="card mx-auto my-20 max-w-md p-8 text-center space-y-4 shadow-md border-slate-200">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">404</h1>
      <p className="text-sm text-slate-600">
        The logistics corridor or page you are searching for does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link to="/" className="btn-primary inline-flex text-xs font-semibold">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Subtle modern background decorative gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-blue-100/50 via-indigo-50/40 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[600px] -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-50/40 via-blue-50/30 to-transparent blur-3xl opacity-70" />
      </div>

      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<BrowseRoutes />} />
          <Route path="/routes/:id" element={<ListingDetail />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Protected Routes */}
          <Route element={<ProtectedRoute role="CUSTOMER" />}>
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Route>

          {/* Driver Protected Routes */}
          <Route element={<ProtectedRoute role="DRIVER" />}>
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/driver/*" element={<DriverDashboard />} />
          </Route>

          {/* Common Protected Profile Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
