export function LoadingSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="h-4 w-full animate-pulse rounded-full bg-ink-200"
        />
      ))}
    </div>
  )
}
