import { Card } from '../../components/ui/card'

export function TenantNotifications() {
  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">
          Notifications
        </h3>
        <div className="mt-4 space-y-3 text-sm text-ink-600">
          <div className="rounded-2xl border border-ink-100 bg-white px-4 py-3">
            Rent receipt for May 2026 generated.
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white px-4 py-3">
            Vendor assigned for AC repair.
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white px-4 py-3">
            AI reminder: schedule rent payment 5 days early.
          </div>
        </div>
      </Card>
    </div>
  )
}
