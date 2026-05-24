import { Sparkles } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

export function InsightCard({ insight }) {
  const tone =
    insight.status === 'critical'
      ? 'danger'
      : insight.status === 'warning'
        ? 'warning'
        : 'info'
  const confidence = insight.confidence ?? null
  const detail = insight.detail || insight.title

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
          <Sparkles className="h-4 w-4 text-brand-500" />
          AI Insight
        </div>
        {confidence !== null ? (
          <Badge tone={tone}>{confidence}% confidence</Badge>
        ) : (
          <Badge tone={tone}>Live</Badge>
        )}
      </div>
      <p className="text-sm text-ink-600">{detail}</p>
    </Card>
  )
}
