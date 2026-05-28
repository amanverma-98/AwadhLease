export function ActivityList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white/70 px-4 py-6 text-center text-sm text-ink-500">
        No recent activity yet.
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white/80 px-4 py-3 text-sm"
        >
          <p className="font-semibold text-ink-700">{item.title}</p>
          <span className="text-xs text-ink-400">{item.time}</span>
        </div>
      ))}
    </div>
  )
}
