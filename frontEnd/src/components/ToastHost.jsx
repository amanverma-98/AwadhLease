import { useEffect } from 'react'
import { useNotificationStore } from '../store/useNotificationStore'

export function ToastHost() {
  const { toasts, removeToast } = useNotificationStore()

  useEffect(() => {
    if (!toasts.length) return
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3200)
    )
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [toasts, removeToast])

  return (
    <div className="fixed right-6 top-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-panel rounded-2xl px-4 py-3 text-sm font-semibold text-ink-900 shadow-card"
        >
          <p>{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-xs font-normal text-ink-500">
              {toast.message}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
