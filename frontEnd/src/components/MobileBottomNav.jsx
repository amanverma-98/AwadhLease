import { NavLink } from 'react-router-dom'
import { Home, Building2, Wrench, Bot } from 'lucide-react'
import { cn } from '../utils/cn'

const landlordItems = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Properties', to: '/properties', icon: Building2 },
  { label: 'Issues', to: '/maintenance', icon: Wrench },
  { label: 'AI Chat', to: '/assistant', icon: Bot }
]

const tenantItems = [
  { label: 'Home', to: '/tenant/dashboard', icon: Home },
  { label: 'Rent', to: '/tenant/payments', icon: Building2 },
  { label: 'Issues', to: '/tenant/maintenance', icon: Wrench },
  { label: 'AI Chat', to: '/tenant/notifications', icon: Bot }
]

export function MobileBottomNav({ variant = 'landlord' }) {
  const items = variant === 'tenant' ? tenantItems : landlordItems
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-ink-100/80 dark:border-ink-800/40 bg-white/85 dark:bg-ink-950/80 pb-safe-bottom pt-2.5 shadow-card md:hidden backdrop-blur-lg">
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1.5 pb-2.5 pt-1.5 px-3 min-w-[72px] min-h-[48px] text-[10px] font-bold tracking-wide transition-all relative group',
              isActive ? 'text-brand-600 dark:text-brand-400' : 'text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-300'
            )
          }
        >
          {({ isActive }) => (
            <>
              {/* Active top line indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-brand-500 dark:bg-brand-400 animate-fade-in" />
              )}
              <item.icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              <span className="font-sans leading-none">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
