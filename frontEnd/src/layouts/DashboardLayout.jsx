import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { MobileBottomNav } from '../components/MobileBottomNav'
import { TopNavbar } from '../components/TopNavbar'
import { useSidebarStore } from '../store/useSidebarStore'

export function DashboardLayout() {
  const { openMobile, closeMobile, mobileOpen } = useSidebarStore()

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-6 px-6 py-6 pb-24 md:pb-6">
        <button
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-2 text-xs font-semibold text-ink-600 md:hidden"
          onClick={mobileOpen ? closeMobile : openMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          Menu
        </button>
        <TopNavbar title="Landlord Command Center" />
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  )
}
