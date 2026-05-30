import { cn } from '../../utils/cn'

export function Select({ className, children, options, ...props }) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          'w-full rounded-2xl border border-ink-200 dark:border-ink-800 bg-white/90 dark:bg-ink-950 px-4 py-2.5 pr-10 text-sm text-ink-900 dark:text-ink-50 shadow-sm focus:border-brand-400 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900 appearance-none cursor-pointer font-medium',
          className
        )}
        {...props}
      >
        {options ? (
          options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-ink-950 text-ink-900 dark:text-ink-50 font-medium">
              {opt.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-500 dark:text-ink-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
