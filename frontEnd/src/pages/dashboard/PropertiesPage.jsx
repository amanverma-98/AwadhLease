import { useEffect, useRef, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { formatRupee } from '../../utils/format'
import { listProperties, createProperty } from '../../services/propertyService'
import { uploadImage } from '../../services/uploadService'
import {
  dedupeProperties,
  mapPropertyFromApi,
  mapPropertyToCreatePayload
} from '../../utils/propertyMapper'
import { useNotificationStore } from '../../store/useNotificationStore'

export function PropertiesPage() {
  const { pushToast } = useNotificationStore()
  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: 'Lucknow',
    locality: '',
    propertyType: 'Flat',
    monthlyRent: '',
    bhk: '',
    furnished: 'false',
    occupancyStatus: 'available',
    securityDeposit: '',
    availableFrom: '',
    imageUrls: [],
    amenities: '',
    rules: '',
    description: '',
    parking: false,
    wifi: false,
    ac: false,
    petFriendly: false
  })

  const loadProperties = async () => {
    setLoading(true)
    try {
      const data = await listProperties({ limit: 100 })
      setProperties(dedupeProperties(data.map(mapPropertyFromApi)))
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
    if (!form.name || !form.address || !form.propertyType || !form.monthlyRent) {
      pushToast({
        title: 'Missing details',
        message: 'Add name, address, property type, and monthly rent.'
      })
      return
    }
    try {
      await createProperty(mapPropertyToCreatePayload(form))
      pushToast({ title: 'Property added', message: 'Listing saved to backend.' })
      setOpen(false)
      setForm({
        name: '',
        address: '',
        city: 'Lucknow',
        locality: '',
        propertyType: 'Flat',
        monthlyRent: '',
        bhk: '',
        furnished: 'false',
        occupancyStatus: 'available',
        securityDeposit: '',
        availableFrom: '',
        imageUrls: [],
        amenities: '',
        rules: '',
        description: '',
        parking: false,
        wifi: false,
        ac: false,
        petFriendly: false
      })
      loadProperties()
    } catch (error) {
      pushToast({ title: 'Save failed', message: error.message })
    }
  }

  const handleImageSelect = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setIsUploading(true)
    try {
      const uploads = []
      for (const file of files) {
        const result = await uploadImage(file)
        uploads.push(result.url)
      }
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploads]
      }))
      pushToast({ title: 'Images uploaded', message: 'Property images saved.' })
    } catch (error) {
      pushToast({ title: 'Upload failed', message: error.message })
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleRemoveImage = (url) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((item) => item !== url)
    }))
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/40 p-6">
          <Card className="max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6">
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
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              />
              <Input
                placeholder="Locality"
                value={form.locality}
                onChange={(e) => setForm((p) => ({ ...p, locality: e.target.value }))}
              />
              <select
                className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700"
                value={form.propertyType}
                onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
              >
                <option>Flat</option>
                <option>House</option>
                <option>PG</option>
                <option>Commercial</option>
              </select>
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
              <select
                className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700"
                value={form.furnished}
                onChange={(e) => setForm((p) => ({ ...p, furnished: e.target.value }))}
              >
                <option value="false">Unfurnished</option>
                <option value="true">Furnished</option>
              </select>
              <select
                className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700"
                value={form.occupancyStatus}
                onChange={(e) =>
                  setForm((p) => ({ ...p, occupancyStatus: e.target.value }))
                }
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="family">Family</option>
              </select>
              <Input
                placeholder="Security deposit"
                value={form.securityDeposit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, securityDeposit: e.target.value }))
                }
              />
              <Input
                type="date"
                value={form.availableFrom}
                onChange={(e) =>
                  setForm((p) => ({ ...p, availableFrom: e.target.value }))
                }
              />
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="w-full rounded-3xl border border-dashed border-ink-200 bg-white px-4 py-6 text-sm font-semibold text-ink-600 transition hover:border-brand-300 hover:text-brand-600"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading images...' : 'Click to upload property images'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              {form.imageUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {form.imageUrls.map((url) => (
                    <div
                      key={url}
                      className="relative overflow-hidden rounded-2xl shadow-soft"
                    >
                      <img
                        src={url}
                        alt="Uploaded property"
                        className="h-20 w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-ink-900/70 p-1 text-white"
                        onClick={() => handleRemoveImage(url)}
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Textarea
                rows={3}
                placeholder="Amenities (comma separated)"
                value={form.amenities}
                onChange={(e) => setForm((p) => ({ ...p, amenities: e.target.value }))}
              />
              <Textarea
                rows={3}
                placeholder="Rules (one per line)"
                value={form.rules}
                onChange={(e) => setForm((p) => ({ ...p, rules: e.target.value }))}
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Textarea
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="mt-4 grid gap-3 text-xs font-semibold text-ink-600 md:grid-cols-4">
              <label className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.parking}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, parking: e.target.checked }))
                  }
                />
                Parking
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.wifi}
                  onChange={(e) => setForm((p) => ({ ...p, wifi: e.target.checked }))}
                />
                WiFi
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.ac}
                  onChange={(e) => setForm((p) => ({ ...p, ac: e.target.checked }))}
                />
                AC
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.petFriendly}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, petFriendly: e.target.checked }))
                  }
                />
                Pet friendly
              </label>
            </div>
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
