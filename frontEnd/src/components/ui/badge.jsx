import { cn } from '../../utils/cn'

export function Badge({ className, tone = 'default', size = 'md', ...props }) {
  const tones = {
    default: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
    warning: 'bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400 border border-gold-100 dark:border-gold-900/30',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30',
    info: 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/30',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-full font-sans tracking-wide transition-colors',
        tones[tone],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
