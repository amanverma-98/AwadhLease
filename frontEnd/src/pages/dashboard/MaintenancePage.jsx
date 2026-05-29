import { useEffect, useState } from 'react'
import { MaintenanceCard } from '../../components/MaintenanceCard'
import { Card } from '../../components/ui/card'
import { PageHeader } from '../../components/PageHeader'
import { EmptyState } from '../../components/EmptyState'
import { listMaintenance } from '../../services/maintenanceService'
import { listProperties } from '../../services/propertyService'
import { mapMaintenanceFromApi } from '../../utils/maintenanceMapper'
import { useNotificationStore } from '../../store/useNotificationStore'
import { Wrench, Sparkles, Filter, CheckCircle2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function MaintenancePage() {
  const { pushToast } = useNotificationStore()
  const [tickets, setTickets] = useState([])
  const [activeTab, setActiveTab] = useState('All') // 'All' | 'Pending' | 'In Progress' | 'Resolved'
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [maintenanceData, propertyData] = await Promise.all([
        listMaintenance({ limit: 100 }),
        listProperties({ limit: 100, mine: true })
      ])
      const propertyMap = Object.fromEntries(
        propertyData.map((p) => [p.id, p.name])
      )
      setTickets(
        maintenanceData.map((t) =>
          mapMaintenanceFromApi(t, propertyMap[t.property_id])
        )
      )
    } catch (error) {
      pushToast({ title: 'Load failed', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Calculate local count aggregates
  const categories = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1
    return acc
  }, {})

  const totalTickets = tickets.length
  
  // Filter by status tab
  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'All') return true
    return ticket.status?.toLowerCase() === activeTab.toLowerCase()
  })

  // Handle mock ticket status transition for demo interaction
  const handleResolveTicket = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t))
    pushToast({ title: 'Ticket Resolved', message: 'Assigned tenant has been notified.' })
  }

  const handleAssignContractor = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'In Progress', vendor: 'A1 Plumbing Lucknow' } : t))
    pushToast({ title: 'Contractor Assigned', message: 'Vendor dispatched successfully.' })
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <PageHeader 
        title="Maintenance Workflow" 
        subtitle="AI-classified tickets, automated repair dispatches, and budget estimation reports."
      />

      {/* Filter Tabs & AI Triage Overview */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">
          {/* Tabs Filter Bar */}
          <div className="flex border-b border-ink-150 dark:border-ink-800/80 gap-6">
            {['All', 'Pending', 'In Progress', 'Resolved'].map(tab => {
              const count = tab === 'All' ? tickets.length : tickets.filter(t => t.status?.toLowerCase() === tab.toLowerCase()).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-3.5 text-xs font-bold transition-all relative",
                    activeTab === tab 
                      ? "text-brand-600 dark:text-brand-400 font-extrabold" 
                      : "text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
                  )}
                >
                  {tab}
                  {count > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold">
                      {count}
                    </span>
                  )}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-500 dark:bg-brand-400 rounded-full animate-fade-in" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Ticket list */}
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((s) => (
                <div key={s} className="h-44 border dark:border-ink-800 bg-white dark:bg-ink-900 rounded-3xl" />
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <EmptyState 
              icon={Wrench}
              title="No Tickets Found"
              description={`No maintenance tickets registered under the "${activeTab}" tab.`}
            />
          ) : (
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <MaintenanceCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onResolve={() => handleResolveTicket(ticket.id)}
                  onAssign={() => handleAssignContractor(ticket.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Triage side metrics card */}
        <div className="space-y-6">
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-4">
              <Sparkles className="h-4 w-4" />
              AI Automated Triage
            </div>
            
            <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50">Ticket Categories</h3>
            <p className="text-xs text-ink-400 mt-1 leading-relaxed">
              Our AI classifies repair requests, estimates costs, and matches vendors.
            </p>

            <div className="mt-6 space-y-4">
              {Object.entries(categories).map(([category, count]) => {
                const percentage = totalTickets ? Math.round((count / totalTickets) * 100) : 0
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-ink-800 dark:text-ink-200 capitalize">{category}</span>
                      <span className="text-ink-400">{count} ticket{count > 1 ? 's' : ''} ({percentage}%)</span>
                    </div>
                    {/* Custom Premium progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-brand-500 transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              
              {Object.keys(categories).length === 0 && (
                <p className="text-xs text-ink-400 text-center py-4">No categories compiled yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
