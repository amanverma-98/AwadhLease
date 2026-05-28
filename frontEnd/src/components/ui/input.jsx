import { cn } from '../../utils/cn'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-ink-200 bg-white/90 px-4 py-2.5 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200',
        className
      )}
      {...props}
    />
  )
}
