import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Volume2, 
  VolumeX, 
  Radio, 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Music, 
  Flame, 
  Disc, 
  Shuffle, 
  Clock, 
  Headphones, 
  Compass,
  ExternalLink
} from 'lucide-react'

const TRUCK_QUOTES = [
  'माँ का आशीर्वाद है, यूँ ही चलते रहेंगे।',
  'बुरी नज़र वाले, तेरा मुँह काला 🌶️',
  'हंस मत पगली, प्यार हो जाएगा!',
  'सफर खूबसूरत है मंज़िल से भी।',
  'दम है तो क्रॉस कर, वरना बर्दाश्त कर!',
  'समय से पहले और भाग्य से ज्यादा कभी नहीं मिलता।',
  'रुकना मना है — एनरूट एक्सप्रेस!',
  'मालिक की गाड़ी, ड्राइवर का पसीना, चलती है सड़क पर बनके हसीना!',
]

// Web Audio API authentic multi-tone Indian Truck Horn synthesizer
function playTruckHornSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)

      gain.gain.setValueAtTime(0.01, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + start + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }

    // Classic 3-note Indian highway pneumatic horn melody (D - F# - A - High D fanfare)
    playTone(293.66, 0.0, 0.18) // D4
    playTone(369.99, 0.15, 0.18) // F#4
    playTone(440.00, 0.30, 0.22) // A4
    playTone(587.33, 0.50, 0.45) // D5 prolonged blast
    playTone(440.00, 0.50, 0.45) // Harmony note
  } catch (e) {
    console.warn('AudioContext horn error:', e)
  }
}

export default function HornOkRadio() {
  const [timeStr, setTimeStr] = useState('')
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [hornActive, setHornActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [highwayDrivers, setHighwayDrivers] = useState(760 + Math.floor(Math.random() * 80))
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(true)

  // Clock timer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Rotating shayari
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % TRUCK_QUOTES.length)
    }, 6500)
    return () => clearInterval(quoteTimer)
  }, [])

  // Slight natural oscillation of online highway drivers
  useEffect(() => {
    const driverTimer = setInterval(() => {
      setHighwayDrivers((prev) => Math.max(650, prev + (Math.random() > 0.5 ? 2 : -2)))
    }, 8000)
    return () => clearInterval(driverTimer)
  }, [])

  const handleHorn = () => {
    setHornActive(true)
    playTruckHornSound()
    setTimeout(() => setHornActive(false), 1000)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const playlistId = '6E2HGQUgPacSv4APUlmD1d'
  const spotifyEmbedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`

  return (
    <div className="relative -mx-4 -my-6 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      {/* Background Image with Cinematic Twilight Mist */}
      <div className="absolute inset-0 z-0">
        <img
          src="/horn_ok_truck.jpg"
          alt="Enroute Truck Highway"
          className="h-full w-full object-cover object-center opacity-70 scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
        <div className="absolute inset-0 bg-orange-950/20 mix-blend-color-dodge pointer-events-none" />
      </div>

      {/* 1. TOP AMBIENT BAR */}
      <header className="relative z-20 flex items-center justify-between p-4 sm:p-6 backdrop-blur-xs">
        {/* Left: Back to Driver Command & Live Time */}
        <div className="flex items-center gap-4">
          <Link
            to="/driver"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/20 hover:border-white/40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Driver Dashboard</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-white/80">
            <Clock className="h-3.5 w-3.5 text-orange-400" />
            <span>{timeStr || '11:47 PM'}</span>
          </div>
        </div>

        {/* Center: Live Drivers on Highway Pill */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/50">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{highwayDrivers} on the highway</span>
        </div>

        {/* Right: Fullscreen & Sound toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition hover:bg-white/20"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* 2. CENTER IMMERSIVE STAGE */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center px-4 text-center space-y-6">
        {/* Subtle sub-badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-950/50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange-300 shadow-md">
          <Radio className="h-3.5 w-3.5 animate-pulse text-orange-400" />
          Highway Dhaba Radio · एनरूट ट्रक संगीत
        </div>

        {/* Giant Iconic Devanagari Title */}
        <div className="space-y-1">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-orange-200 drop-shadow-[0_10px_35px_rgba(251,146,60,0.3)] font-display">
            ट्रक वाला
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/70">
            The Ultimate Indian Highway Roadtrip Playlist
          </p>
        </div>

        {/* Interactive Horn Button */}
        <div className="pt-2">
          <button
            onClick={handleHorn}
            className={`group relative inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-sm font-bold transition duration-200 shadow-xl active:scale-95 ${
              hornActive
                ? 'border-yellow-400 bg-yellow-400 text-black ring-4 ring-yellow-400/40 scale-105'
                : 'border-white/30 bg-black/60 text-white backdrop-blur-md hover:border-yellow-400/80 hover:bg-black/80 hover:text-yellow-300'
            }`}
          >
            <Volume2 className={`h-4 w-4 text-yellow-400 ${hornActive ? 'animate-bounce' : ''}`} />
            <span>हॉर्न ओके प्लीज (Horn ok pleaseeee 🎺)</span>
          </button>
        </div>

        {/* Rotating Shayari / Truck Quote Banner */}
        <div className="max-w-xl px-4">
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-medium text-orange-100/90 italic tracking-wide transition duration-300">
            <span>“{TRUCK_QUOTES[quoteIndex]}”</span>
            <button
              onClick={() => setQuoteIndex((quoteIndex + 1) % TRUCK_QUOTES.length)}
              className="text-white/40 hover:text-white transition p-1"
              title="Next Shayari"
            >
              <Shuffle className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* 3. BOTTOM SPOTIFY MUSIC PLAYER UI */}
      <footer className="relative z-20 mx-auto w-full max-w-4xl p-4 sm:p-6 space-y-3">
        {/* Embedded Spotify Player with Fallback & Direct Link */}
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/70 shadow-2xl backdrop-blur-xl transition duration-300">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <Disc className="h-4 w-4 text-emerald-400 animate-spin" />
              <span className="font-bold text-white">Truck Wala Highway Radio Playlist</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSpotifyEmbed(!showSpotifyEmbed)}
                className="text-[11px] text-orange-300 hover:text-orange-200 font-semibold"
              >
                {showSpotifyEmbed ? 'Compact Player' : 'Expand Spotify Player'}
              </button>
              <a
                href="https://open.spotify.com/playlist/6E2HGQUgPacSv4APUlmD1d"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <span>Open Spotify</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {showSpotifyEmbed && (
            <div className="w-full bg-black/90 p-2">
              <iframe
                style={{ borderRadius: '12px' }}
                src={spotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Truck Wala Spotify Playlist"
              />
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}
