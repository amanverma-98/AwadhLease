import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { formatRupee } from '../utils/format'

export function MaintenanceCard({ ticket }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-900">{ticket.title}</p>
          <p className="text-xs text-ink-500">{ticket.property}</p>
        </div>
        <Badge tone="info">{ticket.status}</Badge>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-ink-600 md:grid-cols-2">
        <span>Category: {ticket.category}</span>
        <span>Priority: {ticket.priority}</span>
        <span>Vendor: {ticket.vendor}</span>
        <span>Est. cost: {formatRupee(ticket.cost)}</span>
      </div>
      <p className="mt-4 text-xs text-ink-500">{ticket.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {ticket.timeline.map((step) => (
          <Badge key={step}>{step}</Badge>
        ))}
      </div>
    </Card>
  )
}
