import React from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Enroute Application Error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Something went wrong</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                An unexpected interface error occurred. We've preserved your session.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="rounded-xl bg-slate-100 p-3 text-[11px] font-mono text-slate-700 text-left overflow-auto max-h-24 border border-slate-200">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary flex-1 text-xs font-semibold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="btn-primary flex-1 text-xs font-semibold"
              >
                <Home className="h-3.5 w-3.5" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
