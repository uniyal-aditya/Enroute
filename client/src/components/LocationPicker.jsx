import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import '../utils/mapIcons.js'

function ClickCatcher({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) })
    },
  })
  return null
}

function CenterUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center?.lat) {
      map.setView([center.lat, center.lng], 9)
    }
  }, [center, map])
  return null
}

const CITY_PRESETS = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Haridwar', lat: 29.9457, lng: 78.1642 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Rishikesh', lat: 30.0869, lng: 78.2676 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
]

export default function LocationPicker({ label, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        {value && (
          <span className="text-[10px] text-blue-400 font-mono">
            {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
          </span>
        )}
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 shadow-inner">
        <MapContainer center={value ? [value.lat, value.lng] : [28.6139, 77.2090]} zoom={value ? 7 : 5} className="h-full w-full z-0">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO &copy; OpenStreetMap'
          />
          <ClickCatcher onPick={onChange} />
          {value && <Marker position={[value.lat, value.lng]} />}
          {value && <CenterUpdater center={value} />}
        </MapContainer>

        <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-slate-900/90 px-2.5 py-1 text-[11px] text-slate-300 backdrop-blur border border-slate-700/60 z-[400]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-blue-400" />
            {value ? 'Pin selected' : 'Click on map or select preset below'}
          </span>
        </div>
      </div>

      {/* Quick city presets */}
      <div className="flex flex-wrap gap-1 pt-1">
        {CITY_PRESETS.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => onChange({ lat: city.lat, lng: city.lng })}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 hover:border-blue-500/40 hover:text-blue-300 transition"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  )
}
