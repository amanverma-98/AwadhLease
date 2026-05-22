import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { createMaintenance, listMaintenance } from '../../services/maintenanceService'
import { loadTenantContext, saveTenantContext } from '../../utils/authStorage'
import { mapMaintenanceFromApi } from '../../utils/maintenanceMapper'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantMaintenance() {
  const { pushToast } = useNotificationStore()
  const [issue, setIssue] = useState('')
  const [tickets, setTickets] = useState([])
  const [context, setContext] = useState(loadTenantContext() || {
    tenantId: '',
    propertyId: ''
  })

  useEffect(() => {
    listMaintenance({ limit: 50 })
      .then((data) => {
        const filtered = context.tenantId
          ? data.filter((t) => t.tenant_id === context.tenantId)
          : data
        setTickets(filtered.map((t) => mapMaintenanceFromApi(t)))
      })
      .catch(() => setTickets([]))
  }, [context.tenantId])

  const saveContext = () => {
    saveTenantContext(context)
    pushToast({ title: 'Saved', message: 'Tenant IDs updated for maintenance API.' })
  }

  const handleSubmit = async () => {
    if (!context.tenantId || !context.propertyId) {
      pushToast({
        title: 'Setup required',
        message: 'Save your tenant and property IDs from landlord onboarding.'
      })
      return
    }
    try {
      await createMaintenance({
        property_id: context.propertyId,
        tenant_id: context.tenantId,
        issue
      })
      pushToast({ title: 'Ticket raised', message: 'AI maintenance agent is processing.' })
      setIssue('')
      const data = await listMaintenance({ limit: 50 })
      const filtered = data.filter((t) => t.tenant_id === context.tenantId)
      setTickets(filtered.map((t) => mapMaintenanceFromApi(t)))
    } catch (error) {
      pushToast({ title: 'Submit failed', message: error.message })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Tenant API context</h3>
        <p className="mt-1 text-xs text-ink-500">
          Backend needs tenant and property record IDs (from landlord after onboarding).
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Tenant record ID"
            value={context.tenantId}
            onChange={(e) => setContext((p) => ({ ...p, tenantId: e.target.value }))}
          />
          <Input
            placeholder="Property ID"
            value={context.propertyId}
            onChange={(e) => setContext((p) => ({ ...p, propertyId: e.target.value }))}
          />
        </div>
        <Button className="mt-4" variant="secondary" onClick={saveContext}>
          Save IDs
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Raise a complaint</h3>
        <Textarea
          className="mt-4"
          rows={4}
          placeholder="Describe the issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <Button className="mt-4" onClick={handleSubmit}>
          Submit ticket
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Active maintenance</h3>
        <div className="mt-4 space-y-3 text-sm text-ink-600">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl border border-ink-100 bg-white px-4 py-3"
            >
              {ticket.title} — {ticket.status}
            </div>
          ))}
          {!tickets.length && (
            <p className="text-xs text-ink-500">No tickets for your tenant ID yet.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
