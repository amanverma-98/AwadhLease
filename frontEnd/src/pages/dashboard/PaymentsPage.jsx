import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { PageHeader } from '../../components/PageHeader'
import { listPayments } from '../../services/paymentService'
import { listTenants } from '../../services/tenantService'
import { listProperties } from '../../services/propertyService'
import { formatRupee } from '../../utils/format'
import { useNotificationStore } from '../../store/useNotificationStore'
import { Download, Filter, X } from 'lucide-react'

const statusOptions = ['paid', 'pending', 'failed', 'success', 'completed']

export function PaymentsPage() {
  const { pushToast } = useNotificationStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [tenants, setTenants] = useState([])
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({
    tenantId: '',
    propertyId: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  const propertyMap = useMemo(
    () => Object.fromEntries(properties.map((p) => [p.id, p.name])),
    [properties]
  )
  const tenantMap = useMemo(
    () => Object.fromEntries(tenants.map((t) => [t.id, t.full_name || t.name])),
    [tenants]
  )

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [tenantData, propertyData] = await Promise.all([
          listTenants({ limit: 200, include_inactive: true }),
          listProperties({ limit: 200, mine: true })
        ])
        setTenants(tenantData)
        setProperties(propertyData)
      } catch (error) {
        pushToast({ title: 'Load failed', message: error.message })
      }
    }
    loadMeta()
  }, [pushToast])

  const loadPayments = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 200,
        tenant_id: filters.tenantId || undefined,
        property_id: filters.propertyId || undefined,
        status: filters.status || undefined,
        date_from: filters.dateFrom ? new Date(filters.dateFrom).toISOString() : undefined,
        date_to: filters.dateTo ? new Date(filters.dateTo).toISOString() : undefined
      }
      const data = await listPayments(params)
      setItems(data)
    } catch (error) {
      pushToast({ title: 'Load failed', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const resetFilters = () => {
    setFilters({ tenantId: '', propertyId: '', status: '', dateFrom: '', dateTo: '' })
    setTimeout(() => loadPayments(), 0)
  }

  const exportCsv = () => {
    if (!items.length) {
      pushToast({ title: 'No records', message: 'There are no payments to export.' })
      return
    }

    const header = [
      'Payment ID',
      'Tenant',
      'Property',
      'Amount',
      'Status',
      'Payment Date',
      'Transaction ID'
    ]
    const rows = items.map((item) => [
      item.id,
      tenantMap[item.tenant_id] || item.tenant_id,
      propertyMap[item.property_id] || item.property_id,
      item.amount,
      item.payment_status,
      item.payment_date,
      item.transaction_id || ''
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'awadhlease-payments.csv'
    link.click()
    URL.revokeObjectURL(url)
    pushToast({ title: 'Export ready', message: 'Payment CSV downloaded.' })
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <PageHeader
        title="Payments & Transactions"
        description="Filter payment history by tenant or property and export reports."
        actions={(
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={exportCsv} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        )}
      />

      <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-400">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Select
            value={filters.tenantId}
            onChange={(e) => setFilters((prev) => ({ ...prev, tenantId: e.target.value }))}
          >
            <option value="">All tenants</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.full_name || tenant.email}
              </option>
            ))}
          </Select>
          <Select
            value={filters.propertyId}
            onChange={(e) => setFilters((prev) => ({ ...prev, propertyId: e.target.value }))}
          >
            <option value="">All properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </Select>
          <Select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
            placeholder="From"
          />
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
            placeholder="To"
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button onClick={loadPayments}>Apply filters</Button>
          <Button variant="ghost" onClick={resetFilters} className="flex items-center gap-1.5">
            <X className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </Card>

      <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
            Payment history
          </h3>
          <Badge className="text-[10px] uppercase tracking-wider font-bold" tone="info">
            {items.length} records
          </Badge>
        </div>

        <div className="mt-4 space-y-3">
          {loading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-ink-50 dark:bg-ink-900 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30 px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-ink-100">
                    {tenantMap[item.tenant_id] || 'Tenant'}
                  </p>
                  <p className="text-xs text-ink-400">
                    {propertyMap[item.property_id] || item.property_id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink-900 dark:text-ink-100">
                    {formatRupee(item.amount)}
                  </p>
                  <p className="text-[10px] text-ink-400">
                    {new Date(item.payment_date).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                <Badge tone="info" className="text-[10px] uppercase tracking-wider font-bold">
                  {item.payment_status}
                </Badge>
                {item.transaction_id && (
                  <span className="font-mono text-[10px]">Txn: {item.transaction_id}</span>
                )}
              </div>
            </div>
          ))}

          {!loading && !items.length && (
            <p className="text-xs text-ink-500">No payments found for the selected filters.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
