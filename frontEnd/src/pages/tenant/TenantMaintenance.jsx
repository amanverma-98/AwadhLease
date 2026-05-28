import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { createMaintenance, listMaintenance } from '../../services/maintenanceService'
import { getMe } from '../../services/authService'
import { loadTenantContext, saveTenantContext } from '../../utils/authStorage'
import { mapMaintenanceFromApi } from '../../utils/maintenanceMapper'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantMaintenance() {
  const { pushToast } = useNotificationStore()
  const [issue, setIssue] = useState('')
  const [tickets, setTickets] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })
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
    pushToast({ title: 'Saved', message: 'Tenant IDs updated for maintenance API.' })
  }

  const handleSubmit = async () => {
    if (!issue.trim()) return
    try {
      const payload = { issue }
      if (context.tenantId) payload.tenant_id = context.tenantId
      if (context.propertyId) payload.property_id = context.propertyId
      await createMaintenance(payload)
      pushToast({ title: 'Ticket raised', message: 'AI maintenance agent is processing.' })
      setIssue('')
      const data = await listMaintenance({ limit: 50 })
      setTickets(data.map((t) => mapMaintenanceFromApi(t)))
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
        {status.error && (
          <p className="mt-2 text-xs text-rose-600">{status.error}</p>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Tenant record ID"
            value={context.tenantId}
            onChange={(e) => setContext((p) => ({ ...p, tenantId: e.target.value }))}
            disabled={status.loading}
          />
          <Input
            placeholder="Property ID"
            value={context.propertyId}
            onChange={(e) => setContext((p) => ({ ...p, propertyId: e.target.value }))}
            disabled={status.loading}
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
