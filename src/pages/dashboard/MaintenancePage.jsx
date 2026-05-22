import { useEffect, useState } from 'react'
import { MaintenanceCard } from '../../components/MaintenanceCard'
import { Card } from '../../components/ui/card'
import { listMaintenance } from '../../services/maintenanceService'
import { listProperties } from '../../services/propertyService'
import { mapMaintenanceFromApi } from '../../utils/maintenanceMapper'
import { useNotificationStore } from '../../store/useNotificationStore'

export function MaintenancePage() {
  const { pushToast } = useNotificationStore()
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [maintenanceData, propertyData] = await Promise.all([
          listMaintenance({ limit: 100 }),
          listProperties({ limit: 100 })
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
      }
    }
    load()
  }, [])

  const categories = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">
          Maintenance workflow
        </h2>
        <p className="text-sm text-ink-500">
          AI-classified tickets from the backend maintenance service.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <MaintenanceCard key={ticket.id} ticket={ticket} />
          ))}
          {!tickets.length && (
            <p className="text-sm text-ink-500">No maintenance tickets yet.</p>
          )}
        </div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-ink-900">AI triage</h3>
          <div className="mt-4 space-y-3 text-sm text-ink-600">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category}>
                {category}: {count} ticket{count > 1 ? 's' : ''}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
