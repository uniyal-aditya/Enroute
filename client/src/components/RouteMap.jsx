import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import '../utils/mapIcons.js'

// Custom bounds adjuster
function MapBoundsAdjuster({ origin, destination }) {
  const map = useMap()
  useEffect(() => {
    const oLat = Number(origin?.lat)
    const oLng = Number(origin?.lng)
    const dLat = Number(destination?.lat)
    const dLng = Number(destination?.lng)
    if (!isNaN(oLat) && !isNaN(oLng) && !isNaN(dLat) && !isNaN(dLng)) {
      try {
        const bounds = L.latLngBounds([oLat, oLng], [dLat, dLng])
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 })
      } catch (e) {
        console.warn('Leaflet fitBounds error:', e)
      }
    }
  }, [map, origin, destination])
  return null
}

export default function RouteMap({
  origin,
  destination,
  originLabel,
  destinationLabel,
  className = 'h-72',
  interactive = true,
}) {
  const oLat = Number(origin?.lat)
  const oLng = Number(origin?.lng)
  const dLat = Number(destination?.lat)
  const dLng = Number(destination?.lng)

  if (isNaN(oLat) || isNaN(oLng) || isNaN(dLat) || isNaN(dLng)) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-xs ${className}`}>
        Coordinates unavailable for map visualization
      </div>
    )
  }

  const center = [(oLat + dLat) / 2, (oLng + dLng) / 2]

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-xs ${className}`}>
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Animated route polyline */}
        <Polyline
          positions={[
            [oLat, oLng],
            [dLat, dLng],
          ]}
          pathOptions={{
            color: '#2563eb',
            weight: 4,
            dashArray: '8 8',
            opacity: 0.9,
          }}
        />

        <Marker position={[oLat, oLng]}>
          <Popup>
            <div className="font-sans">
              <span className="text-[10px] font-bold uppercase text-emerald-600">Departure</span>
              <p className="font-bold text-slate-900 text-xs">{originLabel || 'Origin'}</p>
            </div>
          </Popup>
        </Marker>

        <Marker position={[dLat, dLng]}>
          <Popup>
            <div className="font-sans">
              <span className="text-[10px] font-bold uppercase text-blue-600">Destination</span>
              <p className="font-bold text-slate-900 text-xs">{destinationLabel || 'Destination'}</p>
            </div>
          </Popup>
        </Marker>

        <MapBoundsAdjuster origin={{ lat: oLat, lng: oLng }} destination={{ lat: dLat, lng: dLng }} />
      </MapContainer>
    </div>
  )
}
