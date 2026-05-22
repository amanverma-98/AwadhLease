import { ResponsiveContainer, LineChart, Line, Tooltip, BarChart, Bar } from 'recharts'
import { Card } from '../../components/ui/card'
import { revenueSeries, maintenanceSeries } from '../../data/analytics'

export function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">Analytics</h2>
        <p className="text-sm text-ink-500">
          Revenue, occupancy heatmaps, and predictive AI recommendations.
        </p>
      </div>

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
          <h3 className="text-lg font-semibold text-ink-900">
            Maintenance trend
          </h3>
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">
          Occupancy heatmap
        </h3>
        <div className="mt-4 grid grid-cols-6 gap-3">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={`heat-${index}`}
              className="h-10 rounded-2xl"
              style={{
                background:
                  index % 3 === 0
                    ? 'rgba(99,102,241,0.5)'
                    : index % 3 === 1
                      ? 'rgba(16,185,129,0.45)'
                      : 'rgba(99,102,241,0.2)'
              }}
            />
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">
          AI recommendations
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            'Increase rent by 4% in Gomti Nagar based on demand surge.',
            'Offer early renewal discounts for 6 tenants at risk.',
            'Schedule preventive AC maintenance before peak summer.'
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-600"
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
