import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { formatRupee } from '../utils/format'
import { Wrench, UserCheck, Check, AlertTriangle, ShieldCheck, Activity } from 'lucide-react'
import { cn } from '../utils/cn'

export function MaintenanceCard({ ticket, onResolve, onAssign }) {
  const isUrgent = ticket.priority?.toLowerCase() === 'urgent' || ticket.priority?.toLowerCase() === 'high'
  const isMedium = ticket.priority?.toLowerCase() === 'medium' || ticket.priority?.toLowerCase() === 'average'
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden p-5 transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]",
        isUrgent && 'before:bg-rose-500 bg-rose-50/10 dark:bg-rose-950/5',
        isMedium && 'before:bg-gold-500 bg-gold-50/10 dark:bg-gold-950/5',
        !isUrgent && !isMedium && 'before:bg-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-ink-950 dark:text-ink-50 font-sora tracking-tight leading-snug">
            {ticket.title}
          </h4>
          <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 mt-1 flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" />
            {ticket.property || 'Assigned Property Layout'}
          </p>
        </div>
        
        <Badge 
          tone={
            ticket.status === 'Resolved' ? 'success' :
            ticket.status === 'In Progress' ? 'info' :
            'warning'
          }
          size="sm"
          className="font-bold tracking-wide"
        >
          {ticket.status}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 text-xs font-bold text-ink-600 dark:text-ink-400 md:grid-cols-2 lg:grid-cols-4 bg-ink-50/50 dark:bg-ink-900/20 p-3.5 rounded-2xl border border-ink-100/50 dark:border-ink-800/40">
        <div>
          <span className="text-[10px] font-bold text-ink-400 block mb-0.5 uppercase tracking-wider">Category</span>
          <span className="text-ink-800 dark:text-ink-200">{ticket.category}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-ink-400 block mb-0.5 uppercase tracking-wider">Priority</span>
          <span className={cn(
            isUrgent && "text-rose-600 dark:text-rose-400",
            isMedium && "text-gold-600 dark:text-gold-400",
            !isUrgent && !isMedium && "text-emerald-600 dark:text-emerald-400"
          )}>
            {ticket.priority}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-ink-400 block mb-0.5 uppercase tracking-wider">Assigned Contractor</span>
          <span className="text-ink-800 dark:text-ink-200">{ticket.vendor || 'AI Auto-Assigning'}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-ink-400 block mb-0.5 uppercase tracking-wider">Estimated Budget</span>
          <span className="text-brand-600 dark:text-brand-400">{formatRupee(ticket.cost)}</span>
        </div>
      </div>

      {ticket.summary && (
        <p className="mt-4 text-xs text-ink-500 dark:text-ink-400 leading-relaxed font-medium">
          {ticket.summary}
        </p>
      )}

      {/* Steps or Updates timeline */}
      {ticket.timeline && ticket.timeline.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {ticket.timeline.map((step) => (
            <Badge key={step} tone="default" size="sm" className="bg-ink-100/50 text-ink-500 text-[9px] uppercase tracking-wider">
              {step}
            </Badge>
          ))}
        </div>
      )}

      {/* Standard Action buttons per maintenance ticket */}
      {ticket.status !== 'Resolved' && (
        <div className="mt-5 pt-4 border-t border-ink-100/50 dark:border-ink-800/30 flex justify-end gap-2.5">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAssign}
            className="text-xs font-semibold hover:border-brand-500"
          >
            <UserCheck className="h-3.5 w-3.5 mr-1" />
            Assign Vendor
          </Button>
          <Button 
            size="sm" 
            onClick={onResolve}
            className="text-xs font-semibold shadow-sm"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Resolve Issue
          </Button>
        </div>
      )}
    </Card>
  )
}
