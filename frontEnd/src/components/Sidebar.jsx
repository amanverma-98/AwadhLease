import { NavLink } from 'react-router-dom'
import {
  Bot,
  Building2,
  LayoutGrid,
  Settings,
  Wrench,
  Users,
  PieChart,
  Home
} from 'lucide-react'
import { useSidebarStore } from '../store/useSidebarStore'
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
  const { collapsed, mobileOpen, closeMobile, toggleCollapsed } =
    useSidebarStore()
  const links = variant === 'tenant' ? tenantLinks : landlordLinks

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/40 md:hidden"
          onClick={closeMobile}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full flex-col border-r border-ink-100 bg-white/90 px-4 py-6 backdrop-blur transition-all md:static md:translate-x-0',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
              alt="AwadhLease"
              className="h-10 w-10 rounded-2xl object-cover shadow-soft"
            />
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-ink-900">AwadhLease</p>
                <p className="text-xs text-ink-400">Intelligent rentals</p>
              </div>
            )}
          </div>
          <button
            className="hidden text-xs font-semibold text-ink-500 md:block"
            onClick={toggleCollapsed}
          >
            {collapsed ? '>>' : '<<'}
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-brand-500/15 text-brand-600'
                    : 'text-ink-600 hover:bg-ink-100'
                )
              }
              onClick={closeMobile}
            >
              <link.icon className="h-4 w-4" />
              {!collapsed && link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-gradient-to-br from-ink-900 to-brand-600 px-4 py-4 text-white shadow-glow">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            AI Status
          </p>
          <p className="mt-1 text-sm font-semibold">Automation active</p>
          <p className="text-xs text-white/70">12 workflows running</p>
        </div>
      </aside>
    </>
  )
}
