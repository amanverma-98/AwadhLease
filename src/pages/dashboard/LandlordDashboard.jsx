import { LineChart, Line, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts'
import { KpiCard } from '../../components/KpiCard'
import { InsightCard } from '../../components/InsightCard'
import { ActivityList } from '../../components/ActivityList'
import { Card } from '../../components/ui/card'
import { useDashboardStore } from '../../store/useDashboardStore'
import { aiInsights } from '../../data/insights'
import { recentActivities } from '../../data/activities'
import { revenueSeries, occupancySeries } from '../../data/analytics'

export function LandlordDashboard() {
  const { kpis } = useDashboardStore()

  return (
    <div className="space-y-8 pb-20">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
                Revenue analytics
              </p>
              <h2 className="text-lg font-semibold text-ink-900">
                Rent inflow trend
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-600">
              +12% this quarter
            </span>
          </div>
          <div className="mt-6 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="url(#revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
            Occupancy
          </p>
          <h2 className="text-lg font-semibold text-ink-900">Active units</h2>
          <div className="mt-6 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancySeries}>
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink-900">AI insights</h2>
          <div className="grid gap-4">
            {aiInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink-900">Recent activity</h2>
          <div className="mt-4">
            <ActivityList items={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  )
}
