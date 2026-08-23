import { CheckCircle2, Clock, AlertCircle, Package, Truck, Check } from 'lucide-react'

export default function StatusTimeline({ status }) {
  const isRejected = status === 'REJECTED'
  const isCancelled = status === 'CANCELLED'

  if (isRejected) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 flex items-center gap-2.5 text-xs text-rose-800">
        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
        <div>
          <span className="font-semibold">Request Declined:</span> The driver was unable to accept this booking. You can search and request space on other active routes.
        </div>
      </div>
    )
  }

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-3.5 flex items-center gap-2.5 text-xs text-slate-700">
        <AlertCircle className="h-4 w-4 text-slate-500 shrink-0" />
        <div>
          <span className="font-semibold">Route Cancelled:</span> This corridor trip was cancelled by the driver.
        </div>
      </div>
    )
  }

  let currentStep = 1
  if (status === 'PENDING') currentStep = 2
  if (status === 'CONFIRMED') currentStep = 3
  if (status === 'COMPLETED') currentStep = 5

  const steps = [
    { num: 1, label: 'Submitted', desc: 'Request sent' },
    { num: 2, label: 'Driver Review', desc: 'Pending review' },
    { num: 3, label: 'Confirmed', desc: 'Contact unlocked' },
    { num: 4, label: 'In Transit', desc: 'Cargo on route' },
    { num: 5, label: 'Delivered', desc: 'Handover complete' },
  ]

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute left-6 right-6 top-3.5 -translate-y-1/2 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((Math.min(currentStep, 5) - 1) / 4) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isDone = currentStep >= step.num
          const isCurrent = currentStep === step.num

          return (
            <div key={step.num} className="flex flex-col items-center relative z-10 text-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all shadow-sm ${
                  isDone
                    ? 'bg-blue-600 text-white'
                    : isCurrent
                    ? 'bg-blue-100 text-blue-700 ring-4 ring-blue-500/20'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : step.num}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium ${
                  isCurrent ? 'text-blue-600 font-bold' : isDone ? 'text-slate-800 font-semibold' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
