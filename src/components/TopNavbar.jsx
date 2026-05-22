import { Bell, LogOut, Moon, Search, Sparkles, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '../store/useNotificationStore'
import { useUserStore } from '../store/useUserStore'
import { useThemeStore } from '../store/useThemeStore'
import { Button } from './ui/button'

export function TopNavbar({ title }) {
  const navigate = useNavigate()
  const { notifications } = useNotificationStore()
  const { user, logout } = useUserStore()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ink-100 bg-white/80 px-6 py-4 shadow-soft backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          RentPilot AI
        </p>
        <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
      </div>
      <div className="flex flex-1 items-center gap-3 md:max-w-md">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-2 text-sm text-ink-500">
          <Search className="h-4 w-4" />
          <input
            className="w-full bg-transparent text-sm text-ink-700 focus:outline-none"
            placeholder="Search insights, tenants, properties"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-2xl border border-ink-100 bg-white p-2">
          <Bell className="h-5 w-5 text-ink-500" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
            {notifications.length}
          </span>
        </button>
        <Button
          variant="secondary"
          onClick={() => navigate('/assistant')}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>
        <button
          className="rounded-2xl border border-ink-100 bg-white p-2"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-ink-500" />
          )}
        </button>
        <button
          className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <LogOut className="h-4 w-4" />
          {user?.name || 'Logout'}
        </button>
      </div>
    </div>
  )
}
