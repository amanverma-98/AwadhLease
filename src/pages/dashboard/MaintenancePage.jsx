import { maintenanceTickets } from '../../data/maintenance'
import { MaintenanceCard } from '../../components/MaintenanceCard'
import { Card } from '../../components/ui/card'

export function MaintenancePage() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">
          Maintenance workflow
        </h2>
        <p className="text-sm text-ink-500">
          AI-classified tickets with vendor assignment and cost prediction.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="grid gap-4">
          {maintenanceTickets.map((ticket) => (
            <MaintenanceCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-ink-900">AI triage</h3>
          <p className="mt-2 text-sm text-ink-500">
            Auto-categorized into Plumbing, Electrical, AC Repair, Internet,
            Cleaning, Structural.
          </p>
          <div className="mt-4 space-y-3 text-sm text-ink-600">
            <div>Electrical: 4 active tickets</div>
            <div>Plumbing: 3 active tickets</div>
            <div>Internet: 2 active tickets</div>
            <div>Cleaning: 1 active ticket</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
