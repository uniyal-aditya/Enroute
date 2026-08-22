import React from 'react'

export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatCurrency(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDistance(km) {
  if (km == null) return '—'
  return `${Math.round(km)} km`
}

const STATUS_CONFIGS = {
  ACTIVE: {
    bg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400 animate-pulse',
    label: 'Active Route',
  },
  COMPLETED: {
    bg: 'bg-slate-700/60 text-slate-300 border border-slate-600/40',
    dot: 'bg-slate-400',
    label: 'Completed',
  },
  CANCELLED: {
    bg: 'bg-red-500/15 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
    label: 'Cancelled',
  },
  PENDING: {
    bg: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    dot: 'bg-amber-400 animate-pulse',
    label: 'Review Pending',
  },
  CONFIRMED: {
    bg: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    dot: 'bg-blue-400',
    label: 'Booking Confirmed',
  },
  REJECTED: {
    bg: 'bg-red-500/15 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
    label: 'Request Declined',
  },
}

export function StatusBadge({ status, showDot = true, className = '' }) {
  const config = STATUS_CONFIGS[status] || {
    bg: 'bg-slate-800 text-slate-400 border border-slate-700',
    dot: 'bg-slate-400',
    label: status,
  }

  return (
    <span className={`badge ${config.bg} ${className}`}>
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  )
}

/**
 * Normalizes an Indian/international phone number for WhatsApp wa.me link.
 * E.g. "+91 98765-43210" or "9876543210" -> "919876543210"
 */
export function normalizeWhatsappNumber(phone) {
  if (!phone) return ''
  let digits = phone.replace(/[^\d]/g, '')
  // If 10 digits (standard Indian mobile), prepend 91
  if (digits.length === 10) {
    digits = `91${digits}`
  }
  return digits
}

export function whatsappLink(phone, message = '') {
  const normalized = normalizeWhatsappNumber(phone)
  if (!normalized) return '#'
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function phoneCallLink(phone) {
  if (!phone) return '#'
  const cleaned = phone.replace(/[^\d+]/g, '')
  return `tel:${cleaned}`
}
