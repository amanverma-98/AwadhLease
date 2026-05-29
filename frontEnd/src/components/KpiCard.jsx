import { StatCard } from './StatCard'

export function KpiCard({ label, value, delta }) {
  return (
    <StatCard
      title={label}
      value={value}
      trend={delta}
      description="since last month"
    />
  )
}

