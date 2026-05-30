import React from 'react'

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-ink-100 dark:border-ink-850">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-950 dark:text-ink-50 font-sora">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 font-medium">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  )
}
