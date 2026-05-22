import { Card } from '../../components/ui/card'

export function TenantLease() {
  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Lease details</h3>
        <div className="mt-4 grid gap-3 text-sm text-ink-600 md:grid-cols-2">
          <div>Duration: Mar 2026 - Feb 2027</div>
          <div>Security deposit: INR 45,000</div>
          <div>Notice period: 30 days</div>
          <div>Rent escalation: 5% annually</div>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Rules</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          <li>No loud music after 10 PM</li>
          <li>Visitor entry before 11 PM</li>
          <li>Maintain cleanliness in common areas</li>
        </ul>
      </Card>
    </div>
  )
}
