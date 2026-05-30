import React from 'react'
import { Card } from './ui/card'
import { Inbox } from 'lucide-react'

export function EmptyState({ title, description, icon: Icon = Inbox, action }) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-ink-200 dark:border-ink-800 bg-ink-50/10 dark:bg-ink-950/5 rounded-3xl">
      <div className="p-4 rounded-2xl bg-ink-50 dark:bg-ink-900/60 text-ink-400 dark:text-ink-555 mb-4">
        <Icon className="h-8 w-8 text-ink-400 dark:text-ink-500" />
      </div>
      <h3 className="text-base font-bold text-ink-900 dark:text-ink-50 font-sora">
        {title}
      </h3>
      <p className="text-xs text-ink-500 dark:text-ink-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="animate-fade-in-up">{action}</div>}
    </Card>
  )
}
