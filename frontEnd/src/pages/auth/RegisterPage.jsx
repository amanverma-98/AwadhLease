import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Sparkles, Building, Layers, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
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
    propertyType: 'Flat',
    totalProperties: '1',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async (e) => {
    if (e) e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password) {
      pushToast({ title: 'Missing fields', message: 'Please fill in all required fields.' })
      return
    }
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
    <div className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr] bg-[#faf8f4] dark:bg-ink-950">
      {/* Left panel: Brand Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-ink-950 via-brand-950 to-purple-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-noise-bg opacity-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header */}
        <div className="flex items-center gap-3 relative z-10 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
            alt="AwadhLease Logo"
            className="h-10 w-10 rounded-2xl object-cover shadow-soft ring-2 ring-brand-500/10"
          />
          <div>
            <span className="text-sm font-bold font-sora tracking-tight text-white">AwadhLease</span>
            <p className="text-[10px] text-brand-300 font-bold uppercase tracking-widest leading-none mt-0.5">AI Operations</p>
          </div>
        </div>

        {/* Brand Text Content */}
        <div className="space-y-6 max-w-md relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-brand-300 font-semibold shadow-inner animate-pulse">
            <Sparkles className="h-4 w-4 text-brand-400" />
            Empowered by AI Automations
          </div>
          <h2 className="text-4xl font-bold font-sora leading-tight tracking-tight">
            Unlock Property <span className="bg-gradient-to-r from-brand-300 to-emerald-300 bg-clip-text text-transparent">Operations on Autopilot.</span>
          </h2>
          <p className="text-sm text-ink-300 leading-relaxed">
            Create an owner account to list your multi-tenant spaces, manage active leases, automate billing processes, coordinate repair dispatches, and get predictive insights.
          </p>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2 text-brand-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-xs text-ink-300 leading-normal">
              10-minute setup. Free listing matching services for premium units.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel: Registration Card Form */}
      <div className="flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-8 animate-fade-in-up py-8">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-ink-950 dark:text-ink-50 font-sora mt-4">
              Get Started with Landlord Account
            </h1>
            <p className="text-xs text-ink-400 dark:text-ink-500 leading-relaxed">
              Create an institutional owner account to unlock tenant matching, billing automations, and live triage flows.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="form-label">Full Name</label>
                <Input
                  placeholder="e.g. Aman Verma"
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="form-label">Email Address</label>
                <Input
                  placeholder="name@company.com"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>

              {/* Phone */}
              <div>
                <label className="form-label">Mobile Number</label>
                <Input
                  placeholder="e.g. +91 98765 43210"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>

              {/* Password */}
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Primary Property Type */}
              <div>
                <label className="form-label">Primary Property Type</label>
                <Select
                  value={form.propertyType}
                  onChange={(e) => setForm((prev) => ({ ...prev, propertyType: e.target.value }))}
                  options={[
                    { value: 'Flat', label: 'Apartments / Flats' },
                    { value: 'PG', label: 'Co-Living / PG' },
                    { value: 'House', label: 'Independent Houses' },
                    { value: 'Commercial', label: 'Commercial Spaces' }
                  ]}
                />
              </div>

              {/* Total Properties */}
              <div>
                <label className="form-label">Estimated Properties Count</label>
                <Select
                  value={form.totalProperties}
                  onChange={(e) => setForm((prev) => ({ ...prev, totalProperties: e.target.value }))}
                  options={[
                    { value: '1', label: '1 Property / Unit' },
                    { value: '2-5', label: '2 to 5 Properties' },
                    { value: '6-15', label: '6 to 15 Properties' },
                    { value: '16+', label: '16+ Institutional Units' }
                  ]}
                />
              </div>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                {authError}
              </div>
            )}

            <Button className="w-full py-3 shadow-glow" type="submit" loading={isLoading}>
              Create Landlord Account
            </Button>
          </form>

          {/* Alternative Actions */}
          <div className="text-center space-y-3 pt-4 border-t border-ink-100 dark:border-ink-800/40">
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Already have an account?
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold"
              onClick={() => navigate('/auth/login')}
            >
              Sign In to Your Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
