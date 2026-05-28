import { NavLink } from 'react-router-dom'
import { Home, Building2, Wrench, Bot } from 'lucide-react'
import { cn } from '../utils/cn'

const landlordItems = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Properties', to: '/properties', icon: Building2 },
  { label: 'Maintenance', to: '/maintenance', icon: Wrench },
  { label: 'AI', to: '/assistant', icon: Bot }
]

const tenantItems = [
  { label: 'Home', to: '/tenant/dashboard', icon: Home },
  { label: 'Payments', to: '/tenant/payments', icon: Building2 },
  { label: 'Maintenance', to: '/tenant/maintenance', icon: Wrench },
  { label: 'AI', to: '/tenant/assistant', icon: Bot }
]

export function MobileBottomNav({ variant = 'landlord' }) {
  const items = variant === 'tenant' ? tenantItems : landlordItems
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-ink-100 bg-white/90 py-3 shadow-soft md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-xs font-semibold',
              isActive ? 'text-brand-600' : 'text-ink-500'
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
