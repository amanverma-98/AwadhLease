export function ActivityList({ items }) {
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
