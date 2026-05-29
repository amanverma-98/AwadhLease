import { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { getMe, updateMe } from '../../services/authService'
import { useUserStore } from '../../store/useUserStore'
import { PageHeader } from '../../components/PageHeader'
import { 
  User, 
  Cpu, 
  Upload, 
  Camera, 
  Save, 
  Building, 
  CreditCard, 
  Lock, 
  Sparkles, 
  Bell,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { useNotificationStore } from '../../store/useNotificationStore'

export function SettingsPage() {
  const { updateUserInfo } = useUserStore()
  const { pushToast } = useNotificationStore()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [status, setStatus] = useState({ loading: true, saving: false, error: null })
  
  // Custom Interactive Toggle States
  const [aiToggles, setAiToggles] = useState({
    reminders: true,
    vacancy: true,
    autoAssign: true,
    ledgerVerify: false
  })

  // Settings tab state
  const [activeTab, setActiveTab] = useState('profile')

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
      pushToast({ 
        title: 'Settings saved', 
        message: 'Your profile configuration has been successfully updated.' 
      })
    } catch (error) {
      setStatus({ loading: false, saving: false, error: error.message })
      pushToast({ 
        title: 'Update failed', 
        message: error.message,
        tone: 'danger'
      })
    }
  }

  const toggleAi = (key) => {
    setAiToggles(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      pushToast({
        title: 'Automation updated',
        message: `${key.replace(/([A-Z])/g, ' $1')} is now ${updated[key] ? 'enabled' : 'disabled'}.`
      })
      return updated
    })
  }

  const menuItems = [
    { id: 'profile', label: 'Profile Account', icon: User },
    { id: 'copilot', label: 'AI Copilot Engine', icon: Cpu },
    { id: 'billing', label: 'Payout Rails', icon: CreditCard },
    { id: 'security', label: 'Security & Keys', icon: Lock },
  ]

  return (
    <div className="space-y-6 pb-20 animate-fade-in-up">
      <PageHeader 
        title="Settings & System Configurations" 
        description="Fine-tune your personal Landlord profiles, payment gateway credentials, and AI dispatch triggers."
      />

      {status.error && (
        <Card className="border-rose-200 dark:border-rose-950/40 bg-rose-50/50 dark:bg-rose-950/10 p-4 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-3 rounded-2xl">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>{status.error}</span>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Settings Navigation */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold font-sora tracking-wide uppercase transition duration-150 ${
                  isActive 
                    ? 'bg-brand-500 text-white shadow-soft shadow-brand-500/20' 
                    : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100/50 dark:hover:bg-ink-900/30 hover:text-ink-900 dark:hover:text-ink-100'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content Pane */}
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-6">
              <div>
                <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50">
                  Profile Details
                </h3>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                  Update your contact phone, legal names, and profile avatars.
                </p>
              </div>

              {/* Avatar upload mockup */}
              <div className="flex items-center gap-5 pb-6 border-b border-ink-100 dark:border-ink-800/80">
                <div className="relative group cursor-pointer">
                  <div className="h-16 w-16 rounded-3xl bg-brand-100 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xl shadow-inner border border-brand-200 dark:border-brand-900 overflow-hidden">
                    {form.full_name ? form.full_name.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition duration-200">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5 py-1.5 h-auto rounded-xl">
                      <Upload className="h-3.5 w-3.5" /> Upload Photo
                    </Button>
                    <span className="text-[10px] text-ink-400 dark:text-ink-500 font-bold">Max size 2MB</span>
                  </div>
                  <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-1.5">
                    Supports PNG, JPG, or GIF templates.
                  </p>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                    Legal Full Name
                  </label>
                  <Input
                    placeholder="e.g. Shalimar Admin"
                    value={form.full_name}
                    onChange={handleChange('full_name')}
                    disabled={status.loading}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                    Email Account
                  </label>
                  <Input
                    placeholder="e.g. admin@awadhlease.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    disabled={status.loading}
                    className="font-medium"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                    Mobile Contact Phone
                  </label>
                  <Input
                    placeholder="e.g. +91 9876543210"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    disabled={status.loading}
                    className="font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={status.saving || status.loading}
                  className="shadow-glow px-6 flex items-center gap-2 rounded-2xl"
                >
                  <Save className="h-4.5 w-4.5" />
                  <span>{status.saving ? 'Saving Profile...' : 'Save Settings'}</span>
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'copilot' && (
            <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-6">
              <div>
                <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-brand-500" />
                  AI Copilot Engine Configuration
                </h3>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                  Activate automatic background jobs for ledger monitoring, lease renewals, and repair assignments.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Toggle 1: reminders */}
                <div className="flex items-center justify-between p-4 bg-ink-50/50 dark:bg-ink-900/20 border border-ink-100/50 dark:border-ink-800/40 rounded-2xl transition hover:bg-ink-50/80">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-sm font-bold text-ink-900 dark:text-ink-50">
                      Auto Send Rent Reminders
                    </p>
                    <p className="text-xs text-ink-400 dark:text-ink-500">
                      Automatically sends WhatsApp and email alert digests when a tenant invoice stays unpaid for 3+ days.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAi('reminders')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      aiToggles.reminders ? 'bg-emerald-500' : 'bg-ink-200 dark:bg-ink-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        aiToggles.reminders ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: vacancy */}
                <div className="flex items-center justify-between p-4 bg-ink-50/50 dark:bg-ink-900/20 border border-ink-100/50 dark:border-ink-800/40 rounded-2xl transition hover:bg-ink-50/80">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-sm font-bold text-ink-900 dark:text-ink-50">
                      Predictive Vacancy Alerts
                    </p>
                    <p className="text-xs text-ink-400 dark:text-ink-500">
                      Proactively flags high-risk tenants who may vacate based on communication histories and lease deadlines.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAi('vacancy')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      aiToggles.vacancy ? 'bg-emerald-500' : 'bg-ink-200 dark:bg-ink-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        aiToggles.vacancy ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3: autoAssign */}
                <div className="flex items-center justify-between p-4 bg-ink-50/50 dark:bg-ink-900/20 border border-ink-100/50 dark:border-ink-800/40 rounded-2xl transition hover:bg-ink-50/80">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-sm font-bold text-ink-900 dark:text-ink-50">
                      AI Vendor Auto-Assign
                    </p>
                    <p className="text-xs text-ink-400 dark:text-ink-500">
                      Instantly drafts and sends repair contracts to our trusted plumbing/electrical service list upon new tickets.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAi('autoAssign')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      aiToggles.autoAssign ? 'bg-emerald-500' : 'bg-ink-200 dark:bg-ink-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        aiToggles.autoAssign ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 4: ledgerVerify */}
                <div className="flex items-center justify-between p-4 bg-ink-50/50 dark:bg-ink-900/20 border border-ink-100/50 dark:border-ink-800/40 rounded-2xl transition hover:bg-ink-50/80">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-sm font-bold text-ink-900 dark:text-ink-50 flex items-center gap-1.5">
                      Bank Ledger Smart Matching
                      <Badge tone="warning">Experimental</Badge>
                    </p>
                    <p className="text-xs text-ink-400 dark:text-ink-500">
                      Scan incoming bank bank statements or UPI ledger records to auto-reconcile tenant payments instantly.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAi('ledgerVerify')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      aiToggles.ledgerVerify ? 'bg-emerald-500' : 'bg-ink-200 dark:bg-ink-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        aiToggles.ledgerVerify ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-6">
              <div>
                <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-500" />
                  Payout Destination Rails
                </h3>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                  Route your collected rent collections straight into your corporate accounting accounts.
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-xs font-semibold text-amber-800 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Demonstration Environment Sandbox</p>
                  <p className="mt-1 leading-relaxed opacity-90">
                    Payout triggers are mock routed to the demo AwadhLease merchant token bank. No physical currencies are routed.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                      Bank Name
                    </label>
                    <Input placeholder="e.g. HDFC Bank, Lucknow Branch" value="HDFC Bank" readOnly className="font-medium bg-ink-50/50 dark:bg-ink-900/20 text-ink-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                      IFSC Code
                    </label>
                    <Input placeholder="e.g. HDFC0001234" value="HDFC0002844" readOnly className="font-medium bg-ink-50/50 dark:bg-ink-900/20 text-ink-500" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                      Account Number
                    </label>
                    <Input placeholder="e.g. 501002938475" value="•••• •••• 9924" readOnly className="font-medium bg-ink-50/50 dark:bg-ink-900/20 text-ink-500" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="outline" className="rounded-xl flex items-center gap-1.5" disabled>
                    Configure UPI ID
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-6">
              <div>
                <h3 className="text-base font-bold font-sora text-ink-950 dark:text-ink-50 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-brand-500" />
                  Security Controls & Web Tokens
                </h3>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                  Update administrative credentials and access tokens for API keys integrations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                    Current Password
                  </label>
                  <Input type="password" placeholder="••••••••" disabled />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink-550 dark:text-ink-400 uppercase tracking-wider pl-1">
                    New Security Password
                  </label>
                  <Input type="password" placeholder="Enter new strong password" disabled />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="secondary" className="rounded-xl" disabled>
                    Update Password
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
