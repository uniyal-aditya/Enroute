import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import '../utils/mapIcons.js'

function ClickCatcher({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) })
    },
  })
  return null
}

export default function LocationPicker({ label, value, onChange }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="z-0 h-44 overflow-hidden rounded-lg border border-slate-300">
        <MapContainer center={[20.5937, 78.9629]} zoom={4} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ClickCatcher onPick={onChange} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {value
          ? `Picked: ${value.lat}, ${value.lng}`
          : 'Click anywhere on the map to set this point'}
      </p>
    </div>
  )
}
