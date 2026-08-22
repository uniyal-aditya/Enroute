import { Routes, Route, Navigate, Link } from 'react-router-dom'
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
    <div className="card mx-auto my-24 max-w-md p-10 text-center space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 font-display">404</h1>
      <p className="text-xs text-slate-500">
        The logistics page or route you are searching for does not exist.
      </p>
      <Link to="/" className="btn-primary inline-flex text-xs">
        <ArrowLeft className="h-3.5 w-3.5" />
        Return to Home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased">
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
