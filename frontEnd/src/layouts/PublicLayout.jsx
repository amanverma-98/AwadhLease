import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../utils/cn'

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="noise-bg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
              alt="AwadhLease logo"
              className="h-10 w-10 rounded-2xl object-cover shadow-soft"
            />
            <div>
              <p className="text-sm font-semibold text-ink-900">AwadhLease</p>
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
          <button
            className="inline-flex items-center justify-center rounded-2xl border border-ink-100 bg-white/80 p-2 text-ink-700 shadow-soft transition hover:bg-white md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="public-mobile-menu"
            type="button"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
        <div
          id="public-mobile-menu"
          className={cn(
            'mx-auto w-full max-w-6xl px-6 md:hidden',
            isMobileMenuOpen ? 'pb-6' : 'hidden'
          )}
        >
          <div className="flex flex-col gap-3 rounded-3xl border border-ink-100 bg-white/90 p-4 shadow-soft">
            <Link
              to="/auth/login"
              className={cn(
                'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-100'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className={cn(
                'inline-flex items-center justify-center rounded-2xl border border-ink-100 bg-white px-4 py-2 text-sm font-semibold text-ink-900 shadow-soft transition hover:bg-white'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
      <footer className="mt-20 border-t border-ink-100 bg-white/70 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/full%20light.png"
                alt="AwadhLease wordmark"
                className="h-10 object-contain"
              />
              <div>
                <p className="text-sm font-semibold text-ink-900">AwadhLease</p>
                <p className="text-xs text-ink-500">
                  Premium AI-native rental marketplace for modern India.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs font-semibold text-ink-500">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
