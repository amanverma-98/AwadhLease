import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { formatRupee } from '../../utils/format'
import { createTenantPayment, listPayments } from '../../services/paymentService'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantPayments() {
  const { pushToast } = useNotificationStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listPayments({ limit: 50 })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const handlePay = async () => {
    setSubmitting(true)
    try {
      await createTenantPayment({
        amount: 18000,
        payment_status: 'paid'
      })
      pushToast({ title: 'Payment recorded', message: 'Your rent payment was saved.' })
      const data = await listPayments({ limit: 50 })
      setItems(data)
    } catch (error) {
      pushToast({ title: 'Payment failed', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReceipt = (payment) => {
    const dateLabel = new Date(payment.payment_date).toLocaleDateString('en-IN')
    const content = [
      'AwadhLease Rent Receipt',
      `Date: ${dateLabel}`,
      `Amount: ${formatRupee(payment.amount)}`,
      `Status: ${payment.payment_status}`,
      `Property ID: ${payment.property_id}`,
      `Tenant ID: ${payment.tenant_id}`
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rent-receipt-${payment.id}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

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
          <Button onClick={handlePay} disabled={submitting}>
            {submitting ? 'Processing...' : 'Pay rent'}
          </Button>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Payment history</h3>
        <div className="mt-4 space-y-3">
          {loading && (
            <p className="text-sm text-ink-500">Loading payments...</p>
          )}
          {!loading && items.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-ink-800">
                  {new Date(payment.payment_date).toLocaleString('en-IN', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-ink-400">
                  {payment.payment_status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink-800">
                  {formatRupee(payment.amount)}
                </p>
                <button
                  className="text-xs font-semibold text-brand-600"
                  onClick={() => handleReceipt(payment)}
                >
                  Download receipt
                </button>
              </div>
            </div>
          ))}
          {!loading && !items.length && (
            <p className="text-xs text-ink-500">No payments yet.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
