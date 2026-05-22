import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { TenantTable } from '../../components/TenantTable'
import { tenants } from '../../data/tenants'

export function TenantsPage() {
  const [open, setOpen] = useState(false)

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

      <TenantTable items={tenants} />

      <div className="grid gap-4 md:grid-cols-3">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="p-5">
            <p className="text-sm font-semibold text-ink-900">{tenant.name}</p>
            <p className="text-xs text-ink-500">{tenant.property}</p>
            <p className="mt-3 text-xs text-ink-600">
              Aadhaar/PAN placeholder
            </p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-ink-500">AI Risk Score</span>
              <span className="font-semibold text-ink-800">
                {tenant.riskScore}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-6">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink-900">
                Add a tenant
              </h3>
              <button
                className="text-sm font-semibold text-ink-500"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input placeholder="Tenant name" />
              <Input placeholder="Email" />
              <Input placeholder="Phone" />
              <Input placeholder="Assigned property" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button>Generate credentials</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
