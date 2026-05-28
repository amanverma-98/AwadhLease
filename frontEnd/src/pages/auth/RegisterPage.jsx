import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useUserStore } from '../../store/useUserStore'
import { useNotificationStore } from '../../store/useNotificationStore'

export function RegisterPage() {
  const navigate = useNavigate()
  const { registerLandlord, isLoading, authError } = useUserStore()
  const { pushToast } = useNotificationStore()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    totalProperties: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async () => {
    try {
      await registerLandlord({
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        property_type: form.propertyType,
        property_count: Number(form.totalProperties) || 1
      })
      pushToast({ title: 'Account created', message: 'Landlord workspace is ready.' })
      navigate('/dashboard')
    } catch (error) {
      pushToast({
        title: 'Registration failed',
        message: error.message || 'Could not create account.'
      })
    }
  }

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
            type="email"
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
            placeholder="Primary property type (Flat, PG, House)"
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
          <div className="relative">
            <Input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {authError && <p className="mt-4 text-xs text-rose-600">{authError}</p>}
        <Button className="mt-6 w-full" onClick={handleRegister} disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create landlord account'}
        </Button>
      </div>
    </div>
  )
}
