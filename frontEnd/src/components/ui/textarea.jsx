import { cn } from '../../utils/cn'

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-2xl border border-ink-200 bg-white/90 px-4 py-3 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200',
        className
      )}
      {...props}
    />
  )
}
