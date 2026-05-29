import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { TenantTable } from '../../components/TenantTable'
import { listTenants, createTenant } from '../../services/tenantService'
import { listProperties } from '../../services/propertyService'
import { dedupeTenants, mapTenantFromApi } from '../../utils/tenantMapper'
import { useNotificationStore } from '../../store/useNotificationStore'
import { broadcastNotification } from '../../services/notificationService'

export function TenantsPage() {
  const { pushToast } = useNotificationStore()
  const [open, setOpen] = useState(false)
  const [tenants, setTenants] = useState([])
  const [properties, setProperties] = useState([])
  const [credentials, setCredentials] = useState(null)
  const [creating, setCreating] = useState(false)
  const [broadcasting, setBroadcasting] = useState(false)
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
    if (creating) return
    setCreating(true)
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
        title: 'Tenant created',
        message: 'Share the temporary password with the tenant.'
      })
      setOpen(false)
      load()
    } catch (error) {
      pushToast({ title: 'Create failed', message: error.message })
    } finally {
      setCreating(false)
    }
  }

  const handleBroadcast = async () => {
    if (!alertForm.title || !alertForm.message) {
      pushToast({ title: 'Missing fields', message: 'Add a title and message.' })
      return
    }
    if (broadcasting) return
    setBroadcasting(true)
    try {
      await broadcastNotification({
        title: alertForm.title,
        message: alertForm.message,
        property_id: alertForm.propertyId || null
      })
      pushToast({ title: 'Alert sent', message: 'Tenants received the notification.' })
      setAlertForm({ title: '', message: '', propertyId: '' })
    } catch (error) {
      pushToast({ title: 'Send failed', message: error.message })
    } finally {
      setBroadcasting(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Tenants</h2>
          <p className="text-sm text-ink-500">
            Manage tenant profiles, leases, and AI risk scores.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Add tenant</Button>
      </div>

      {credentials && (
        <Card className="border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          <p className="font-semibold">Tenant login credentials</p>
          <p>Email: {credentials.username}</p>
          <p>Temporary password: {credentials.password}</p>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Send tenant alert</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Alert title"
            value={alertForm.title}
            onChange={(event) =>
              setAlertForm((prev) => ({ ...prev, title: event.target.value }))
            }
          />
          <select
            className="rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm"
            value={alertForm.propertyId}
            onChange={(event) =>
              setAlertForm((prev) => ({ ...prev, propertyId: event.target.value }))
            }
          >
            <option value="">All properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="Message for tenants"
            value={alertForm.message}
            onChange={(event) =>
              setAlertForm((prev) => ({ ...prev, message: event.target.value }))
            }
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleBroadcast} disabled={broadcasting}>
            {broadcasting ? 'Sending...' : 'Send alert'}
          </Button>
        </div>
      </Card>

      <TenantTable items={tenants} />

      <div className="grid gap-4 md:grid-cols-3">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="p-5">
            <p className="text-sm font-semibold text-ink-900">{tenant.name}</p>
            <p className="text-xs text-ink-500">{tenant.property}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-ink-500">Rent status</span>
              <span className="font-semibold text-ink-800">
                {tenant.paymentStatus}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-6">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink-900">Add a tenant</h3>
              <button
                className="text-sm font-semibold text-ink-500"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Tenant name"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
              <select
                className="rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm"
                value={form.propertyId}
                onChange={(e) => setForm((p) => ({ ...p, propertyId: e.target.value }))}
              >
                <option value="">Select property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Input
                type="date"
                value={form.leaseStart}
                onChange={(e) => setForm((p) => ({ ...p, leaseStart: e.target.value }))}
              />
              <Input
                type="date"
                value={form.leaseEnd}
                onChange={(e) => setForm((p) => ({ ...p, leaseEnd: e.target.value }))}
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating...' : 'Generate credentials'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
