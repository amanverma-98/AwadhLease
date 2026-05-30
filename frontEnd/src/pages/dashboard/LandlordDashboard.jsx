import { useEffect, useState } from 'react'
import { KpiCard } from '../../components/KpiCard'
import { InsightCard } from '../../components/InsightCard'
import { ActivityList } from '../../components/ActivityList'
import { Card, CardHeader, CardContent } from '../../components/ui/card'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/button'
import { useDashboardStore } from '../../store/useDashboardStore'
import { getAnalytics } from '../../services/analyticsService'
import { formatRupee } from '../../utils/format'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  Clock,
  Building,
  Plus,
  Users,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Activity,
  UserCheck
} from 'lucide-react'

export function LandlordDashboard() {
  const navigate = useNavigate()
  const { kpis, setKpis } = useDashboardStore()
  const [liveInsight, setLiveInsight] = useState(null)

  const displayedKpis = kpis.length
    ? kpis
    : [
        { id: 'collected', label: 'Rent collected', value: '—', tone: 'emerald', icon: TrendingUp },
        { id: 'pending', label: 'Pending rent', value: '—', tone: 'gold', icon: Clock },
        { id: 'occupancy', label: 'Occupancy', value: '—', tone: 'brand', icon: Building }
      ]

  useEffect(() => {
    getAnalytics()
      .then((data) => {
        const m = data.metrics
        setKpis([
          {
            id: 'collected',
            label: 'Rent collected',
            value: formatRupee(m.total_collected),
            delta: `+${m.success_rate}% success`,
            tone: 'emerald',
            icon: TrendingUp,
            trend: 'up'
          },
          {
            id: 'pending',
            label: 'Pending rent',
            value: formatRupee(m.total_pending),
            delta: `${m.open_maintenance_count} issues`,
            tone: 'gold',
            icon: Clock,
            trend: 'neutral'
          },
          {
            id: 'occupancy',
            label: 'Occupancy',
            value: `${(m.occupied_property_ratio * 100).toFixed(0)}%`,
            delta: `${(m.active_tenant_ratio * 100).toFixed(0)}% active`,
            tone: 'brand',
            icon: Building,
            trend: 'up'
          }
        ])
        setLiveInsight(data.insight)
      })
      .catch(() => {})
  }, [setKpis])

  // Mock list of recent activity formatted beautifully
  const mockActivities = [
    { id: '1', title: 'KYC verified', detail: 'Aman Verma passed instant screening', type: 'success', date: 'Just now' },
    { id: '2', title: 'Maintenance reported', detail: 'Leakage in flat B-102 routed to plumber', type: 'warning', date: '2 hrs ago' },
    { id: '3', title: 'Rent collected', detail: '₹18,500 deposited for Unit A-4', type: 'info', date: '5 hrs ago' }
  ]

  const actions = (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/assistant')} 
        className="font-bold flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4 text-brand-500" />
        AI Assistant
      </Button>
      <Button 
        size="sm" 
        onClick={() => navigate('/properties')} 
        className="font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/10"
      >
        <Plus className="h-4 w-4" />
        Add Property
      </Button>
    </>
  )

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <PageHeader 
        title="Landlord Command Center" 
        subtitle="Manage your multi-tenant layouts, automate invoices, and review live AI logs."
        actions={actions}
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {displayedKpis.map((kpi) => (
          <KpiCard 
            key={kpi.id} 
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            tone={kpi.tone || 'brand'}
            icon={kpi.icon || Building}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Grid for Vector Placeholder Charts */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-ink-400 dark:text-ink-500">
                Revenue analytics
              </p>
              <h2 className="text-base font-bold text-ink-950 dark:text-ink-50 font-sora mt-1">
                Rent Inflow Trend
              </h2>
            </div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2.5 py-1 rounded-full">
              Live Inflow Track
            </span>
          </div>
          
          {/* Beautiful SVG Sparkline Graph */}
          <div className="mt-6 relative">
            <svg className="w-full h-52 overflow-visible" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="rev-chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f7a6e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1f7a6e" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-ink-800/40" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-ink-800/40" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-ink-800/40" />
              
              <path d="M 0 140 Q 80 110 160 90 T 320 60 L 400 30 L 400 150 L 0 150 Z" fill="url(#rev-chart-grad)" />
              <path d="M 0 140 Q 80 110 160 90 T 320 60 L 400 30" fill="none" stroke="#1f7a6e" strokeWidth="3" strokeLinecap="round" />
              
              <circle cx="160" cy="90" r="5" fill="#1f7a6e" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="320" cy="60" r="5" fill="#1f7a6e" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="400" cy="30" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-bold text-ink-400">₹2.4L</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-bold text-brand-600">Peak collected (May)</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-ink-400 dark:text-ink-500">
                Occupancy Ratio
              </p>
              <h2 className="text-base font-bold text-ink-950 dark:text-ink-50 font-sora mt-1">Active Units</h2>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1 rounded-full">
              Stable
            </span>
          </div>

          {/* Elegant Purplish Area SVG Chart */}
          <div className="mt-6 relative">
            <svg className="w-full h-52 overflow-visible" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="occ-purple-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-ink-800/40" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-ink-800/40" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-ink-800/40" />
              
              <path d="M 0 120 C 100 110 150 50 250 40 L 400 40 L 400 150 L 0 150 Z" fill="url(#occ-purple-grad)" />
              <path d="M 0 120 C 100 110 150 50 250 40 L 400 40" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
              
              <circle cx="250" cy="40" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="400" cy="40" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-bold text-ink-400">92% Rate</div>
          </div>
        </Card>
      </div>

      {/* AI Insights & Recent activities timeline */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-950 dark:text-ink-50 font-sora flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-brand-500" />
              Live AI Recommendations
            </h2>
            <button className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline" onClick={() => navigate('/analytics')}>
              View Analytics
            </button>
          </div>
          <div className="grid gap-4">
            {liveInsight && (
              <InsightCard
                insight={{
                  id: 'live',
                  title: liveInsight.summary,
                  detail: liveInsight.details || 'AI completed audit of May receipts. No discrepancy in rent disbursal found. Total of 18 units evaluated successfully on autopilot.',
                  confidence: 96,
                  status: 'info'
                }}
                onAction={() => navigate('/assistant')}
                actionText="Chat with AI Agent"
              />
            )}
            {!liveInsight && (
              <Card className="p-5 text-sm text-ink-500">
                No AI insights yet. Generate analytics to see recommendations.
              </Card>
            )}
          </div>
        </div>

        {/* Timeline lists */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-950 dark:text-ink-50 font-sora flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-brand-500" />
              System Activity Logs
            </h2>
          </div>
          
          <Card className="p-5">
            <div className="flow-root">
              <ul className="-mb-8">
                {mockActivities.map((act, actIdx) => (
                  <li key={act.id}>
                    <div className="relative pb-8">
                      {actIdx !== mockActivities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-ink-100 dark:bg-ink-800" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-xl flex items-center justify-center ring-8 ring-white dark:ring-ink-900 ${
                            act.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            act.type === 'warning' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' :
                            'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                          }`}>
                            {act.type === 'success' ? <UserCheck className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-ink-500 dark:text-ink-400 flex items-center justify-between gap-2">
                            <span className="font-bold text-ink-900 dark:text-ink-100">{act.title}</span>
                            <span className="text-[10px] font-semibold text-ink-400">{act.date}</span>
                          </div>
                          <p className="text-xs text-ink-400 dark:text-ink-500 mt-1">{act.detail}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
