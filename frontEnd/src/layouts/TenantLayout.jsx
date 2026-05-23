import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { TopNavbar } from '../components/TopNavbar'
import { MobileBottomNav } from '../components/MobileBottomNav'
import { useSidebarStore } from '../store/useSidebarStore'

export function TenantLayout() {
  const { openMobile, collapsed } = useSidebarStore()

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar variant="tenant" />
      <div className="flex flex-1 flex-col gap-6 px-6 py-6 pb-24 md:pb-6">
        <button
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-2 text-xs font-semibold text-ink-600 md:hidden"
          onClick={openMobile}
        >
          Open Menu
        </button>
        <TopNavbar title="Tenant Workspace" />
        <Outlet />
      </div>
      <MobileBottomNav variant="tenant" />
    </div>
  )
}
