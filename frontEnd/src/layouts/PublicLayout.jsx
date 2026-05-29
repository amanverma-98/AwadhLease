import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowRight, Sparkles, Shield, Compass, Heart, Landmark } from 'lucide-react'
import { cn } from '../utils/cn'

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#faf8f4] dark:bg-ink-950 text-ink-900 dark:text-ink-50 transition-colors duration-300">
      {/* Sticky Header with dynamic shadow/blur */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled 
            ? 'bg-white/80 dark:bg-ink-950/80 backdrop-blur-md border-b border-ink-100/80 dark:border-ink-800/40 shadow-soft' 
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
                alt="AwadhLease logo"
                className="h-10 w-10 rounded-2xl object-cover shadow-soft transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft">
                <Sparkles className="h-2.5 w-2.5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold font-sora tracking-tight text-ink-950 dark:text-ink-50">AwadhLease</p>
              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-widest leading-none mt-0.5">AI Property Ops</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link to="/" className="text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Marketplace
            </Link>
            <Link to="/auth/register" className="text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              For Landlords
            </Link>
            <Link to="/auth/login" className="text-ink-600 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              For Tenants
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3.5 md:flex">
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-bold text-ink-700 dark:text-ink-300 hover:bg-ink-100/60 dark:hover:bg-ink-900/60 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center rounded-2xl bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 text-sm font-bold shadow-sm shadow-brand-500/10 transition-all duration-200"
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="inline-flex items-center justify-center rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-2.5 text-ink-700 dark:text-ink-300 shadow-soft transition hover:bg-ink-50 dark:hover:bg-ink-800 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="public-mobile-menu"
            type="button"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            id="public-mobile-menu"
            className="fixed inset-x-0 top-[73px] bottom-0 z-40 bg-ink-950/20 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div 
              className="absolute top-0 inset-x-0 bg-white dark:bg-ink-950 p-6 border-b border-ink-100 dark:border-ink-800/80 shadow-card animate-slide-down"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4 text-sm font-semibold">
                <Link
                  to="/"
                  className="px-4 py-3 rounded-2xl text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900/60"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-3 rounded-2xl text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900/60"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Landlords
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-3 rounded-2xl text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900/60"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Tenants
                </Link>
                
                <div className="h-[1px] bg-ink-100 dark:bg-ink-800/60 my-2" />

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center justify-center rounded-2xl border border-ink-200 dark:border-ink-800 py-3 text-center text-sm font-bold text-ink-700 dark:text-ink-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-brand-500 py-3 text-center text-sm font-bold text-white shadow-soft"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <Outlet />

      {/* Modern Multi-Column Footer */}
      <footer className="mt-24 border-t border-ink-100/80 dark:border-ink-800/40 bg-white/60 dark:bg-ink-950/60 backdrop-blur px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-12">
            {/* Column 1: Info */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
                  alt="AwadhLease logo"
                  className="h-10 w-10 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">AwadhLease</p>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-widest leading-none mt-0.5">AI Proptech</p>
                </div>
              </Link>
              <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed max-w-xs">
                Premium AI-native property operations platform designed for modern Indian cities. Elevating management from stress to intelligence.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-4">Product</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
                <li><Link to="/" className="hover:text-ink-900 dark:hover:text-ink-200">Rent Marketplace</Link></li>
                <li><Link to="/auth/register" className="hover:text-ink-900 dark:hover:text-ink-200">Landlord Operations</Link></li>
                <li><Link to="/auth/register" className="hover:text-ink-900 dark:hover:text-ink-200">Tenant Workspaces</Link></li>
                <li><Link to="/assistant" className="hover:text-ink-900 dark:hover:text-ink-200">AI Assistant</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-4">Resources</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">Pricing Calculator</a></li>
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">Legal Agreement Templates</a></li>
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">Help Center</a></li>
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">Support</a></li>
              </ul>
            </div>

            {/* Column 4: Legal & Trust */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-4">Security & Trust</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-ink-500 dark:text-ink-400">
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">KYC Verification</a></li>
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">Data Security</a></li>
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">Terms of Use</a></li>
                <li><a href="#" className="hover:text-ink-900 dark:hover:text-ink-200">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-ink-100/80 dark:border-ink-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-ink-400 dark:text-ink-500">
              &copy; {new Date().getFullYear()} AwadhLease Inc. Built for institutional property excellence.
            </p>
            <div className="flex gap-6 text-[10px] text-ink-400 dark:text-ink-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-brand-500">Twitter</a>
              <a href="#" className="hover:text-brand-500">LinkedIn</a>
              <a href="#" className="hover:text-brand-500">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
