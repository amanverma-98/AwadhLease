import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { TenantTable } from '../../components/TenantTable'
import { PageHeader } from '../../components/PageHeader'
import { listTenants, createTenant } from '../../services/tenantService'
import { listProperties } from '../../services/propertyService'
import { dedupeTenants, mapTenantFromApi } from '../../utils/tenantMapper'
import { useNotificationStore } from '../../store/useNotificationStore'
import { broadcastNotification } from '../../services/notificationService'
import { Users, Plus, Bell, X, Check, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react'

export function TenantsPage() {
  const { pushToast } = useNotificationStore()
  const [open, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [tenants, setTenants] = useState([])
  const [properties, setProperties] = useState([])
  const [credentials, setCredentials] = useState(null)
  
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    propertyId: ''
  })
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyId: '',
    aadhaar: '',
    pan: '',
    leaseStart: '',
    leaseEnd: '',
    rentStatus: 'pending'
  })

  const load = async () => {
    try {
      const [tenantData, propertyData] = await Promise.all([
        listTenants({ limit: 100 }),
        listProperties({ limit: 100, mine: true })
      ])
      const propertyMap = Object.fromEntries(
        propertyData.map((p) => [p.id, p.name])
      )
      setProperties(propertyData)
      setTenants(
        dedupeTenants(
          tenantData.map((t) => mapTenantFromApi(t, propertyMap[t.property_id]))
        )
      )
    } catch (error) {
      pushToast({ title: 'Load failed', message: error.message })
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.propertyId || !form.leaseStart || !form.leaseEnd) {
      pushToast({
        title: 'Missing fields',
        message: 'Please complete all tenant onboarding parameters.'
      })
      return
    }
    try {
      const result = await createTenant({
        property_id: form.propertyId,
        full_name: form.fullName,
        phone: form.phone,
        email: form.email,
        aadhaar_number: form.aadhaar || 'NA',
        pan_number: form.pan || 'NA',
        lease_start: new Date(form.leaseStart).toISOString(),
        lease_end: new Date(form.leaseEnd).toISOString(),
        rent_status: form.rentStatus
      })
      setCredentials({
        username: result.username,
        password: result.temporary_password
      })
      pushToast({
        title: 'Tenant onboarded',
        message: 'Share the credentials with the tenant for workspace access.'
      })
      setOpen(false)
      // Reset form
      setForm({
        fullName: '',
        email: '',
        phone: '',
        propertyId: '',
        aadhaar: '',
        pan: '',
        leaseStart: '',
        leaseEnd: '',
        rentStatus: 'pending'
      })
      load()
    } catch (error) {
      pushToast({ title: 'Create failed', message: error.message })
    }
  }

  const handleBroadcast = async () => {
    if (!alertForm.title || !alertForm.message) {
      pushToast({ title: 'Missing fields', message: 'Add a title and message.' })
      return
    }
    try {
      await broadcastNotification({
        title: alertForm.title,
        message: alertForm.message,
        property_id: alertForm.propertyId || null
      })
      pushToast({ title: 'Alert broadcasted', message: 'Assigned tenant layouts received mobile notify.' })
      setAlertForm({ title: '', message: '', propertyId: '' })
      setAlertOpen(false)
    } catch (error) {
      pushToast({ title: 'Send failed', message: error.message })
    }
  }

  const headerActions = (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        onClick={() => setAlertOpen(true)}
        className="font-bold flex items-center gap-2"
      >
        <Bell className="h-4 w-4" />
        Broadcast Alert
      </Button>
      <Button
        onClick={() => setOpen(true)}
        className="font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/10"
      >
        <Plus className="h-4 w-4" />
        Onboard Tenant
      </Button>
    </div>
  )

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <PageHeader
        title="Manage Tenants"
        subtitle="Coordinate active tenant profiles, credentials, lease schedules, and predictive AI background risks."
        actions={headerActions}
      />

      {credentials && (
        <Card className="border-emerald-200/60 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 p-5 text-sm text-emerald-800 dark:text-emerald-400 flex items-start gap-4 rounded-3xl animate-pulse">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Instant Credentials Dispatched</p>
            <p className="mt-1 text-xs opacity-90">Tenant profile is active. Provide these login details to the user:</p>
            <div className="mt-2.5 space-y-1 text-xs font-mono bg-white/60 dark:bg-ink-950/50 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <p>Username: {credentials.username}</p>
              <p>Temporary Password: {credentials.password}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Render Table details only (Duplicate grid at bottom removed) */}
      <TenantTable items={tenants} />

      {/* Slide-over Right Side Drawer for onboarding tenants */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-ink-950 shadow-2xl h-full flex flex-col z-10 animate-slide-up border-l border-ink-100 dark:border-ink-800">
            {/* Header */}
            <div className="p-6 border-b border-ink-100 dark:border-ink-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-sora text-ink-950 dark:text-ink-50">Onboard New Tenant</h3>
                <p className="text-xs text-ink-400 mt-1">Initiate lease terms and KYC profile creation.</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900 transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Personal Info</h4>
                
                <div>
                  <label className="form-label">Full Name</label>
                  <Input
                    placeholder="e.g. Rahul Singh"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Email Address</label>
                    <Input
                      placeholder="name@email.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Mobile Number</label>
                    <Input
                      placeholder="e.g. +91 99887 76655"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-ink-100 dark:bg-ink-800/60 my-2" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Lease & Space Allocation</h4>
                
                <div>
                  <label className="form-label">Assign Property Unit</label>
                  <Select
                    value={form.propertyId}
                    onChange={(e) => setForm((p) => ({ ...p, propertyId: e.target.value }))}
                    options={[{ value: '', label: 'Select Property' }, ...properties.map(p => ({ value: p.id, label: p.name }))]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Lease Commencement</label>
                    <Input
                      type="date"
                      value={form.leaseStart}
                      onChange={(e) => setForm((p) => ({ ...p, leaseStart: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Lease Expiration</label>
                    <Input
                      type="date"
                      value={form.leaseEnd}
                      onChange={(e) => setForm((p) => ({ ...p, leaseEnd: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Initial Payment Status</label>
                  <Select
                    value={form.rentStatus}
                    onChange={(e) => setForm((p) => ({ ...p, rentStatus: e.target.value }))}
                    options={[
                      { value: 'paid', label: 'Rent Settled (Paid)' },
                      { value: 'pending', label: 'Invoiced (Pending)' },
                      { value: 'delayed', label: 'Delayed Inflow' }
                    ]}
                  />
                </div>
              </div>

              <div className="h-[1px] bg-ink-100 dark:bg-ink-800/60 my-2" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">KYC Verification Inputs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Aadhaar Card No.</label>
                    <Input
                      placeholder="e.g. 1234 5678 9012"
                      value={form.aadhaar}
                      onChange={(e) => setForm((p) => ({ ...p, aadhaar: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">PAN Card No.</label>
                    <Input
                      placeholder="e.g. ABCDE1234F"
                      value={form.pan}
                      onChange={(e) => setForm((p) => ({ ...p, pan: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-ink-100 dark:border-ink-800/80 bg-ink-50/30 dark:bg-ink-900/10 flex justify-end gap-3 flex-shrink-0">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="shadow-glow flex items-center gap-1">
                <Check className="h-4 w-4" />
                Generate Credentials
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast alert drawer modal */}
      {alertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm animate-fade-in"
            onClick={() => setAlertOpen(false)}
          />
          
          <Card className="relative w-full max-w-md p-6 z-10 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-ink-100 dark:border-ink-800/60">
              <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50 flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-brand-500" />
                Broadcast Tenant Alert
              </h3>
              <button 
                onClick={() => setAlertOpen(false)}
                className="p-1 rounded-lg text-ink-400 hover:bg-ink-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="form-label text-xs">Alert Title</label>
                <Input
                  placeholder="e.g. Maintenance Notice: Water Supply Shutoff"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="form-label text-xs">Assigned Property</label>
                <Select
                  value={alertForm.propertyId}
                  onChange={(e) => setAlertForm(prev => ({ ...prev, propertyId: e.target.value }))}
                  options={[{ value: '', label: 'All Properties' }, ...properties.map(p => ({ value: p.id, label: p.name }))]}
                />
              </div>

              <div>
                <label className="form-label text-xs">Message</label>
                <Textarea
                  rows={4}
                  placeholder="Type the message details tenants will receive..."
                  value={alertForm.message}
                  onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <Button variant="ghost" size="sm" onClick={() => setAlertOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBroadcast} size="sm" className="shadow-glow">
                Broadcast Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
