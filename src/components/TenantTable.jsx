import { Badge } from './ui/badge'

export function TenantTable({ items }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white/80">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-50 text-xs uppercase text-ink-500">
          <tr>
            <th className="px-4 py-3">Tenant</th>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Lease</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {items.map((tenant) => (
            <tr key={tenant.id} className="border-t border-ink-100">
              <td className="px-4 py-3 font-semibold text-ink-800">
                {tenant.name}
                <div className="text-xs text-ink-400">{tenant.email}</div>
              </td>
              <td className="px-4 py-3 text-ink-600">{tenant.property}</td>
              <td className="px-4 py-3 text-ink-600">{tenant.lease}</td>
              <td className="px-4 py-3">
                <Badge
                  tone={tenant.paymentStatus === 'Delayed' ? 'warning' : 'success'}
                >
                  {tenant.paymentStatus}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={tenant.riskScore > 60 ? 'danger' : 'info'}>
                  {tenant.riskScore}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
