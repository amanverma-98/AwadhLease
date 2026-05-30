import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { formatRupee } from '../../utils/format'
import { 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantPaymentSuccess() {
  const navigate = useNavigate()
  const { pushToast } = useNotificationStore()
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    // Read the most recent payout details from localStorage
    const saved = localStorage.getItem('last-payout')
    if (saved) {
      setPayment(JSON.parse(saved))
    }
  }, [])

  const handleReceipt = () => {
    if (!payment) return
    try {
      const dateLabel = new Date(payment.payment_date).toLocaleDateString('en-IN')
      const content = [
        '========================================',
        '        AWADHLEASE AI RENT RECEIPT       ',
        '========================================',
        `Receipt Ref ID : REC-${payment.id.substring(4, 12)}`,
        `Payment Date   : ${dateLabel}`,
        `Rent Amount    : ${formatRupee(payment.amount)}`,
        `Ledger Status  : PAID & SETTLED`,
        `Transaction ID : ${payment.transaction_id}`,
        `Property Ref   : PROP-SKYLINE-A302`,
        `Verification   : ELECTRONIC COMPLIANT`,
        '----------------------------------------',
        'Thank you for renting with AwadhLease AI.',
        'This receipt is electronically verified.',
        '========================================'
      ].join('\n')

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `rent-receipt-${payment.transaction_id}.txt`
      link.click()
      URL.revokeObjectURL(url)
      pushToast({
        title: 'Receipt Saved',
        message: 'Your rent receipt has been downloaded.'
      })
    } catch (e) {
      pushToast({ title: 'Download failed', message: 'Unable to build receipt template.' })
    }
  }

  if (!payment) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-sm text-ink-500">
        Loading receipt details...
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl pb-20 animate-fade-in-up space-y-6">
      <Card className="p-8 border border-emerald-250 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/10 dark:from-ink-950 dark:to-emerald-950/15 shadow-glow text-center space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-16 w-16">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <div className="relative inline-flex rounded-full h-16 w-16 bg-emerald-500 text-white items-center justify-center shadow-glow shadow-emerald-500/30">
              <CheckCircle2 className="h-9 w-9" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold font-sora text-ink-950 dark:text-ink-50 mt-5">
            Payment Settled Successfully
          </h3>
          <p className="text-xs text-ink-450 dark:text-ink-500 mt-1 max-w-sm leading-relaxed">
            Your rent payout has been reconciled in AwadhLease ledger book. A receipt copy is shared with Arjun Tandon.
          </p>
        </div>

        <div className="space-y-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 text-left max-w-md mx-auto text-xs font-semibold">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Rent Amount Cleared</span>
            <span className="text-sm font-bold text-ink-950 dark:text-ink-50">{formatRupee(payment.amount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Transaction ID</span>
            <span className="text-ink-850 dark:text-ink-200 font-bold font-mono">{payment.transaction_id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Settled Timestamp</span>
            <span className="text-ink-850 dark:text-ink-200 font-bold font-mono">
              {new Date(payment.payment_date).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-emerald-100/60 dark:border-emerald-950/30 pt-3">
            <span className="text-emerald-700 dark:text-emerald-450 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              Ledger Status
            </span>
            <Badge tone="success" className="text-[9px] uppercase tracking-wider font-bold">Paid & Cleared</Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Button 
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-glow font-sora text-xs uppercase tracking-wider"
            onClick={handleReceipt}
          >
            <FileText className="h-4 w-4" />
            <span>Download Receipt</span>
          </Button>
          <Button 
            variant="secondary"
            className="flex-1 py-3 rounded-2xl text-xs font-bold font-sora uppercase tracking-wide flex items-center justify-center gap-1"
            onClick={() => navigate('/tenant/payments')}
          >
            <span>Back to Ledger</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
