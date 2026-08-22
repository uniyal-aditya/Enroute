import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, Circle } from 'lucide-react'

export default function StatusTimeline({ status }) {
  // Steps: 1: Sent, 2: Reviewing/Pending, 3: Confirmed, 4: In-Transit / Pickup, 5: Delivered
  const isRejected = status === 'REJECTED'
  const isCancelled = status === 'CANCELLED'

  if (isRejected) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-center gap-2.5 text-xs text-red-700">
        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
        <div>
          <span className="font-bold text-red-900">Booking Request Declined:</span> The driver is unable to take this shipment. You may request space on another route.
        </div>
      </div>
    )
  }

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 flex items-center gap-2.5 text-xs text-slate-600">
        <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
        <div>
          <span className="font-bold text-slate-800">Route Cancelled:</span> This trip was cancelled by the driver.
        </div>
      </div>
    )
  }

  let currentStep = 1
  if (status === 'PENDING') currentStep = 2
  if (status === 'CONFIRMED') currentStep = 3
  if (status === 'COMPLETED') currentStep = 5

  const steps = [
    { num: 1, label: 'Request Sent', desc: 'Details submitted' },
    { num: 2, label: 'Driver Review', desc: 'Checking capacity' },
    { num: 3, label: 'Confirmed', desc: 'Contact unlocked' },
    { num: 4, label: 'In-Transit', desc: 'Pickup & transit' },
    { num: 5, label: 'Delivered', desc: 'Trip completed' },
  ]

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting progress line */}
        <div className="absolute left-4 right-4 top-3.5 -translate-y-1/2 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${((Math.min(currentStep, 5) - 1) / 4) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isDone = currentStep >= step.num
          const isCurrent = currentStep === step.num

          return (
            <div key={step.num} className="flex flex-col items-center relative z-10 text-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                    : isCurrent
                    ? 'bg-blue-600 text-white shadow-sm ring-4 ring-blue-500/20 animate-pulse'
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}
              >
                {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.num}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-bold tracking-tight ${
                  isCurrent ? 'text-blue-700' : isDone ? 'text-slate-800' : 'text-slate-500'
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
