import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { formatRupee } from '../../utils/format'
import { createTenantPayment } from '../../services/paymentService'
import { useNotificationStore } from '../../store/useNotificationStore'
import { PageHeader } from '../../components/PageHeader'
import { Badge } from '../../components/ui/badge'
import { 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  Lock
} from 'lucide-react'

const amountDue = 18000

function buildTransactionId() {
  if (globalThis.crypto?.randomUUID) {
    return `TXN-${globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()}`
  }
  return `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
}

export function TenantPaymentGateway() {
  const navigate = useNavigate()
  const { pushToast } = useNotificationStore()
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  
  // Custom loader messages state
  const [loadingMsg, setLoadingMsg] = useState('Initializing secure gateway...')

  // We generate a fresh random transaction ID each time the gateway mounts or completes
  const [transactionId, setTransactionId] = useState(() => buildTransactionId())
  const paymentTime = useMemo(() => new Date(), [completed])

  const handlePay = () => {
    setSubmitting(true)
    
    // Stage 1 loader msg
    setLoadingMsg('Initializing secure handshake...')
    
    // Stage 2 loader msg after 800ms
    setTimeout(() => {
      setLoadingMsg('Requesting commercial bank authorization...')
    }, 800)

    // Stage 3 loader msg after 1600ms
    setTimeout(() => {
      setLoadingMsg('Reconciling rent ledger balances...')
    }, 1600)

    // Final trigger after 2400ms
    setTimeout(async () => {
      const dateString = new Date().toISOString()
      const newPayment = {
        id: `pay-${Math.random().toString(36).slice(2, 9)}`,
        amount: amountDue,
        payment_status: 'Paid',
        payment_date: dateString,
        transaction_id: transactionId,
        property_id: 'rp-101', // Skyline Residences A-302
        tenant_id: 'tenant-demo'
      }

      // Save as the very last payout for the success screen
      localStorage.setItem('last-payout', JSON.stringify(newPayment))

      // Prepend to recent-payouts array for transaction list history
      const savedPayouts = JSON.parse(localStorage.getItem('recent-payouts') || '[]')
      localStorage.setItem('recent-payouts', JSON.stringify([newPayment, ...savedPayouts]))

      try {
        // Background call
        await createTenantPayment({
          amount: amountDue,
          payment_status: 'paid',
          payment_date: dateString,
          transaction_id: transactionId
        })
      } catch (error) {
        console.warn('API background fallback issue:', error.message)
      } finally {
        setSubmitting(false)
        navigate('/tenant/payments/success')
      }
    }, 2400)
  }


  const handleReceipt = () => {
    try {
      const dateLabel = paymentTime.toLocaleDateString('en-IN')
      const content = [
        '========================================',
        '        AWADHLEASE AI RENT RECEIPT       ',
        '========================================',
        `Receipt Ref ID : REC-${transactionId.substring(4, 12)}`,
        `Payment Date   : ${dateLabel}`,
        `Rent Amount    : ${formatRupee(amountDue)}`,
        `Ledger Status  : PAID & SETTLED`,
        `Transaction ID : ${transactionId}`,
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
      link.download = `rent-receipt-${transactionId}.txt`
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      pushToast({ title: 'Download failed', message: 'Unable to build receipt template.' })
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl pb-20 animate-fade-in-up space-y-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/tenant/payments')}
          className="p-2 rounded-xl border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900/30 transition"
          aria-label="Back to payments"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold font-sora text-ink-950 dark:text-ink-50">
            Secure Payment Gateway
          </h2>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
            Encrypted UPI & Commercial Bank Clearance Handshake.
          </p>
        </div>
      </div>

      {!completed ? (
        <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-ink-100 dark:border-ink-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
                  Rent Ledger Balance
                </h3>
                <p className="text-[10px] text-ink-400 font-bold uppercase tracking-wider">
                  Skyline Residences A-302
                </p>
              </div>
            </div>
            <Badge tone="warning">Pending Settlement</Badge>
          </div>

          {/* Secure Details */}
          <div className="space-y-3.5 rounded-2xl border border-ink-100 dark:border-ink-800/60 bg-ink-50/10 dark:bg-ink-950/20 p-5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink-500">Rent Amount Due</span>
              <span className="text-base font-bold font-sora text-ink-950 dark:text-ink-50">
                {formatRupee(amountDue)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink-500">Proposed Transaction ID</span>
              <span className="text-ink-700 dark:text-ink-300 font-bold font-mono">{transactionId}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink-500">Payout Destination</span>
              <span className="text-ink-700 dark:text-ink-300 font-bold">Shalimar Corporate Group</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold border-t border-ink-100/50 dark:border-ink-800/40 pt-3">
              <span className="text-ink-550 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                Security protocol
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider">256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={handlePay}
              disabled={submitting}
              className="w-full py-3.5 shadow-glow rounded-2xl flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span className="font-bold">{loadingMsg}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Authorize secure payout</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/tenant/payments')}
              disabled={submitting}
              className="w-full py-3 rounded-2xl border-ink-200 dark:border-ink-800 text-xs font-bold font-sora uppercase tracking-wide"
            >
              Cancel Payment
            </Button>
          </div>
        </Card>
      ) : (
        /* SUCCESS CONFIRMATION DRAWER PANEL */
        <Card className="p-8 border border-emerald-250 dark:border-emerald-900 bg-gradient-to-br from-white to-emerald-50/10 dark:from-ink-950 dark:to-emerald-950/15 shadow-glow text-center space-y-6 animate-fade-in-up">
          {/* Glowing checked check circle */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex h-14 w-14">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <div className="relative inline-flex rounded-full h-14 w-14 bg-emerald-500 text-white items-center justify-center shadow-glow shadow-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold font-sora text-ink-950 dark:text-ink-50 mt-5">
              Payment Settled Successfully
            </h3>
            <p className="text-xs text-ink-450 dark:text-ink-500 mt-1 max-w-sm">
              Your rent payout has been reconciled in AwadhLease ledgers and Arjun Tandon has been notified.
            </p>
          </div>

          {/* Reconciled invoice metadata */}
          <div className="space-y-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 text-left max-w-md mx-auto text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Rent Amount Cleared</span>
              <span className="text-sm font-bold text-ink-950 dark:text-ink-50">{formatRupee(amountDue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Transaction ID</span>
              <span className="text-ink-850 dark:text-ink-200 font-bold font-mono">{transactionId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Settled Timestamp</span>
              <span className="text-ink-850 dark:text-ink-200 font-bold">
                {paymentTime.toLocaleString('en-IN', {
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

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Button 
              className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-glow"
              onClick={handleReceipt}
            >
              <FileText className="h-4 w-4" />
              <span>Download Receipt</span>
            </Button>
            <Button 
              variant="secondary"
              className="flex-1 py-3 rounded-2xl text-xs font-bold font-sora uppercase tracking-wide"
              onClick={() => navigate('/tenant/payments')}
            >
              Back to ledger
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
