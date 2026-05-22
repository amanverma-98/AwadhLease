import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
          <div className="glass-panel rounded-3xl p-8 text-center shadow-card">
            <p className="text-lg font-semibold text-ink-900">
              Something went off course.
            </p>
            <p className="mt-2 text-sm text-ink-600">
              Please refresh the page or return in a moment.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
