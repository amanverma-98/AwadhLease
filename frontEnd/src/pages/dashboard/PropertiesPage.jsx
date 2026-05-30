import { useEffect, useRef, useState } from 'react'
import { Plus, Search, X, SlidersHorizontal, Grid, List, Building, Upload, Check } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import { PageHeader } from '../../components/PageHeader'
import { formatRupee } from '../../utils/format'
import { listProperties, createProperty } from '../../services/propertyService'
import { uploadImage } from '../../services/uploadService'
import { PropertyCard } from '../../components/PropertyCard'
import { EmptyState } from '../../components/EmptyState'
import {
  dedupeProperties,
  mapPropertyFromApi,
  mapPropertyToCreatePayload
} from '../../utils/propertyMapper'
import { useNotificationStore } from '../../store/useNotificationStore'
import { cn } from '../../utils/cn'

export function PropertiesPage() {
  const { pushToast } = useNotificationStore()
  const fileInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: 'Lucknow',
    locality: '',
    propertyType: 'Flat',
    monthlyRent: '',
    bhk: '2 BHK',
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
      const data = await listProperties({ limit: 100, mine: true })
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
      pushToast({ title: 'Property saved', message: 'Successfully added property to operations.' })
      setOpen(false)
      setForm({
        name: '',
        address: '',
        city: 'Lucknow',
        locality: '',
        propertyType: 'Flat',
        monthlyRent: '',
        bhk: '2 BHK',
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

  // Filter listings locally for reactive responsive feeling
  const filteredProperties = properties.filter(prop => 
    prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    prop.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const headerActions = (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-2xl border border-ink-200 dark:border-ink-800 bg-white/60 dark:bg-ink-900 px-3.5 py-2 text-sm shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
        <Search className="h-4 w-4 text-ink-400" />
        <input
          className="bg-transparent text-xs text-ink-700 dark:text-ink-300 placeholder:text-ink-400 focus:outline-none w-28 sm:w-44"
          placeholder="Filter properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid / List view toggle */}
      <div className="hidden sm:flex border border-ink-200 dark:border-ink-800 rounded-2xl p-1 bg-white/60 dark:bg-ink-900">
        <button
          onClick={() => setViewMode('grid')}
          className={cn("p-1.5 rounded-xl transition", viewMode === 'grid' ? "bg-brand-500/15 text-brand-600" : "text-ink-400 hover:text-ink-700")}
        >
          <Grid className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={cn("p-1.5 rounded-xl transition", viewMode === 'list' ? "bg-brand-500/15 text-brand-600" : "text-ink-400 hover:text-ink-700")}
        >
          <List className="h-4.5 w-4.5" />
        </button>
      </div>

      <Button onClick={() => setOpen(true)} className="gap-1.5 font-semibold text-xs shadow-md shadow-brand-500/10 whitespace-nowrap">
        <Plus className="h-4 w-4" />
        Add Property
      </Button>
    </div>
  )

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <PageHeader 
        title="Manage Properties" 
        subtitle="Onboard new listings, modify tenant configurations, and review intelligent rental pricing."
        actions={headerActions}
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((s) => (
            <Card key={s} className="p-4 space-y-4 animate-pulse">
              <div className="h-36 bg-ink-100 dark:bg-ink-800 rounded-2xl" />
              <div className="h-4 w-2/3 bg-ink-100 dark:bg-ink-800 rounded" />
              <div className="h-3 w-1/3 bg-ink-100 dark:bg-ink-800 rounded" />
            </Card>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <EmptyState 
          icon={Building}
          title="No Properties Found"
          description={searchQuery ? `No properties matching "${searchQuery}" in Lucknow operations.` : "You have not listed any properties in AwadhLease yet."}
          actionText={searchQuery ? "Clear Search Filter" : "Create First Property Listing"}
          onAction={searchQuery ? () => setSearchQuery('') : () => setOpen(true)}
        />
      ) : viewMode === 'list' ? (
        /* List View (Table layout) */
        <Card className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ink-100 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/20 text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                <th className="p-4">Property Details</th>
                <th className="p-4">Location</th>
                <th className="p-4">Monthly Rent</th>
                <th className="p-4">Configurations</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100/50 dark:divide-ink-800/30 text-sm">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-900/20 transition duration-150">
                  <td className="p-4 flex items-center gap-3">
                    <div 
                      className="h-10 w-14 rounded-lg bg-cover bg-center flex-shrink-0 border dark:border-ink-800"
                      style={{ backgroundImage: `url(${property.image})` }}
                    />
                    <span className="font-bold text-ink-950 dark:text-ink-50">{property.title}</span>
                  </td>
                  <td className="p-4 text-ink-500 dark:text-ink-400">{property.location}</td>
                  <td className="p-4 font-bold text-brand-600 dark:text-brand-400">{formatRupee(property.rent)}</td>
                  <td className="p-4 text-xs font-semibold text-ink-600 dark:text-ink-400 capitalize">
                    {property.bhk || '2 BHK'} &bull; {property.type}
                  </td>
                  <td className="p-4">
                    <Badge tone={property.status === 'Available' ? 'success' : 'info'} size="sm">
                      {property.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        /* Grid View */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Slide-over Right Side Drawer Panel for Creating Property */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur */}
          <div 
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          
          {/* Drawer content */}
          <div className="relative w-full max-w-lg bg-white dark:bg-ink-950 shadow-2xl h-full flex flex-col z-10 animate-slide-up border-l border-ink-100 dark:border-ink-800">
            {/* Header */}
            <div className="p-6 border-b border-ink-100 dark:border-ink-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-sora text-ink-950 dark:text-ink-50">Onboard New Property</h3>
                <p className="text-xs text-ink-400 mt-1">Provide building details to start operations.</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-xl border border-ink-100 dark:border-ink-800 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900 transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Basic Info</h4>
                
                <div>
                  <label className="form-label">Property Title / Name</label>
                  <Input
                    placeholder="e.g. Shalimar Emerald - A4"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="form-label">Full Address</label>
                  <Input
                    placeholder="Street, Tower, Flat No."
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">City</label>
                    <Input
                      placeholder="e.g. Lucknow"
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Locality / Area</label>
                    <Input
                      placeholder="e.g. Gomti Nagar"
                      value={form.locality}
                      onChange={(e) => setForm((p) => ({ ...p, locality: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Property Type</label>
                    <Select
                      value={form.propertyType}
                      onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
                      options={[
                        { value: 'Flat', label: 'Flat / Apartment' },
                        { value: 'House', label: 'Independent House' },
                        { value: 'PG', label: 'Co-Living / PG' },
                        { value: 'Commercial', label: 'Commercial' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="form-label">Layout Config</label>
                    <Select
                      value={form.bhk}
                      onChange={(e) => setForm((p) => ({ ...p, bhk: e.target.value }))}
                      options={[
                        { value: '1 BHK', label: '1 BHK' },
                        { value: '2 BHK', label: '2 BHK' },
                        { value: '3 BHK', label: '3 BHK' },
                        { value: '4+ BHK', label: '4+ BHK / Penthouse' }
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-ink-100 dark:bg-ink-800/60 my-2" />

              {/* Financials */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Financials & Terms</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Monthly Rent (INR)</label>
                    <Input
                      placeholder="e.g. 18500"
                      type="number"
                      value={form.monthlyRent}
                      onChange={(e) => setForm((p) => ({ ...p, monthlyRent: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Security Deposit (INR)</label>
                    <Input
                      placeholder="e.g. 37000"
                      type="number"
                      value={form.securityDeposit}
                      onChange={(e) => setForm((p) => ({ ...p, securityDeposit: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Furnishing</label>
                    <Select
                      value={form.furnished}
                      onChange={(e) => setForm((p) => ({ ...p, furnished: e.target.value }))}
                      options={[
                        { value: 'false', label: 'Unfurnished' },
                        { value: 'true', label: 'Fully Furnished' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="form-label">Occupancy Status</label>
                    <Select
                      value={form.occupancyStatus}
                      onChange={(e) => setForm((p) => ({ ...p, occupancyStatus: e.target.value }))}
                      options={[
                        { value: 'available', label: 'Available' },
                        { value: 'occupied', label: 'Occupied' },
                        { value: 'maintenance', label: 'Maintenance Underway' }
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Available From</label>
                  <Input
                    type="date"
                    value={form.availableFrom}
                    onChange={(e) => setForm((p) => ({ ...p, availableFrom: e.target.value }))}
                  />
                </div>
              </div>

              <div className="h-[1px] bg-ink-100 dark:bg-ink-800/60 my-2" />

              {/* Images Uploader section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Media Uploads</h4>
                
                <div>
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-dashed border-ink-200 dark:border-ink-800 hover:border-brand-500 dark:hover:border-brand-500 bg-ink-50/50 dark:bg-ink-900/30 px-4 py-8 text-center text-xs font-bold text-ink-500 hover:text-brand-600 transition flex flex-col items-center justify-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-6 w-6 text-ink-400" />
                    {isUploading ? 'Securing uploads to vault...' : 'Drag & drop or click to upload property photos'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>

                {form.imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {form.imageUrls.map((url) => (
                      <div key={url} className="relative overflow-hidden rounded-xl aspect-square border dark:border-ink-800">
                        <img src={url} alt="Listing thumbnail" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          className="absolute right-1.5 top-1.5 rounded-full bg-ink-950/70 p-1 text-white hover:bg-rose-600 transition"
                          onClick={() => handleRemoveImage(url)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-ink-100 dark:bg-ink-800/60 my-2" />

              {/* Extra Meta descriptions */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Additional Meta</h4>
                
                <div>
                  <label className="form-label">Amenities (Comma separated)</label>
                  <Textarea
                    rows={2}
                    placeholder="e.g. WiFi, Parking, AC, Power Backup"
                    value={form.amenities}
                    onChange={(e) => setForm((p) => ({ ...p, amenities: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="form-label">Tenant Rules / Guidelines</label>
                  <Textarea
                    rows={2}
                    placeholder="e.g. No loud music post 10 PM. Family preference."
                    value={form.rules}
                    onChange={(e) => setForm((p) => ({ ...p, rules: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="form-label">Public Listing Description</label>
                  <Textarea
                    rows={3}
                    placeholder="Provide a compelling description of the multi-tenant space..."
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>

                {/* Features Checklist */}
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-ink-600 dark:text-ink-400">
                  <label className="flex items-center gap-2 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2.5 cursor-pointer hover:bg-ink-50">
                    <input
                      type="checkbox"
                      className="rounded text-brand-500 accent-brand-500"
                      checked={form.parking}
                      onChange={(e) => setForm((p) => ({ ...p, parking: e.target.checked }))}
                    />
                    Parking Covered
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2.5 cursor-pointer hover:bg-ink-50">
                    <input
                      type="checkbox"
                      className="rounded text-brand-500 accent-brand-500"
                      checked={form.wifi}
                      onChange={(e) => setForm((p) => ({ ...p, wifi: e.target.checked }))}
                    />
                    WiFi Active
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2.5 cursor-pointer hover:bg-ink-50">
                    <input
                      type="checkbox"
                      className="rounded text-brand-500 accent-brand-500"
                      checked={form.ac}
                      onChange={(e) => setForm((p) => ({ ...p, ac: e.target.checked }))}
                    />
                    AC Furnished
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2.5 cursor-pointer hover:bg-ink-50">
                    <input
                      type="checkbox"
                      className="rounded text-brand-500 accent-brand-500"
                      checked={form.petFriendly}
                      onChange={(e) => setForm((p) => ({ ...p, petFriendly: e.target.checked }))}
                    />
                    Pet Friendly
                  </label>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-ink-100 dark:border-ink-800/80 bg-ink-50/30 dark:bg-ink-900/10 flex justify-end gap-3 flex-shrink-0">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="shadow-glow flex items-center gap-1">
                <Check className="h-4 w-4" />
                Save Property
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
