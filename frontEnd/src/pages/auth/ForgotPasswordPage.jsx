import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { ArrowLeft, KeyRound, Sparkles } from 'lucide-react'
import { requestPasswordReset } from '../../services/authService'
import { useNotificationStore } from '../../store/useNotificationStore'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { pushToast } = useNotificationStore()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!email) {
      pushToast({ title: 'Missing email', message: 'Enter your email address.' })
      return
    }
    setSubmitting(true)
    try {
      await requestPasswordReset(email)
      pushToast({ title: 'Reset link sent', message: 'Check your inbox for a secure token link.' })
      setEmail('')
      navigate('/auth/login')
    } catch (error) {
      pushToast({ title: 'Request failed', message: error.message || 'Verification system offline.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] dark:bg-ink-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8 relative z-10 cursor-pointer" onClick={() => navigate('/')}>
        <img
          src="/Gemini_Generated_Image_jy8lqtjy8lqtjy8l.png"
          alt="AwadhLease Logo"
          className="h-9 w-9 rounded-xl object-cover shadow-soft"
        />
        <span className="text-sm font-bold font-sora tracking-tight text-ink-950 dark:text-ink-50">AwadhLease</span>
      </div>

      <div className="w-full max-w-md rounded-[32px] border border-ink-100 dark:border-ink-800 bg-white/80 dark:bg-ink-900/60 p-8 shadow-card backdrop-blur-md relative z-10 animate-fade-in-up">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 mb-6">
          <KeyRound className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold text-ink-950 dark:text-ink-50 font-sora">
          Trouble signing in?
        </h1>
        <p className="mt-2 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
          Enter your registered email below, and we will dispatch a secure one-time password reset token to your inbox immediately.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="form-label text-xs">Registered Email Address</label>
            <Input
              placeholder="you@domain.com"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          
          <Button className="w-full py-3" type="submit" loading={submitting}>
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-ink-100 dark:border-ink-800/40 text-center">
          <button
            onClick={() => navigate('/auth/login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
