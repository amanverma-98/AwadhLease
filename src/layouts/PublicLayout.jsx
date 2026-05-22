import { Outlet, Link } from 'react-router-dom'
import { cn } from '../utils/cn'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-ink-50">
      <div className="noise-bg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-glow">
              RP
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">RentPilot AI</p>
              <p className="text-xs text-ink-500">AI Property Operations</p>
            </div>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/auth/login"
              className={cn(
                'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-100'
              )}
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className={cn(
                'inline-flex items-center justify-center rounded-2xl border border-ink-100 bg-white/80 px-4 py-2 text-sm font-semibold text-ink-900 shadow-soft transition hover:bg-white'
              )}
            >
              Register
            </Link>
          </div>
        </nav>
      </div>
      <Outlet />
      <footer className="mt-20 border-t border-ink-100 bg-white/70 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">RentPilot AI</p>
            <p className="text-xs text-ink-500">
              Premium AI-native rental marketplace for modern India.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold text-ink-500">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
