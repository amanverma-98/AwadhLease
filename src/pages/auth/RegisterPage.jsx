import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    totalProperties: '',
    password: ''
  })

  return (
    <div className="min-h-screen bg-ink-50 px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl border border-ink-100 bg-white/80 p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-ink-900">
          Landlord registration
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Create a landlord account to onboard properties, tenants, and AI
          automations.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Full name"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
          <Input
            placeholder="Primary property type"
            value={form.propertyType}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, propertyType: event.target.value }))
            }
          />
          <Input
            placeholder="Number of properties"
            value={form.totalProperties}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, totalProperties: event.target.value }))
            }
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
          />
        </div>
        <Button className="mt-6 w-full">Create landlord account</Button>
      </div>
    </div>
  )
}
