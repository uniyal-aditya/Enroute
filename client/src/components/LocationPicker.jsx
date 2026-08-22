import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import '../utils/mapIcons.js'

function ClickCatcher({ onPick }) {
  useMapEvents({
    click(e) {
      if (e?.latlng) {
        onPick({ lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) })
      }
    },
  })
  return null
}

function CenterUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    const lat = Number(center?.lat)
    const lng = Number(center?.lng)
    if (!isNaN(lat) && !isNaN(lng)) {
      try {
        map.setView([lat, lng], 9)
      } catch (e) {
        console.warn('setView error:', e)
      }
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
  const valLat = Number(value?.lat)
  const valLng = Number(value?.lng)
  const hasValidValue = !isNaN(valLat) && !isNaN(valLng) && value != null

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        {hasValidValue && (
          <span className="text-[10px] text-blue-600 font-mono font-bold">
            {valLat.toFixed(4)}, {valLng.toFixed(4)}
          </span>
        )}
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner">
        <MapContainer
          center={hasValidValue ? [valLat, valLng] : [28.6139, 77.2090]}
          zoom={hasValidValue ? 7 : 5}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO &copy; OpenStreetMap'
          />
          <ClickCatcher onPick={onChange} />
          {hasValidValue && <Marker position={[valLat, valLng]} />}
          {hasValidValue && <CenterUpdater center={{ lat: valLat, lng: valLng }} />}
        </MapContainer>

        <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-white/95 px-2.5 py-1 text-[11px] text-slate-700 backdrop-blur border border-slate-200 shadow-sm z-[400]">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="h-3 w-3 text-blue-600" />
            {hasValidValue ? 'Pin selected' : 'Click on map or select preset below'}
          </span>
        </div>
      </div>

      {/* Quick city presets */}
      <div className="flex flex-wrap gap-1 pt-1">
        {(CITY_PRESETS || []).map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => onChange({ lat: city.lat, lng: city.lng })}
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 shadow-xs transition"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  )
}
