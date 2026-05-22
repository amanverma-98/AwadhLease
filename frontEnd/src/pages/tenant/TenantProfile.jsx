import { useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { loadTenantContext, saveTenantContext } from '../../utils/authStorage'
import { useUserStore } from '../../store/useUserStore'
import { useNotificationStore } from '../../store/useNotificationStore'

export function TenantProfile() {
  const { user } = useUserStore()
  const { pushToast } = useNotificationStore()
  const saved = loadTenantContext()
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    tenantId: saved?.tenantId || '',
    propertyId: saved?.propertyId || ''
  })

  const handleSave = () => {
    saveTenantContext({
      tenantId: form.tenantId,
      propertyId: form.propertyId
    })
    pushToast({ title: 'Profile saved', message: 'Tenant context stored locally.' })
  }

  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Tenant profile</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            placeholder="Tenant record ID (from landlord)"
            value={form.tenantId}
            onChange={(e) => setForm((p) => ({ ...p, tenantId: e.target.value }))}
          />
          <Input
            placeholder="Property ID"
            value={form.propertyId}
            onChange={(e) => setForm((p) => ({ ...p, propertyId: e.target.value }))}
          />
        </div>
        <Button className="mt-6" onClick={handleSave}>
          Save profile
        </Button>
      </Card>
    </div>
  )
}
