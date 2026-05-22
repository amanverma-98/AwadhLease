import { useEffect, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, Tooltip, BarChart, Bar } from 'recharts'
import { Card } from '../../components/ui/card'
import { revenueSeries, maintenanceSeries } from '../../data/analytics'
import { getAnalytics } from '../../services/analyticsService'
import { formatRupee } from '../../utils/format'

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch((err) => setError(err.message))
  }, [])

  const metrics = analytics?.metrics
  const insight = analytics?.insight

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">Analytics</h2>
        <p className="text-sm text-ink-500">
          Live metrics from `/analytics` plus chart previews.
        </p>
      </div>

      {error && (
        <Card className="border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </Card>
      )}

      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="p-5">
            <p className="text-xs text-ink-500">Collected</p>
            <p className="text-lg font-semibold">{formatRupee(metrics.total_collected)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-ink-500">Pending</p>
            <p className="text-lg font-semibold">{formatRupee(metrics.total_pending)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-ink-500">Success rate</p>
            <p className="text-lg font-semibold">{metrics.success_rate}%</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-ink-500">Occupied units</p>
            <p className="text-lg font-semibold">
              {(metrics.occupied_property_ratio * 100).toFixed(0)}%
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-ink-500">Open maintenance</p>
            <p className="text-lg font-semibold">{metrics.open_maintenance_count}</p>
          </Card>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-ink-900">Revenue trends</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries}>
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-ink-900">Maintenance trend</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceSeries}>
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {insight && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-ink-900">AI recommendations</h3>
          <p className="mt-2 text-sm text-ink-600">{insight.summary}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {insight.opportunities?.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-600"
              >
                {item}
              </div>
            ))}
            {insight.risks?.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                Risk: {item}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
