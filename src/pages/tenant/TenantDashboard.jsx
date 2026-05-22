import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { formatRupee } from '../../utils/format'

export function TenantDashboard() {
  return (
    <div className="space-y-6 pb-20">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
            Rent due
          </p>
          <p className="mt-3 text-2xl font-semibold text-ink-900">
            {formatRupee(18000)}
          </p>
          <Button className="mt-4 w-full" size="sm">
            Pay now
          </Button>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
            Maintenance
          </p>
          <p className="mt-3 text-lg font-semibold text-ink-900">
            AC repair in progress
          </p>
          <Badge className="mt-3" tone="info">
            Vendor assigned
          </Badge>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
            AI reminders
          </p>
          <p className="mt-3 text-sm text-ink-600">
            Your lease renewal window opens in 42 days.
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Lease overview</h3>
        <div className="mt-4 grid gap-3 text-sm text-ink-600 md:grid-cols-3">
          <div>Property: Skyline Residences A-302</div>
          <div>Lease: Mar 2026 - Feb 2027</div>
          <div>Security deposit: INR 45,000</div>
        </div>
      </Card>
    </div>
  )
}
