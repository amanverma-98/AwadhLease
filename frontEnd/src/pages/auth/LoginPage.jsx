import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowLeft, Landmark, Zap } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useUserStore } from '../../store/useUserStore'
import { useNotificationStore } from '../../store/useNotificationStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { loginWithCredentials, isLoading, authError } = useUserStore()
  const { pushToast } = useNotificationStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
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
    <div className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr] bg-[#faf8f4] dark:bg-ink-950">
      {/* Left panel: Brand Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-ink-950 to-brand-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-noise-bg opacity-10 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-brand-300 font-semibold shadow-inner">
            <ShieldCheck className="h-4 w-4 text-brand-400" />
            Highly Secured Vault Storage
          </div>
          <h2 className="text-4xl font-bold font-sora leading-tight tracking-tight">
            Security. Velocity. <span className="bg-gradient-to-r from-brand-300 to-purple-300 bg-clip-text text-transparent">Rent Automation.</span>
          </h2>
          <p className="text-sm text-ink-300 leading-relaxed">
            Welcome back to the command center. Oversee active leases, automate billing processes, coordinate contractor dispatches, and review automated background screening instantly.
          </p>
        </div>

        {/* Footer info / Testimonial inside left panel */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2 text-brand-300">
              <Zap className="h-4 w-4" />
            </div>
            <p className="text-xs text-ink-300 leading-normal">
              Managing properties on auto-pilot since 2024. Secured via banking grade KYC algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel: Login Card Form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-ink-950 dark:text-ink-50 font-sora mt-4">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-ink-400 dark:text-ink-500 leading-relaxed">
              Access your personalized property workspace, dashboard overview, analytics, and messaging channels.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="form-label">Email Address</label>
              <Input
                placeholder="you@domain.com"
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300">Password</label>
                <button
                  type="button"
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  onClick={() => navigate('/auth/forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {authError}
              </div>
            )}

            <Button className="w-full py-3 shadow-glow" type="submit" loading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Alternative Actions */}
          <div className="text-center space-y-3 pt-4 border-t border-ink-100 dark:border-ink-800/40">
            <p className="text-xs text-ink-500 dark:text-ink-400">
              Don't have a landlord workspace?
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold"
              onClick={() => navigate('/auth/register')}
            >
              Create Landlord Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
