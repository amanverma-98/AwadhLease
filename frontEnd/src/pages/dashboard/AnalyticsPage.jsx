import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { getAnalytics } from '../../services/analyticsService'
import { formatRupee } from '../../utils/format'
import { PageHeader } from '../../components/PageHeader'
import { StatCard } from '../../components/StatCard'
import { Badge } from '../../components/ui/badge'
import { 
  TrendingUp, 
  Coins, 
  Clock, 
  Percent, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  HelpCircle,
  FileText
} from 'lucide-react'

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
      .then((data) => {
        setAnalytics(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const metrics = analytics?.metrics
  const insight = analytics?.insight

  if (loading) {
    return (
      <div className="space-y-6 pb-20 animate-pulse">
        <div className="h-10 w-48 bg-ink-200 dark:bg-ink-800 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-ink-150 dark:bg-ink-800/60 rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-64 bg-ink-150 dark:bg-ink-800/60 rounded-3xl" />
          <div className="h-64 bg-ink-150 dark:bg-ink-800/60 rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      <PageHeader 
        title="Analytics & Financials" 
        description="Real-time occupancy yield, maintenance ticket metrics, and intelligent rental ledger trends."
      />

      {error && (
        <Card className="border-rose-200 dark:border-rose-950/40 bg-rose-50/50 dark:bg-rose-950/10 p-4 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-3 rounded-2xl">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>Error gathering analytics: {error}</span>
        </Card>
      )}

      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard 
            title="Total Revenue Collected" 
            value={formatRupee(metrics.total_collected)} 
            icon={Coins} 
            trend="+12.4%" 
            description="vs last month"
            tone="emerald"
          />
          <StatCard 
            title="Pending Ledger" 
            value={formatRupee(metrics.total_pending)} 
            icon={Clock} 
            trend="-3.2%" 
            description="vs last month"
            tone={metrics.total_pending > 0 ? "amber" : "default"}
          />
          <StatCard 
            title="Collection Rate" 
            value={`${metrics.success_rate}%`} 
            icon={Percent} 
            trend="+1.8%" 
            description="invoices cleared"
          />
          <StatCard 
            title="Occupancy Yield" 
            value={`${(metrics.occupied_property_ratio * 100).toFixed(0)}%`} 
            icon={TrendingUp} 
            trend="+2.5%" 
            description="leased units"
            tone="primary"
          />
          <StatCard 
            title="Active Service Requests" 
            value={metrics.open_maintenance_count} 
            icon={Activity} 
            trend={metrics.open_maintenance_count > 3 ? "+1" : "0"} 
            description="needs dispatch"
            tone={metrics.open_maintenance_count > 0 ? "rose" : "default"}
          />
        </div>
      )}

      {/* SVG Interactive Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Revenue Trends Chart */}
        <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
                Monthly Yield Stream
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                Dynamic visual comparison of collected rent payouts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-600 dark:text-ink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                Collected
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-600 dark:text-ink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-200 dark:bg-brand-900" />
                Target
              </span>
            </div>
          </div>

          <div className="relative h-60 w-full">
            <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="40" y1="40" x2="480" y2="40" stroke="currentColor" className="text-ink-100 dark:text-ink-800/40" strokeDasharray="4 4" />
              <line x1="40" y1="90" x2="480" y2="90" stroke="currentColor" className="text-ink-100 dark:text-ink-800/40" strokeDasharray="4 4" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="currentColor" className="text-ink-100 dark:text-ink-800/40" strokeDasharray="4 4" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="currentColor" className="text-ink-100 dark:text-ink-800/80" />

              {/* Axis labels */}
              <text x="15" y="45" className="text-[10px] font-bold fill-ink-400 dark:fill-ink-500 font-mono">₹1.5L</text>
              <text x="15" y="95" className="text-[10px] font-bold fill-ink-400 dark:fill-ink-500 font-mono">₹1.0L</text>
              <text x="15" y="145" className="text-[10px] font-bold fill-ink-400 dark:fill-ink-500 font-mono">₹50K</text>
              <text x="25" y="185" className="text-[10px] font-bold fill-ink-400 dark:fill-ink-500 font-mono">0</text>

              {/* Chart Target Line */}
              <path 
                d="M 50 130 Q 150 120, 250 80 T 450 60" 
                fill="none" 
                stroke="currentColor" 
                className="text-brand-200 dark:text-brand-900" 
                strokeWidth="2.5" 
                strokeDasharray="4 4"
              />

              {/* Chart Gradient Path */}
              <path 
                d="M 50 180 L 50 145 C 100 135, 150 110, 200 95 C 250 80, 300 110, 350 70 C 400 30, 450 40, 450 45 L 450 180 Z" 
                fill="url(#chartGradient)"
              />

              {/* Chart Real Line */}
              <path 
                d="M 50 145 C 100 135, 150 110, 200 95 C 250 80, 300 110, 350 70 C 400 30, 450 40, 450 45" 
                fill="none" 
                stroke="#8b5cf6" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Highlight Dot */}
              <circle cx="350" cy="70" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
              <circle cx="350" cy="70" r="10" fill="#8b5cf6" fillOpacity="0.2" className="animate-ping" />

              {/* X Axis Months */}
              <text x="50" y="205" className="text-[10px] font-bold text-center fill-ink-400 dark:fill-ink-500 font-sora">Jan</text>
              <text x="130" y="205" className="text-[10px] font-bold text-center fill-ink-400 dark:fill-ink-500 font-sora">Feb</text>
              <text x="210" y="205" className="text-[10px] font-bold text-center fill-ink-400 dark:fill-ink-500 font-sora">Mar</text>
              <text x="290" y="205" className="text-[10px] font-bold text-center fill-ink-400 dark:fill-ink-500 font-sora">Apr</text>
              <text x="370" y="205" className="text-[10px] font-bold text-center fill-ink-400 dark:fill-ink-500 font-sora">May</text>
              <text x="450" y="205" className="text-[10px] font-bold text-center fill-ink-400 dark:fill-ink-500 font-sora">Jun</text>
            </svg>
          </div>
        </Card>

        {/* Maintenance Categories Bar Chart */}
        <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
                Service Triage Categories
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                Resolution statistics across key domestic repair types.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Resolved
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-450">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-450/70" />
                Pending
              </span>
            </div>
          </div>

          <div className="relative h-60 w-full">
            <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="90" y1="180" x2="470" y2="180" stroke="currentColor" className="text-ink-200 dark:text-ink-800" strokeWidth="1.5" />
              <line x1="185" y1="30" x2="185" y2="180" stroke="currentColor" className="text-ink-100 dark:text-ink-800/40" strokeDasharray="3 3" />
              <line x1="280" y1="30" x2="280" y2="180" stroke="currentColor" className="text-ink-100 dark:text-ink-800/40" strokeDasharray="3 3" />
              <line x1="375" y1="30" x2="375" y2="180" stroke="currentColor" className="text-ink-100 dark:text-ink-800/40" strokeDasharray="3 3" />
              <line x1="470" y1="30" x2="470" y2="180" stroke="currentColor" className="text-ink-100 dark:text-ink-800/40" strokeDasharray="3 3" />

              {/* Grid labels */}
              <text x="185" y="198" className="text-[9px] font-bold fill-ink-400 dark:fill-ink-500 text-center font-mono">25%</text>
              <text x="280" y="198" className="text-[9px] font-bold fill-ink-400 dark:fill-ink-500 text-center font-mono">50%</text>
              <text x="375" y="198" className="text-[9px] font-bold fill-ink-400 dark:fill-ink-500 text-center font-mono">75%</text>
              <text x="470" y="198" className="text-[9px] font-bold fill-ink-400 dark:fill-ink-500 text-center font-mono">100%</text>

              {/* Category 1: Plumbing */}
              <text x="10" y="52" className="text-xs font-bold fill-ink-700 dark:fill-ink-300 font-sora">Plumbing</text>
              <rect x="90" y="40" width="220" height="18" rx="5" className="fill-emerald-500/80 dark:fill-emerald-600/60" />
              <rect x="312" y="40" width="60" height="18" rx="5" className="fill-rose-400/80 dark:fill-rose-500/40" />
              
              {/* Category 2: Electrical */}
              <text x="10" y="92" className="text-xs font-bold fill-ink-700 dark:fill-ink-300 font-sora">Electrical</text>
              <rect x="90" y="80" width="290" height="18" rx="5" className="fill-emerald-500/80 dark:fill-emerald-600/60" />
              <rect x="382" y="80" width="30" height="18" rx="5" className="fill-rose-400/80 dark:fill-rose-500/40" />

              {/* Category 3: Appliances */}
              <text x="10" y="132" className="text-xs font-bold fill-ink-700 dark:fill-ink-300 font-sora">Appliances</text>
              <rect x="90" y="120" width="140" height="18" rx="5" className="fill-emerald-500/80 dark:fill-emerald-600/60" />
              <rect x="232" y="120" width="120" height="18" rx="5" className="fill-rose-400/80 dark:fill-rose-500/40" />

              {/* Category 4: Heating/AC */}
              <text x="10" y="172" className="text-xs font-bold fill-ink-700 dark:fill-ink-300 font-sora">HVAC / Air</text>
              <rect x="90" y="160" width="310" height="18" rx="5" className="fill-emerald-500/80 dark:fill-emerald-600/60" />
              <rect x="402" y="160" width="40" height="18" rx="5" className="fill-rose-400/80 dark:fill-rose-500/40" />
            </svg>
          </div>
        </Card>
      </div>

      {/* AI Recommendations Panel */}
      {insight && (
        <Card className="p-6 border border-brand-100 dark:border-brand-900 bg-gradient-to-br from-white to-brand-50/10 dark:from-ink-950 dark:to-brand-950/20 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-brand-500/10 dark:text-brand-500/5 pointer-events-none">
            <Sparkles className="h-32 w-32" />
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50">
                AwadhLease AI Copilot Recommendations
              </h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                Proactive insights gathered by scanning tenants ledger activities.
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-ink-700 dark:text-ink-300 leading-relaxed font-medium bg-white/60 dark:bg-ink-900/40 p-4 rounded-2xl border border-ink-100/50 dark:border-ink-800/40">
            {insight.summary}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {/* Opportunities (Emerald) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-650 dark:text-emerald-450 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Growth & Yield Opportunities
              </h4>
              <div className="space-y-2.5">
                {insight.opportunities?.map((item, index) => (
                  <div
                    key={`opp-${index}`}
                    className="group rounded-2xl border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-450 transition hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 animate-pulse-dot" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
                {(!insight.opportunities || insight.opportunities.length === 0) && (
                  <p className="text-xs text-ink-400">No immediate opportunities identified.</p>
                )}
              </div>
            </div>

            {/* Risks (Rose) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-650 dark:text-rose-450 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Ledger Risk & Vacancy Audits
              </h4>
              <div className="space-y-2.5">
                {insight.risks?.map((item, index) => (
                  <div
                    key={`risk-${index}`}
                    className="group rounded-2xl border border-rose-100 dark:border-rose-950/30 bg-rose-50/20 dark:bg-rose-950/10 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400 transition hover:bg-rose-50/40 dark:hover:bg-rose-950/20 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 animate-pulse" />
                    <span className="leading-relaxed">Risk Audit: {item}</span>
                  </div>
                ))}
                {(!insight.risks || insight.risks.length === 0) && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> All tenant streams fully compliant.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
