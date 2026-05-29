import { Badge } from './ui/badge'
import { AlertCircle, User, Calendar, ShieldCheck, ShieldAlert, Sparkles, PhoneCall } from 'lucide-react'
import { cn } from '../utils/cn'

export function TenantTable({ items }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-100/80 dark:border-ink-800 bg-white/70 dark:bg-ink-950/60 shadow-soft backdrop-blur-md animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-ink-100 dark:border-ink-800/80 bg-ink-50/60 dark:bg-ink-900/30 text-[10px] font-bold uppercase tracking-widest text-ink-400 dark:text-ink-500">
              <th className="px-5 py-4">Tenant profile</th>
              <th className="px-5 py-4">Assigned Unit</th>
              <th className="px-5 py-4">Lease Term</th>
              <th className="px-5 py-4">Payment state</th>
              <th className="px-5 py-4">AI Risk score</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100/50 dark:divide-ink-800/20">
            {items.map((tenant) => {
              const risk = Number(tenant.riskScore) || 20
              return (
                <tr 
                  key={tenant.id} 
                  className="hover:bg-ink-50/40 dark:hover:bg-ink-900/10 transition-colors duration-150 group"
                >
                  {/* Name and details */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm">
                        {tenant.name ? tenant.name[0].toUpperCase() : 'T'}
                      </div>
                      <div>
                        <p className="font-bold text-ink-900 dark:text-ink-100 tracking-tight leading-snug group-hover:text-brand-600 transition-colors">
                          {tenant.name}
                        </p>
                        <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">{tenant.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Property unit info */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink-800 dark:text-ink-200">{tenant.property || 'Unit Fallback'}</p>
                    <p className="text-[10px] uppercase font-bold text-ink-400 dark:text-ink-500 mt-0.5 tracking-wider">Lucknow</p>
                  </td>

                  {/* Lease duration */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-ink-600 dark:text-ink-400 text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5 text-ink-400" />
                      <span>{tenant.lease || 'N/A'}</span>
                    </div>
                  </td>

                  {/* Payment status badge */}
                  <td className="px-5 py-4">
                    <Badge
                      tone={
                        tenant.paymentStatus === 'Paid' ? 'success' :
                        tenant.paymentStatus === 'Delayed' ? 'danger' :
                        'warning'
                      }
                      size="sm"
                      className="font-bold tracking-wide"
                    >
                      {tenant.paymentStatus}
                    </Badge>
                  </td>

                  {/* AI Risk badge color codes */}
                  <td className="px-5 py-4">
                    <Badge 
                      tone={risk < 30 ? 'success' : risk < 65 ? 'info' : 'danger'}
                      size="sm"
                      className="font-bold flex items-center gap-1 w-fit"
                    >
                      {risk < 30 ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      <span>{risk}% {risk < 30 ? 'Safe' : risk < 65 ? 'Medium' : 'High'}</span>
                    </Badge>
                  </td>

                  {/* Interactive actions row column */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-1.5 rounded-lg border border-ink-100 dark:border-ink-800 text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/5 transition shadow-sm"
                        onClick={() => window.open(`tel:${tenant.phone || ''}`)}
                        title="Contact Tenant"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
