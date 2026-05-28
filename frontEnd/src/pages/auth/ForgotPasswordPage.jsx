import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { requestPasswordReset } from '../../services/authService'
import { useNotificationStore } from '../../store/useNotificationStore'

export function ForgotPasswordPage() {
  const { pushToast } = useNotificationStore()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!email) {
      pushToast({ title: 'Missing email', message: 'Enter your email address.' })
      return
    }
    setSubmitting(true)
    try {
      await requestPasswordReset(email)
      pushToast({ title: 'Reset link sent', message: 'Check your inbox.' })
      setEmail('')
    } catch (error) {
      pushToast({ title: 'Request failed', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-ink-100 bg-white/80 p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-ink-900">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Receive a secure reset link in your inbox.
        </p>
        <div className="mt-6 space-y-4">
          <Input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </div>
      </div>
    </div>
  )
}
