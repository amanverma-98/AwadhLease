import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { formatRupee } from '../../utils/format'
import { listProperties, createProperty } from '../../services/propertyService'
import { mapPropertyFromApi, mapPropertyToCreatePayload } from '../../utils/propertyMapper'
import { useNotificationStore } from '../../store/useNotificationStore'

export function PropertiesPage() {
  const { pushToast } = useNotificationStore()
  const [open, setOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    address: '',
    locality: '',
    propertyType: 'Flat',
    monthlyRent: '',
    bhk: '',
    furnished: 'true',
    occupancyStatus: 'available',
    amenities: '',
    rules: '',
    description: ''
  })

  const loadProperties = async () => {
    setLoading(true)
    try {
      const data = await listProperties({ limit: 100 })
      setProperties(data.map(mapPropertyFromApi))
    } catch (error) {
      pushToast({ title: 'Load failed', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleCreate = async () => {
    try {
      await createProperty(mapPropertyToCreatePayload(form))
      pushToast({ title: 'Property added', message: 'Listing saved to backend.' })
      setOpen(false)
      setForm({
        name: '',
        address: '',
        locality: '',
        propertyType: 'Flat',
        monthlyRent: '',
        bhk: '',
        furnished: 'true',
        occupancyStatus: 'available',
        amenities: '',
        rules: '',
        description: ''
      })
      loadProperties()
    } catch (error) {
      pushToast({ title: 'Save failed', message: error.message })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Properties</h2>
          <p className="text-sm text-ink-500">
            Manage listings, occupancy, and AI-powered pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-2">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              className="bg-transparent text-sm text-ink-700 focus:outline-none"
              placeholder="Search properties"
            />
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add property
          </Button>
        </div>
      </div>

      {loading && <p className="text-sm text-ink-500">Loading properties...</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="p-5">
            <div
              className="mb-4 h-32 rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: `url(${property.image})` }}
            />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {property.title}
                </p>
                <p className="text-xs text-ink-500">{property.location}</p>
              </div>
              <Badge tone={property.status === 'Available' ? 'success' : 'info'}>
                {property.status}
              </Badge>
            </div>
            <div className="mt-4 space-y-2 text-xs text-ink-600">
              <div>Type: {property.type}</div>
              <div>Occupancy: {property.occupancy}</div>
              <div>Monthly rent: {formatRupee(property.rent)}</div>
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-6">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink-900">
                Add a new property
              </h3>
              <button
                className="text-sm font-semibold text-ink-500"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Property name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
              <Input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              />
              <Input
                placeholder="Locality"
                value={form.locality}
                onChange={(e) => setForm((p) => ({ ...p, locality: e.target.value }))}
              />
              <Input
                placeholder="Property type (Flat, PG, House)"
                value={form.propertyType}
                onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
              />
              <Input
                placeholder="Monthly rent"
                value={form.monthlyRent}
                onChange={(e) => setForm((p) => ({ ...p, monthlyRent: e.target.value }))}
              />
              <Input
                placeholder="BHK (number)"
                value={form.bhk}
                onChange={(e) => setForm((p) => ({ ...p, bhk: e.target.value }))}
              />
            </div>
            <Textarea
              className="mt-4"
              rows={3}
              placeholder="Rules (one per line)"
              value={form.rules}
              onChange={(e) => setForm((p) => ({ ...p, rules: e.target.value }))}
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Save property</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
