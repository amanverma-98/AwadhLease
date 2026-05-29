import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Bot,
  Building2,
  LayoutGrid,
  Settings,
  Wrench,
  Users,
  PieChart,
  Home,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { useSidebarStore } from '../store/useSidebarStore'
import { useUserStore } from '../store/useUserStore'
import { getAnalytics } from '../services/analyticsService'
import { cn } from '../utils/cn'

const landlordLinks = [
  { label: 'Overview', icon: LayoutGrid, to: '/dashboard' },
  { label: 'Properties', icon: Building2, to: '/properties' },
  { label: 'Tenants', icon: Users, to: '/tenants' },
  { label: 'Maintenance', icon: Wrench, to: '/maintenance' },
  { label: 'AI Assistant', icon: Bot, to: '/assistant' },
  { label: 'Analytics', icon: PieChart, to: '/analytics' },
  { label: 'Settings', icon: Settings, to: '/settings' }
]

const tenantLinks = [
  { label: 'Dashboard', icon: Home, to: '/tenant/dashboard' },
  { label: 'Payments', icon: Building2, to: '/tenant/payments' },
  { label: 'Maintenance', icon: Wrench, to: '/tenant/maintenance' },
  { label: 'Lease', icon: LayoutGrid, to: '/tenant/lease' },
  { label: 'Profile', icon: Users, to: '/tenant/profile' },
  { label: 'Notifications', icon: Bot, to: '/tenant/notifications' }
]

export function Sidebar({ variant = 'landlord' }) {
  const { collapsed, mobileOpen, closeMobile, toggleCollapsed } = useSidebarStore()
  const { isAuthenticated, role, user } = useUserStore()
  const [aiStatus, setAiStatus] = useState({ label: 'Checking', detail: '...' })
  const links = variant === 'tenant' ? tenantLinks : landlordLinks

  useEffect(() => {
    if (!isAuthenticated || role !== 'landlord') {
      setAiStatus({ label: 'Unavailable', detail: 'Sign in as landlord' })
      return
    }
    let mounted = true
    getAnalytics()
      .then(() => {
        if (!mounted) return
        setAiStatus({ label: 'AI Assistant Active', detail: 'Live triage enabled' })
      })
      .catch(() => {
        if (!mounted) return
        setAiStatus({ label: 'AI Offline', detail: 'Analytics offline' })
      })
    return () => {
      mounted = false
    }
  }, [isAuthenticated, role])

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}
      <aside
        className={cn(
          'relative fixed left-0 top-0 z-50 flex h-full flex-col border-r border-ink-100 dark:border-ink-800/60 bg-white/95 dark:bg-ink-950 px-4 py-6 backdrop-blur transition-all duration-300 md:static md:translate-x-0 md:relative',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Toggle Button centered on the sidebar's right border */}
        <button
          className="absolute -right-3 top-7 z-50 p-1 rounded-full border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950 text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900 transition shadow-md md:block hidden"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* Header */}
        <div className="flex items-center pb-6 border-b border-ink-100/50 dark:border-ink-800/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
                alt="AwadhLease"
                className="h-10 w-10 rounded-2xl object-cover shadow-soft ring-2 ring-brand-500/10"
              />
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft">
                <Sparkles className="h-2 w-2" />
              </div>
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <p className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">AwadhLease</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">AI Proptech</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex-1 space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              title={collapsed ? link.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 relative group',
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 border-l-2 border-brand-500 rounded-l-none pl-3 dark:bg-brand-400/10 dark:text-brand-400 dark:border-brand-400'
                    : 'text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900/60 hover:text-ink-900 dark:hover:text-ink-200'
                )
              }
              onClick={closeMobile}
            >
              <link.icon className="h-4.5 w-4.5 flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in font-medium">{link.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-ink-950 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-soft z-50">
                  {link.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom AI Status / User */}
        <div className="space-y-4 pt-6 border-t border-ink-100/50 dark:border-ink-800/40">
          <div
            className={cn(
              'rounded-2xl bg-gradient-to-br from-ink-950 to-brand-900 text-white shadow-soft transition-all duration-300 relative overflow-hidden',
              collapsed ? 'p-3 text-center' : 'p-4'
            )}
          >
            <div className="absolute inset-0 bg-noise-bg opacity-10 pointer-events-none" />
            <div
              className={cn(
                'flex items-center gap-2 relative z-10',
                collapsed ? 'justify-center' : 'justify-between'
              )}
            >
              {!collapsed && (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-brand-300">
                    AI Auto-Triage
                  </p>
                </div>
              )}
              <div className="rounded-xl bg-white/10 p-1.5">
                <Bot className="h-4 w-4 text-brand-300" />
              </div>
            </div>
            {!collapsed && (
              <div className="mt-2.5 relative z-10 animate-fade-in">
                <p className="text-xs font-bold font-sora text-brand-100">{aiStatus.label}</p>
                <p className="text-[10px] text-brand-200/80 mt-0.5">{aiStatus.detail}</p>
              </div>
            )}
          </div>

          {/* User profile details */}
          {isAuthenticated && (
            <div className={cn(
              "flex items-center gap-3 overflow-hidden rounded-2xl p-1",
              collapsed ? "justify-center" : "justify-start"
            )}>
              <div className="h-9 w-9 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center shadow-soft flex-shrink-0 text-sm ring-2 ring-brand-500/10">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              {!collapsed && (
                <div className="overflow-hidden min-w-0 animate-fade-in">
                  <p className="text-xs font-bold text-ink-900 dark:text-ink-50 truncate leading-snug">
                    {user?.name || 'Guest User'}
                  </p>
                  <p className="text-[10px] text-ink-400 dark:text-ink-500 truncate mt-0.5 capitalize">
                    {role || 'Viewer'} Account
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
