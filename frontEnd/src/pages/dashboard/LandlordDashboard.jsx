import { useEffect, useState } from 'react'
import { KpiCard } from '../../components/KpiCard'
import { InsightCard } from '../../components/InsightCard'
import { ActivityList } from '../../components/ActivityList'
import { Card } from '../../components/ui/card'
import { useDashboardStore } from '../../store/useDashboardStore'
import { getAnalytics } from '../../services/analyticsService'
import { formatRupee } from '../../utils/format'

export function LandlordDashboard() {
  const { kpis, setKpis } = useDashboardStore()
  const [liveInsight, setLiveInsight] = useState(null)

  const displayedKpis = kpis.length
    ? kpis
    : [
        { id: 'collected', label: 'Rent collected', value: '—' },
        { id: 'pending', label: 'Pending rent', value: '—' },
        { id: 'occupancy', label: 'Occupancy', value: '—' }
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
            delta: `${m.success_rate}% success`
          },
          {
            id: 'pending',
            label: 'Pending rent',
            value: formatRupee(m.total_pending),
            delta: `${m.open_maintenance_count} open tickets`
          },
          {
            id: 'occupancy',
            label: 'Occupancy',
            value: `${(m.occupied_property_ratio * 100).toFixed(0)}%`,
            delta: `${(m.active_tenant_ratio * 100).toFixed(0)}% active tenants`
          }
        ])
        setLiveInsight(data.insight)
      })
      .catch(() => {})
  }, [setKpis])

  return (
    <div className="space-y-8 pb-20">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {displayedKpis.map((kpi) => (
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
            <span className="text-xs font-semibold text-ink-400">
              Waiting for historical data
            </span>
          </div>
          <div className="mt-6 flex h-52 items-center justify-center text-sm text-ink-500">
            No trend data yet. Add payments to populate charts.
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
            Occupancy
          </p>
          <h2 className="text-lg font-semibold text-ink-900">Active units</h2>
          <div className="mt-6 flex h-52 items-center justify-center text-sm text-ink-500">
            No occupancy trend yet. Add properties to populate charts.
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink-900">AI insights</h2>
          <div className="grid gap-4">
            {liveInsight && (
              <InsightCard
                insight={{
                  id: 'live',
                  title: liveInsight.summary,
                  confidence: 82,
                  status: 'info'
                }}
              />
            )}
            {!liveInsight && (
              <Card className="p-5 text-sm text-ink-500">
                No AI insights yet. Generate analytics to see recommendations.
              </Card>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink-900">Recent activity</h2>
          <div className="mt-4">
            <ActivityList items={[]} />
          </div>
        </div>
      </div>
    </div>
  )
}
