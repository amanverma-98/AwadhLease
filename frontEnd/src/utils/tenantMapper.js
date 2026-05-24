export function mapTenantFromApi(tenant, propertyName = '') {
  const leaseStart = tenant.lease_start
    ? new Date(tenant.lease_start).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      })
    : ''
  const leaseEnd = tenant.lease_end
    ? new Date(tenant.lease_end).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      })
    : ''

  return {
    id: tenant.id,
    name: tenant.full_name,
    property: propertyName || tenant.property_id,
    lease: leaseStart && leaseEnd ? `${leaseStart} - ${leaseEnd}` : '—',
    paymentStatus:
      tenant.rent_status === 'overdue' ? 'Delayed' : tenant.rent_status || 'On Time',
    riskScore: tenant.rent_status === 'overdue' ? 72 : 24,
    phone: tenant.phone,
    email: tenant.email,
    propertyId: tenant.property_id,
    _raw: tenant
  }
}

export function dedupeTenants(tenants = []) {
  const seen = new Map()
  const result = []
  for (const tenant of tenants) {
    const raw = tenant?._raw || tenant
    const key = [
      (raw?.email || tenant?.email || '').trim().toLowerCase(),
      (raw?.phone || tenant?.phone || '').trim().toLowerCase(),
      (raw?.full_name || tenant?.name || '').trim().toLowerCase(),
      String(raw?.property_id || tenant?.propertyId || '')
    ].join('|')
    if (!key || seen.has(key)) continue
    seen.set(key, true)
    result.push(tenant)
  }
  return result
}
