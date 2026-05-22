import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export function SettingsPage() {
  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">Settings</h2>
        <p className="text-sm text-ink-500">
          Manage company profile, payment rails, and AI preferences.
        </p>
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Profile</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input placeholder="Company name" />
          <Input placeholder="Support email" />
          <Input placeholder="Primary contact" />
          <Input placeholder="Default payout account" />
        </div>
        <Button className="mt-6">Save settings</Button>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">AI automation</h3>
        <div className="mt-4 space-y-3 text-sm text-ink-600">
          <div className="flex items-center justify-between">
            <span>Auto send rent reminders</span>
            <span className="text-emerald-600">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Predictive vacancy alerts</span>
            <span className="text-emerald-600">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span>AI vendor auto-assign</span>
            <span className="text-emerald-600">Enabled</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
