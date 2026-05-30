import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { formatRupee } from '../../utils/format'
import { PageHeader } from '../../components/PageHeader'
import { StatCard } from '../../components/StatCard'
import { 
  CreditCard, 
  Wrench, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Download, 
  PhoneCall, 
  Home, 
  FileText,
  ShieldCheck
} from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantDashboard() {
  const navigate = useNavigate()
  const { pushToast } = useNotificationStore()

  const handlePayNow = async () => {
    navigate('/tenant/payments')
  }

  const triggerMockAction = (title, msg) => {
    pushToast({ title, message: msg })
  }

  // Calculate lease progress (mocking March 2026 to Feb 2027, ~25% completed as of late May)
  const leaseProgress = 25

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      <PageHeader 
        title="Tenant Residence Space" 
        description="Verify monthly rent balances, report service maintenance tickets, and check lease timelines."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Rent Due Card */}
        <Card className="p-6 border border-brand-100 dark:border-brand-900 bg-gradient-to-br from-white to-brand-50/15 dark:from-ink-950 dark:to-brand-950/10 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Current Rent Ledger
              </span>
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-650">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                Due in 5 Days
              </span>
              <h3 className="text-3xl font-bold tracking-tight font-sora text-ink-950 dark:text-ink-50 mt-2">
                {formatRupee(18000)}
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-1 font-medium">
                Billing Cycle: May 2026 payout
              </p>
            </div>
          </div>
          <Button className="mt-5 w-full shadow-glow" onClick={handlePayNow}>
            Pay Rent Now
          </Button>
        </Card>

        {/* Maintenance Ticket Card */}
        <Card className="p-6 border border-amber-100 dark:border-amber-950/20 bg-white dark:bg-ink-950 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                Maintenance Dispatch
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <Badge className="font-bold uppercase tracking-wider text-[10px]" tone="warning">
                Vendor Assigned
              </Badge>
              <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50 mt-2.5">
                AC Fan Repair
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-1 font-medium">
                Assigned: CoolBreeze Corp • Tomorrow 2:00 PM
              </p>
            </div>
          </div>
          <Button variant="secondary" className="mt-5 w-full flex items-center justify-center gap-1.5" onClick={() => navigate('/tenant/maintenance')}>
            <span>View Repair Logs</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>

        {/* AI Lease Reminders */}
        <StatCard 
          title="AI Co-pilot Intelligence" 
          value="42 Days Remain" 
          icon={Clock} 
          trend="Compliant" 
          description="until lease renewal opens"
          tone="emerald"
        />
      </div>

      {/* Lease Overview & Timeline progress */}
      <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50 flex items-center gap-2">
              <Home className="h-5 w-5 text-brand-500" />
              Active Tenancy Ledger Overview
            </h3>
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
              Current building structure details and security deposit records.
            </p>
          </div>
          <Badge className="font-bold px-3 py-1 text-xs" tone="success">
            Active Lease Agreement
          </Badge>
        </div>

        {/* Detailed stats */}
        <div className="grid gap-4 sm:grid-cols-3 p-4 bg-ink-50/50 dark:bg-ink-900/20 border border-ink-100/50 dark:border-ink-800/40 rounded-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest">Property Asset</span>
            <p className="text-sm font-bold text-ink-900 dark:text-ink-100 font-sora">Skyline Residences A-302</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest">Lease Contract Window</span>
            <p className="text-sm font-bold text-ink-900 dark:text-ink-100 font-sora">Mar 2026 – Feb 2027</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest">Security Escrow Deposit</span>
            <p className="text-sm font-bold text-ink-900 dark:text-ink-100 font-sora">INR 45,000</p>
          </div>
        </div>

        {/* Lease Progress Timeline */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold font-sora text-ink-600 dark:text-ink-400">
            <span>Lease Timeline Elapsed</span>
            <span>{leaseProgress}% Completed</span>
          </div>
          <div className="relative w-full h-3.5 bg-ink-100 dark:bg-ink-900 rounded-full overflow-hidden border border-ink-200/50 dark:border-ink-850">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${leaseProgress}%` }}
            />
            {/* Pulsing indicator dot */}
            <div 
              className="absolute h-2.5 w-2.5 bg-white rounded-full top-0.5 border border-brand-500 shadow animate-pulse-dot" 
              style={{ left: `calc(${leaseProgress}% - 6px)` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-ink-400 uppercase tracking-widest">
            <span>Mar 1, 2026</span>
            <span>Feb 28, 2027</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions Panel */}
      <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-4">
        <div>
          <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
            Quick Assistance Drawer Actions
          </h3>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
            Download certified agreement templates or request landlord phone syncs.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button 
            variant="outline" 
            className="rounded-2xl border-brand-200 text-brand-650 hover:bg-brand-50/50 h-12 flex items-center justify-center gap-2"
            onClick={() => navigate('/tenant/maintenance')}
          >
            <Wrench className="h-4.5 w-4.5" />
            <span className="font-bold text-xs uppercase tracking-wide font-sora">Report Repairs</span>
          </Button>

          <Button 
            variant="outline" 
            className="rounded-2xl border-ink-200 hover:bg-ink-50 dark:border-ink-800 h-12 flex items-center justify-center gap-2"
            onClick={() => triggerMockAction('Downloading Agreement', 'Starting download of Skyline_Residences_Lease.pdf...')}
          >
            <Download className="h-4.5 w-4.5" />
            <span className="font-bold text-xs uppercase tracking-wide font-sora">Download Lease PDF</span>
          </Button>

          <Button 
            variant="outline" 
            className="rounded-2xl border-ink-200 hover:bg-ink-50 dark:border-ink-800 h-12 flex items-center justify-center gap-2"
            onClick={() => triggerMockAction('Contact Request Sent', 'Landlord has been shared an instant contact ticket.')}
          >
            <PhoneCall className="h-4.5 w-4.5" />
            <span className="font-bold text-xs uppercase tracking-wide font-sora">Call Landlord</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
