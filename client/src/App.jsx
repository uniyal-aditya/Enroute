import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DriverDashboard from './pages/DriverDashboard.jsx'
import MyBookings from './pages/MyBookings.jsx'

function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-500">Page not found.</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute role="DRIVER" />}>
            <Route path="/driver" element={<DriverDashboard />} />
          </Route>
          <Route element={<ProtectedRoute role="CUSTOMER" />}>
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Enroute — connecting spare truck capacity with people who need it
      </footer>
    </div>
  )
}
