import React from 'react'
import { Card } from './ui/card'
import { cn } from '../utils/cn'

export function StatCard({ title, value, icon: Icon, trend, description, tone = 'default' }) {
  const tones = {
    default: 'bg-white dark:bg-ink-950 border-ink-100 dark:border-ink-800 text-ink-950 dark:text-ink-50',
    primary: 'bg-brand-500 text-white border-transparent',
    emerald: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-950 dark:text-emerald-50',
    rose: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-950 dark:text-rose-50',
    amber: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-950 dark:text-amber-50',
  }

  return (
    <Card className={cn("p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5", tones[tone])}>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-bold uppercase tracking-wider", tone === 'primary' ? 'text-brand-100' : 'text-ink-400 dark:text-ink-500')}>
          {title}
        </span>
        {Icon && (
          <div className={cn("p-2 rounded-xl flex items-center justify-center", 
            tone === 'primary' 
              ? 'bg-white/10 text-white' 
              : 'bg-ink-50 dark:bg-ink-900/50 text-ink-600 dark:text-ink-400'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight font-sora">
          {value}
        </h3>
        {(trend || description) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {trend && (
              <span className={cn(
                "font-bold rounded-full px-2 py-0.5 flex items-center gap-0.5",
                trend.startsWith('+') 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : trend.startsWith('-')
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-ink-500/10 text-ink-600 dark:text-ink-400'
              )}>
                {trend}
              </span>
            )}
            {description && (
              <span className={cn("font-medium", tone === 'primary' ? 'text-brand-100' : 'text-ink-400 dark:text-ink-500')}>
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
