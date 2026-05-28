import { useEffect } from 'react'
import { LogOut, Moon, Sparkles, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import { useThemeStore } from '../store/useThemeStore'
import { Button } from './ui/button'

export function TopNavbar({ title }) {
  const navigate = useNavigate()
  const { user, role, logout, refreshProfile } = useUserStore()
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ink-100 bg-white/80 px-6 py-4 shadow-soft backdrop-blur">
      <div className="flex items-center gap-3">
        <img
          src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
          alt="AwadhLease"
          className="h-9 w-9 rounded-2xl object-cover shadow-soft"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
            AwadhLease
          </p>
          <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => navigate('/assistant')}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>
        <button
          className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <LogOut className="h-4 w-4" />
          {user?.name || user?.email || 'Account'}
        </button>
      </div>
    </div>
  )
}
