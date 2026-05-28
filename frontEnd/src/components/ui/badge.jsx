import { cn } from '../../utils/cn'

export function Badge({ className, tone = 'default', ...props }) {
  const tones = {
    default: 'bg-ink-100 text-ink-700',
    success: 'bg-emerald-500/15 text-emerald-600',
    warning: 'bg-amber-500/15 text-amber-700',
    danger: 'bg-rose-500/15 text-rose-600',
    info: 'bg-brand-500/15 text-brand-600'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        tones[tone],
        className
      )}
      {...props}
    />
  )
}
