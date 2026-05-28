import { cn } from '../../utils/cn'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ink-100 bg-white/80 shadow-soft backdrop-blur',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-6 pb-3', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('px-6 pb-6', className)} {...props} />
}
