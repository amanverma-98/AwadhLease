import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export function ForgotPasswordPage() {
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
          <Input placeholder="Email address" />
          <Button className="w-full">Send reset link</Button>
        </div>
      </div>
    </div>
  )
}
