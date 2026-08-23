import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useTranslation } from '../context/LanguageContext.jsx'

export default function LanguageSelector({ variant = 'navbar' }) {
  const { lang, setLang, languages, currentLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        className={
          variant === 'footer'
            ? 'inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white'
            : 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
        }
      >
        <Globe className={`h-4 w-4 ${variant === 'footer' ? 'text-blue-400' : 'text-blue-600'}`} />
        <span className="font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Language / भाषा
          </div>
          <div className="space-y-0.5">
            {languages.map((item) => {
              const isSelected = item.code === lang
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-5 text-center font-mono text-[10px] font-bold uppercase text-slate-500">
                      {item.flag}
                    </span>
                    <span>{item.nativeName}</span>
                    <span className="text-[10px] text-slate-400">({item.name})</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
