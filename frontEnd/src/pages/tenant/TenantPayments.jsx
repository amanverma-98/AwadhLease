import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { formatRupee } from '../../utils/format'
import { listPayments } from '../../services/paymentService'
import { PageHeader } from '../../components/PageHeader'
import { Badge } from '../../components/ui/badge'
import { 
  CreditCard, 
  Download, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantPayments() {
  const navigate = useNavigate()
  const { pushToast } = useNotificationStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPayments({ limit: 50 })
      .then((data) => {
        const savedPayouts = JSON.parse(localStorage.getItem('recent-payouts') || '[]')
        const uniqueSaved = savedPayouts.filter(
          (sp) => !data.some((p) => p.transaction_id === sp.transaction_id)
        )
        setItems([...uniqueSaved, ...data])
      })
      .catch(() => {
        const savedPayouts = JSON.parse(localStorage.getItem('recent-payouts') || '[]')
        setItems(savedPayouts)
      })
      .finally(() => setLoading(false))
  }, [])


  const handlePay = () => {
    navigate('/tenant/payments/checkout')
  }

  const handleReceipt = (payment) => {
    try {
      const dateLabel = new Date(payment.payment_date).toLocaleDateString('en-IN')
      const payId = String(payment.id || '')
      const propId = String(payment.property_id || '')
      const tenantId = String(payment.tenant_id || '')

      const content = [
        '========================================',
        '        AWADHLEASE AI RENT RECEIPT       ',
        '========================================',
        `Receipt Ref ID : REC-${payId.substring(0, 8).toUpperCase()}`,
        `Payment Date   : ${dateLabel}`,
        `Rent Amount    : ${formatRupee(payment.amount)}`,
        `Ledger Status  : ${payment.payment_status.toUpperCase()}`,
        `Transaction ID : ${payment.transaction_id || 'N/A'}`,
        `Property Ref   : PROP-${propId.substring(0, 6).toUpperCase()}`,
        `Tenant Account : TENT-${tenantId.substring(0, 6).toUpperCase()}`,
        '----------------------------------------',
        'Thank you for renting with AwadhLease AI.',
        'This receipt is electronically verified.',
        '========================================'
      ].join('\n')

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `rent-receipt-${payId.substring(0, 8)}.txt`
      link.click()
      URL.revokeObjectURL(url)
      pushToast({
        title: 'Receipt Downloaded',
        message: 'Your rent payment receipt has been saved.'
      })
    } catch (e) {
      pushToast({
        title: 'Receipt failed',
        message: 'Unable to build receipt template.',
        tone: 'danger'
      })
    }
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      <PageHeader 
        title="Ledger Payouts & Receipts" 
        description="Verify past rent receipts, view upcoming due amounts, and settle current monthly balances."
      />

      {/* Rent Pay CTA */}
      <Card className="p-6 border border-brand-100 dark:border-brand-900 bg-gradient-to-br from-white to-brand-50/10 dark:from-ink-950 dark:to-brand-950/20 shadow-soft">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-glow">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                Upcoming Ledger Balance
              </p>
              <h3 className="text-xl font-bold font-sora text-ink-950 dark:text-ink-50 mt-1">
                {formatRupee(18000)} is due in 5 days
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-500 font-medium mt-0.5">
                Payout cycle ends June 5, 2026.
              </p>
            </div>
          </div>
          <Button onClick={handlePay} className="shadow-glow px-6 flex items-center gap-2 rounded-2xl">
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
        </div>
      </Card>

      {/* Payment History */}
      <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
              Rent Ledger History
            </h3>
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
              Instant access to all verified transaction records.
            </p>
          </div>
          <Badge className="font-semibold text-xs py-1" tone="info">
            {items.length} Transactions
          </Badge>
        </div>

        <div className="space-y-3.5">
          {loading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-ink-50 dark:bg-ink-900 animate-pulse rounded-2xl" />
              ))}
            </div>
          )}

          {!loading && items.map((payment) => {
            const status = payment.payment_status.toLowerCase()
            const isPaid = status === 'paid' || status === 'success' || status === 'completed'
            const isPending = status === 'pending'
            
            return (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-ink-100 dark:border-ink-800/80 bg-ink-50/10 dark:bg-ink-950/20 px-5 py-4 transition hover:bg-ink-50/30 hover:border-ink-200 dark:hover:border-ink-750"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl flex items-center justify-center ${
                    isPaid 
                      ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-650' 
                      : isPending
                      ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-650'
                      : 'bg-rose-100 dark:bg-rose-950/30 text-rose-650'
                  }`}>
                    {isPaid ? <CheckCircle2 className="h-5 w-5" /> : isPending ? <Clock className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold font-sora text-ink-950 dark:text-ink-100">
                      Rent Payment — {new Date(payment.payment_date).toLocaleString('en-IN', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge tone={isPaid ? 'success' : isPending ? 'warning' : 'danger'} className="text-[9px] uppercase tracking-wider font-bold">
                        {payment.payment_status}
                      </Badge>
                      {payment.transaction_id && (
                        <span className="text-[10px] text-ink-400 dark:text-ink-500 font-bold font-mono">
                          Txn: {String(payment.transaction_id).substring(0, 16)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:text-right sm:flex-col sm:items-end gap-2.5 border-t sm:border-0 border-ink-100/60 dark:border-ink-800 pt-3 sm:pt-0">
                  <p className="text-base font-bold font-sora text-ink-950 dark:text-ink-50">
                    {formatRupee(payment.amount)}
                  </p>
                  <button
                    className="text-xs font-bold text-brand-650 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 flex items-center gap-1 transition"
                    onClick={() => handleReceipt(payment)}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            )
          })}

          {!loading && !items.length && (
            <div className="text-center py-8">
              <p className="text-xs text-ink-400 font-medium">No verified ledger entries found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
