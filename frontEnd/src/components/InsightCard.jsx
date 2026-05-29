import { Sparkles, AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { cn } from '../utils/cn'

export function InsightCard({ insight, onAction, actionText }) {
  const tone =
    insight.status === 'critical'
      ? 'danger'
      : insight.status === 'warning'
        ? 'warning'
        : 'info'
        
  const borderColors = {
    info: 'border-l-brand-500 before:bg-brand-500',
    warning: 'border-l-gold-500 before:bg-gold-500',
    danger: 'border-l-rose-500 before:bg-rose-500'
  }

  const icons = {
    info: <Info className="h-4.5 w-4.5 text-brand-500" />,
    warning: <AlertTriangle className="h-4.5 w-4.5 text-gold-500" />,
    danger: <AlertCircle className="h-4.5 w-4.5 text-rose-500" />
  }

  const confidence = insight.confidence ?? null
  const detail = insight.detail || insight.title

  return (
    <Card 
      className={cn(
        "relative overflow-hidden p-5 transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]",
        insight.status === 'critical' && 'before:bg-rose-500 bg-rose-50/10 dark:bg-rose-950/5',
        insight.status === 'warning' && 'before:bg-gold-500 bg-gold-50/10 dark:bg-gold-950/5',
        insight.status !== 'critical' && insight.status !== 'warning' && 'before:bg-brand-500'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          {icons[insight.status] || <Sparkles className="h-4.5 w-4.5 text-brand-500" />}
          <span>AI Engine Insight</span>
        </div>
        {confidence !== null ? (
          <Badge tone={tone} size="sm">{confidence}% confidence</Badge>
        ) : (
          <Badge tone={tone} size="sm">Real-time</Badge>
        )}
      </div>

      <div className="mt-3.5">
        <h4 className="text-sm font-bold text-ink-950 dark:text-ink-50 font-sora tracking-tight leading-snug">
          {insight.title}
        </h4>
        {detail !== insight.title && (
          <p className="mt-1.5 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
            {detail}
          </p>
        )}
      </div>

      {(onAction || actionText) && (
        <div className="mt-4 pt-4 border-t border-ink-100/50 dark:border-ink-800/30 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAction}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 p-0 hover:bg-transparent flex items-center gap-1 group"
          >
            {actionText || 'Take Action'}
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      )}
    </Card>
  )
}
