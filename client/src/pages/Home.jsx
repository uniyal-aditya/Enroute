import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api, { getApiError } from '../api/client'
import ListingCard from '../components/ListingCard.jsx'

const EMPTY_FILTERS = { origin: '', destination: '', truck_type: '' }

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v.trim() !== '')
    )
    api
      .get('/routes/', { params })
      .then((res) => {
        if (!cancelled) setListings(res.data)
      })
      .catch((err) => toast.error(getApiError(err, 'Could not load listings')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [filters])

  return (
    <div>
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="grid grid-cols-1 items-center gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div className="text-white">
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Trucks are already going your way.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100 sm:text-base">
              Enroute connects drivers with spare cargo capacity to people who need affordable
              courier &amp; transport services. Search live routes below.
            </p>
          </div>
          <img
            src="/hero.png"
            alt="Enroute"
            className="mx-auto h-36 w-36 rounded-2xl bg-white/10 object-contain p-2 ring-1 ring-white/20 sm:h-44 sm:w-44"
          />
        </div>
      </section>

      <section className="card mt-6 grid grid-cols-1 gap-3 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <input
          className="input"
          placeholder="From (e.g. Delhi)"
          value={filters.origin}
          onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
        />
        <input
          className="input"
          placeholder="To (e.g. Mumbai)"
          value={filters.destination}
          onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
        />
        <input
          className="input"
          placeholder="Truck type (e.g. Tata 407)"
          value={filters.truck_type}
          onChange={(e) => setFilters({ ...filters, truck_type: e.target.value })}
        />
        <button
          type="button"
          className="btn-outline h-fit self-center"
          onClick={() => setFilters(EMPTY_FILTERS)}
        >
          Clear
        </button>
      </section>

      <section className="mt-6">
        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading routes…</div>
        ) : listings.length === 0 ? (
          <div className="card py-16 text-center">
            <p className="font-semibold text-slate-700">No active routes found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try clearing filters — or check back soon, drivers post new trips daily.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
