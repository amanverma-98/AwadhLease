import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6">
      <div className="rounded-3xl border border-ink-100 bg-white/80 p-10 text-center shadow-card">
        <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          Return to the AwadhLease marketplace.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
