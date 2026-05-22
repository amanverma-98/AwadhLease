import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useUserStore } from '../../store/useUserStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useUserStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const role = form.email.includes('tenant') ? 'tenant' : 'landlord'

  const handleLogin = () => {
    login({ name: role === 'tenant' ? 'Tenant User' : 'Landlord Admin', email: form.email, role })
    navigate(role === 'tenant' ? '/tenant/dashboard' : '/dashboard')
  }

  return (
    <div className="min-h-screen bg-ink-950/90 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            AwadhLease
          </p>
          <h1 className="text-3xl font-semibold">
            AI-secured access for landlords and tenants.
          </h1>
          <p className="text-sm text-white/70">
            We auto-detect your role and route you to the right command center.
          </p>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-xs uppercase text-white/60">Role detection</p>
            <p className="mt-2 text-sm font-semibold">
              Detected role: {role === 'tenant' ? 'Tenant' : 'Landlord'}
            </p>
          </div>
        </div>
          <div className="glass-panel rounded-3xl p-8 text-ink-900 shadow-card">
          <h2 className="text-xl font-semibold text-ink-900">Login</h2>
          <div className="mt-6 space-y-4">
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
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
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
            <button
              className="text-xs font-semibold text-brand-600"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
