export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-slate-200 text-slate-600',
  CANCELLED: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export function whatsappLink(phone, message) {
  const digits = (phone || '').replace(/[^\d]/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || '')}`
}
