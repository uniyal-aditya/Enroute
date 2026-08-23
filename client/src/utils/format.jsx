import React from 'react'
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react'

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
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    label: 'Active Corridor',
    icon: CheckCircle2,
  },
  COMPLETED: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
    label: 'Completed / Delivered',
    icon: ShieldCheck,
  },
  CANCELLED: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    label: 'Cancelled',
    icon: XCircle,
  },
  PENDING: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500 animate-pulse',
    label: 'Pending Approval',
    icon: Clock,
  },
  CONFIRMED: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
    label: 'Confirmed',
    icon: CheckCircle2,
  },
  REJECTED: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    label: 'Declined',
    icon: XCircle,
  },
}

export function StatusBadge({ status, showDot = true, className = '' }) {
  const config = STATUS_CONFIGS[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: status,
    icon: null,
  }

  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${className}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />}
      {Icon && <Icon className="h-3 w-3" />}
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
