import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { MobileBottomNav } from '../components/MobileBottomNav'
import { TopNavbar } from '../components/TopNavbar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-300">
      {/* Permanent Sidebar for Desktop, drawer for mobile */}
      <Sidebar variant="landlord" />
      
      {/* Main Panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
            <TopNavbar title="Landlord Command Center" />
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Bottom Nav for Mobile */}
      <MobileBottomNav variant="landlord" />
    </div>
  )
}
