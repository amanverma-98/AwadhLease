import { Card } from './ui/card'

export function KpiCard({ label, value, delta }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold text-ink-900">{value}</p>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
          {delta}
        </span>
      </div>
    </Card>
  )
}
