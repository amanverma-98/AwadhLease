import { useEffect, useState, useRef } from 'react'
import { LogOut, Moon, Sparkles, Sun, Bell, Menu, User, Settings as SettingsIcon, Shield } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import { useThemeStore } from '../store/useThemeStore'
import { useSidebarStore } from '../store/useSidebarStore'
import { Button } from './ui/button'
import { cn } from '../utils/cn'

export function TopNavbar({ title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role, logout, refreshProfile } = useUserStore()
  const { theme, toggleTheme } = useThemeStore()
  const { openMobile } = useSidebarStore()
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Create beautiful breadcrumbs based on location
  const pathnames = location.pathname.split('/').filter((x) => x)
  
  return (
    <div className="relative z-40 flex items-center justify-between rounded-3xl border border-ink-100/80 dark:border-ink-800/40 bg-white/70 dark:bg-ink-950/60 px-6 py-4 shadow-soft backdrop-blur-md animate-fade-in mb-6">

      {/* Left side: Hamburger (mobile) & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 md:hidden transition shadow-sm"
          onClick={openMobile}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-ink-400 dark:text-ink-500 mb-0.5">
            <span>AwadhLease</span>
            {pathnames.map((name, index) => (
              <span key={name} className="flex items-center gap-1">
                <span className="text-ink-300 dark:text-ink-700">/</span>
                <span className={cn(index === pathnames.length - 1 && "text-brand-600 dark:text-brand-400")}>
                  {name.replace('-', ' ')}
                </span>
              </span>
            ))}
          </div>
          <h1 className="text-lg md:text-xl font-bold font-sora text-ink-950 dark:text-ink-50 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Tools & Profile */}
      <div className="flex items-center gap-2.5">
        {/* AI Assistant Quick Access */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/assistant')}
          className="hidden md:inline-flex items-center gap-2 font-semibold hover:border-brand-500 hover:text-brand-600"
        >
          <Sparkles className="h-4 w-4 text-brand-500" />
          AI Assistant
        </Button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900 hover:text-ink-900 dark:hover:text-ink-100 transition shadow-sm"
          aria-label="View notifications"
          onClick={() => navigate(role === 'tenant' ? '/tenant/notifications' : '/settings')}
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900 hover:text-ink-900 dark:hover:text-ink-100 transition shadow-sm"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <div className="w-[1px] h-6 bg-ink-200 dark:bg-ink-800/80 mx-1 hidden sm:block" />

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-1 pr-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:hover:bg-ink-900 transition shadow-sm"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="h-8 w-8 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center shadow-soft text-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span className="hidden md:inline text-xs text-ink-800 dark:text-ink-200">
              {user?.name || user?.email?.split('@')[0] || 'Account'}
            </span>
          </button>

          {/* User Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-2 shadow-card backdrop-blur z-50 animate-fade-in">
              <div className="px-3.5 py-3 border-b border-ink-100 dark:border-ink-800/60 mb-2">
                <p className="text-xs font-bold text-ink-900 dark:text-ink-100 truncate leading-snug">
                  {user?.name || 'AwadhLease User'}
                </p>
                <p className="text-[10px] text-ink-400 dark:text-ink-500 truncate mt-0.5">
                  {user?.email || 'user@awadhlease.ai'}
                </p>
                <div className="inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider">
                  <Shield className="h-3 w-3" />
                  {role || 'user'}
                </div>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false)
                  navigate(role === 'tenant' ? '/tenant/profile' : '/settings')
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
              >
                <User className="h-4 w-4 text-ink-400" />
                View Profile
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false)
                  navigate('/settings')
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
              >
                <SettingsIcon className="h-4 w-4 text-ink-400" />
                Account Settings
              </button>

              <div className="h-[1px] bg-ink-100 dark:bg-ink-800/60 my-1.5" />

              <button
                onClick={() => {
                  setDropdownOpen(false)
                  logout()
                  navigate('/')
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
