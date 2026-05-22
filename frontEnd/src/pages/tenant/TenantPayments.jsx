import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { formatRupee } from '../../utils/format'

const payments = [
  { id: 'p1', month: 'May 2026', amount: 18000, status: 'Paid' },
  { id: 'p2', month: 'Apr 2026', amount: 18000, status: 'Paid' },
  { id: 'p3', month: 'Mar 2026', amount: 18000, status: 'Paid' }
]

export function TenantPayments() {
  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
              Upcoming rent
            </p>
            <p className="text-2xl font-semibold text-ink-900">
              {formatRupee(18000)} due in 5 days
            </p>
          </div>
          <Button>Pay rent</Button>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Payment history</h3>
        <div className="mt-4 space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-ink-800">{payment.month}</p>
                <p className="text-xs text-ink-400">{payment.status}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink-800">
                  {formatRupee(payment.amount)}
                </p>
                <button className="text-xs font-semibold text-brand-600">
                  Download receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
