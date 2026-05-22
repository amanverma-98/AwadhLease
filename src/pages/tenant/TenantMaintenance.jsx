import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'

export function TenantMaintenance() {
  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Raise a complaint</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input placeholder="Issue title" />
          <Input placeholder="Category" />
        </div>
        <Textarea className="mt-4" rows={4} placeholder="Describe the issue" />
        <Button className="mt-4">Submit ticket</Button>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">
          Active maintenance
        </h3>
        <div className="mt-4 space-y-3 text-sm text-ink-600">
          <div className="rounded-2xl border border-ink-100 bg-white px-4 py-3">
            AC not cooling properly — Vendor en route
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white px-4 py-3">
            WiFi downtime — Resolved
          </div>
        </div>
      </Card>
    </div>
  )
}
