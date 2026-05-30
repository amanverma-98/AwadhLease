import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { createMaintenance, listMaintenance } from '../../services/maintenanceService'
import { getMe } from '../../services/authService'
import { loadTenantContext, saveTenantContext } from '../../utils/authStorage'
import { mapMaintenanceFromApi } from '../../utils/maintenanceMapper'
import { useNotificationStore } from '../../store/useNotificationStore'
import { PageHeader } from '../../components/PageHeader'
import { Badge } from '../../components/ui/badge'
import { 
  Wrench, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react'

export function TenantMaintenance() {
  const { pushToast } = useNotificationStore()
  const [issue, setIssue] = useState('')
  const [category, setCategory] = useState('Plumbing')
  const [priority, setPriority] = useState('Medium')
  const [tickets, setTickets] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })
  
  // Custom expandable debug panel state for background context
  const [showDebug, setShowDebug] = useState(false)

  const [context, setContext] = useState(loadTenantContext() || {
    tenantId: '',
    propertyId: ''
  })

  useEffect(() => {
    let mounted = true
    getMe()
      .then((data) => {
        if (!mounted) return
        const updated = {
          tenantId: data.tenant_id || '',
          propertyId: data.property_id || ''
        }
        if (updated.tenantId || updated.propertyId) {
          setContext(updated)
          saveTenantContext(updated)
        }
        setStatus({ loading: false, error: null })
      })
      .catch((error) => {
        if (!mounted) return
        setStatus({ loading: false, error: error.message })
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    listMaintenance({ limit: 50 })
      .then((data) => {
        setTickets(data.map((t) => mapMaintenanceFromApi(t)))
      })
      .catch(() => setTickets([]))
  }, [])

  const saveContext = () => {
    saveTenantContext(context)
    pushToast({ title: 'Saved Context', message: 'Tenant IDs updated for maintenance API.' })
  }

  const handleSubmit = async () => {
    if (!issue.trim()) {
      pushToast({ title: 'Empty Description', message: 'Please describe your domestic issue.', tone: 'danger' })
      return
    }
    try {
      const payload = { 
        issue,
        category,
        priority
      }
      if (context.tenantId) payload.tenant_id = context.tenantId
      if (context.propertyId) payload.property_id = context.propertyId
      
      await createMaintenance(payload)
      pushToast({ 
        title: 'Ticket Raised', 
        message: 'Your service request has been logged. AwadhLease AI is dispatching a vendor.' 
      })
      setIssue('')
      
      // Reload tickets
      const data = await listMaintenance({ limit: 50 })
      setTickets(data.map((t) => mapMaintenanceFromApi(t)))
    } catch (error) {
      pushToast({ title: 'Submit failed', message: error.message, tone: 'danger' })
    }
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      <PageHeader 
        title="Service Maintenance Center" 
        description="Log plumbing, AC repairs, or housekeeping requests. Our AI auto-assigns local service vendors."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Raise a complaint */}
        <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-soft">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50">
                File a Service Complaint
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                Outline the details of the domestic repair below.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                  Issue Category
                </label>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Plumbing">Plumbing (Leakage, taps)</option>
                  <option value="Electrical">Electrical (Fuses, lights)</option>
                  <option value="Appliances">Appliances (AC, Fridge)</option>
                  <option value="HVAC">HVAC / Heating</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Other">Other Miscellaneous</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                  Urgency Level
                </label>
                <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low Urgency (Within 48h)</option>
                  <option value="Medium">Medium Urgency (Within 24h)</option>
                  <option value="High">High Urgency (Within 12h)</option>
                  <option value="Critical">Critical Urgency (Immediate)</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                Detailed Issue Description
              </label>
              <Textarea
                rows={4}
                placeholder="Explain the problem (e.g., 'Master bathroom faucet has been dripping continuously since last night, leaking water onto the tiles.')"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="font-medium"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full shadow-glow py-3 rounded-2xl flex items-center justify-center gap-2">
              <span>Submit Service Request</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </div>
        </Card>

        {/* Info panel */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-ink-950 to-brand-950 text-white relative overflow-hidden shadow-soft">
            <div className="absolute inset-0 bg-noise-bg opacity-10 pointer-events-none" />
            <div className="flex items-center gap-2.5 text-xs font-bold text-brand-300 uppercase tracking-widest mb-4">
              <Cpu className="h-4.5 w-4.5" />
              Automated Dispatch Engine
            </div>
            <p className="text-xs text-brand-100 leading-relaxed font-medium">
              Every filed ticket undergoes an automated LLM triage. The system determines estimated repair budgets and coordinates directly with certified local technicians.
            </p>
            <div className="mt-5 border-t border-brand-800/40 pt-4 flex items-center gap-2 text-[10px] text-brand-200 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-450" />
              Verifying Skyline Residences Credentials
            </div>
          </Card>

          {/* Active Tickets List */}
          <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
                Your Service Log History
              </h3>
              <Badge className="font-semibold text-xs py-1" tone="info">
                {tickets.length} Tickets
              </Badge>
            </div>

            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {tickets.map((ticket) => {
                const status = (ticket.status || '').toLowerCase()
                const isClosed = status === 'resolved' || status === 'closed'
                const isInProgress = status === 'in progress' || status === 'assigned'
                
                return (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50/10 dark:bg-ink-950/20 space-y-2.5 transition hover:bg-ink-50/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-ink-900 dark:text-ink-100 leading-relaxed">
                        {ticket.title}
                      </p>
                      <Badge 
                        tone={isClosed ? 'success' : isInProgress ? 'warning' : 'danger'} 
                        className="text-[9px] uppercase tracking-wider font-bold shrink-0"
                      >
                        {ticket.status || 'open'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-ink-450 dark:text-ink-500 font-bold font-mono">
                      <span>Category: {ticket.category || 'Domestic'}</span>
                      <span>Priority: {ticket.priority || 'Medium'}</span>
                    </div>
                  </div>
                )
              })}

              {!tickets.length && (
                <div className="text-center py-6">
                  <p className="text-xs text-ink-400 font-medium">No service records registered.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Advanced Drawer Debug toggle */}
      <div className="pt-8 border-t border-ink-100 dark:border-ink-800/80">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="text-[10px] font-bold text-ink-400 dark:text-ink-500 hover:text-ink-600 uppercase tracking-widest"
        >
          {showDebug ? 'Hide Advanced Context' : 'Show Advanced API Context'}
        </button>

        {showDebug && (
          <Card className="mt-4 p-5 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-4 max-w-xl animate-fade-in-up">
            <div>
              <h4 className="text-xs font-bold font-sora text-ink-900 dark:text-ink-100">
                Advanced Developer API Handshakes
              </h4>
              <p className="text-[10px] text-ink-400 mt-0.5">
                Record database IDs needed by background API gateways.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Tenant record ID"
                value={context.tenantId}
                onChange={(e) => setContext((p) => ({ ...p, tenantId: e.target.value }))}
                disabled={status.loading}
                className="text-xs"
              />
              <Input
                placeholder="Property ID"
                value={context.propertyId}
                onChange={(e) => setContext((p) => ({ ...p, propertyId: e.target.value }))}
                disabled={status.loading}
                className="text-xs"
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" variant="secondary" onClick={saveContext}>
                Save Ledger IDs
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
