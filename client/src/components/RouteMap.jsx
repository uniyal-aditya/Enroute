import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import '../utils/mapIcons.js'

export default function RouteMap({ origin, destination, className = 'h-64' }) {
  if (!origin?.lat || !destination?.lat) return null

  const center = [(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2]

  return (
    <div className={`z-0 overflow-hidden rounded-xl border border-slate-200 ${className}`}>
      <MapContainer center={center} zoom={5} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline
          positions={[
            [origin.lat, origin.lng],
            [destination.lat, destination.lng],
          ]}
          pathOptions={{ color: '#2563eb', weight: 3, dashArray: '6 8' }}
        />
        <Marker position={[origin.lat, origin.lng]} />
        <Marker position={[destination.lat, destination.lng]} />
      </MapContainer>
    </div>
  )
}
