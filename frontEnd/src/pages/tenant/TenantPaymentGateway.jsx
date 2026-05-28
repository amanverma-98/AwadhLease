import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { formatRupee } from '../../utils/format'
import { createTenantPayment } from '../../services/paymentService'
import { useNotificationStore } from '../../store/useNotificationStore'

const amountDue = 18000

function buildTransactionId() {
  if (globalThis.crypto?.randomUUID) {
    return `TXN-${globalThis.crypto.randomUUID().slice(0, 8)}`
  }
  return `TXN-${Math.random().toString(36).slice(2, 10)}`
}

export function TenantPaymentGateway() {
  const navigate = useNavigate()
  const { pushToast } = useNotificationStore()
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const transactionId = useMemo(() => buildTransactionId(), [])
  const paymentTime = useMemo(() => new Date(), [])

  const handlePay = async () => {
    setSubmitting(true)
    try {
      await createTenantPayment({
        amount: amountDue,
        payment_status: 'paid',
        payment_date: paymentTime.toISOString(),
        transaction_id: transactionId
      })
      setCompleted(true)
      pushToast({
        title: 'Payment successful',
        message: `Transaction ${transactionId} confirmed.`
      })
    } catch (error) {
      pushToast({ title: 'Payment failed', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-20">
      <Card className="p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
          Secure payment
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink-900">
          Rent payment
        </h2>
        <div className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white/80 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">Amount</span>
            <span className="font-semibold text-ink-900">
              {formatRupee(amountDue)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">Transaction ID</span>
            <span className="font-semibold text-ink-900">{transactionId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">Payment time</span>
            <span className="font-semibold text-ink-900">
              {paymentTime.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">Status</span>
            <span className="font-semibold text-ink-900">
              {completed ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={handlePay}
            disabled={submitting || completed}
            className="flex-1"
          >
            {completed ? 'Payment complete' : submitting ? 'Processing...' : 'Pay now'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/tenant/payments')}
          >
            Back to payments
          </Button>
        </div>
      </Card>
    </div>
  )
}
