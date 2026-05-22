import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useUserStore } from '../../store/useUserStore'
import { useNotificationStore } from '../../store/useNotificationStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { loginWithCredentials, isLoading, authError } = useUserStore()
  const { pushToast } = useNotificationStore()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      pushToast({ title: 'Missing fields', message: 'Enter email and password.' })
      return
    }
    try {
      const role = await loginWithCredentials(form.email, form.password)
      pushToast({ title: 'Welcome back', message: 'Signed in successfully.' })
      navigate(role === 'tenant' ? '/tenant/dashboard' : '/dashboard')
    } catch (error) {
      pushToast({
        title: 'Login failed',
        message: error.message || 'Check your credentials and try again.'
      })
    }
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
            Sign in with credentials from your landlord onboarding email.
          </p>
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
            {authError && (
              <p className="text-xs text-rose-600">{authError}</p>
            )}
            <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
            <button
              className="text-xs font-semibold text-brand-600"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Forgot password?
            </button>
            <button
              className="block text-xs font-semibold text-brand-600"
              onClick={() => navigate('/auth/register')}
            >
              Register as landlord
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
