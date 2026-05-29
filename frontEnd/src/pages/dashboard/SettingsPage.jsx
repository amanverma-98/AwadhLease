import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { getMe, updateMe } from '../../services/authService'
import { useUserStore } from '../../store/useUserStore'
import { useNotificationStore } from '../../store/useNotificationStore'

export function SettingsPage() {
  const { updateUserInfo } = useUserStore()
  const { pushToast } = useNotificationStore()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [status, setStatus] = useState({ loading: true, saving: false, error: null })

  useEffect(() => {
    let isMounted = true
    getMe()
      .then((data) => {
        if (!isMounted) return
        setForm({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || ''
        })
        setStatus({ loading: false, saving: false, error: null })
      })
      .catch((error) => {
        if (!isMounted) return
        setStatus({ loading: false, saving: false, error: error.message })
        pushToast({ title: 'Load failed', message: error.message })
      })
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSave = async () => {
    setStatus((prev) => ({ ...prev, saving: true, error: null }))
    try {
      const payload = {
        full_name: form.full_name || null,
        email: form.email || null,
        phone: form.phone || null
      }
      const data = await updateMe(payload)
      updateUserInfo({ name: data.full_name, email: data.email, phone: data.phone })
      setStatus({ loading: false, saving: false, error: null })
      pushToast({ title: 'Settings saved', message: 'Profile updated successfully.' })
    } catch (error) {
      setStatus({ loading: false, saving: false, error: error.message })
      pushToast({ title: 'Save failed', message: error.message })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-semibold text-ink-900">Settings</h2>
        <p className="text-sm text-ink-500">
          Manage company profile, payment rails, and AI preferences.
        </p>
      </div>
      {status.error && (
        <Card className="border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {status.error}
        </Card>
      )}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Profile</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Full name"
            value={form.full_name}
            onChange={handleChange('full_name')}
            disabled={status.loading}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={handleChange('email')}
            disabled={status.loading}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange('phone')}
            disabled={status.loading}
          />
        </div>
        <Button className="mt-6" onClick={handleSave} disabled={status.saving}>
          {status.saving ? 'Saving...' : 'Save settings'}
        </Button>
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
