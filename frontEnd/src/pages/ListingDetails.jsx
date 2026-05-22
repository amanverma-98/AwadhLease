import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, PhoneCall } from 'lucide-react'
import { properties as mockProperties } from '../data/properties'
import { getProperty } from '../services/propertyService'
import { createBooking } from '../services/bookingService'
import { mapPropertyFromApi } from '../utils/propertyMapper'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { formatRupee } from '../utils/format'
import { useNotificationStore } from '../store/useNotificationStore'

export function ListingDetails() {
  const { id } = useParams()
  const { pushToast } = useNotificationStore()
  const [submitted, setSubmitted] = useState(false)
  const [contacted, setContacted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', date: '', message: '' })
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('rentpilot-visit')
    if (saved) {
      setForm((prev) => ({ ...prev, ...JSON.parse(saved) }))
    }
  }, [])

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await getProperty(id)
        if (!active) return
        const mapped = mapPropertyFromApi(data)
        setProperty(mapped)
        setActiveImage(mapped.gallery[0])
      } catch {
        const fallback = mockProperties.find((item) => item.id === id)
        if (active && fallback) {
          setProperty(fallback)
          setActiveImage(fallback.gallery[0])
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  const gallery = useMemo(() => property?.gallery || [], [property])

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.date) {
      pushToast({ title: 'Missing details', message: 'Fill name, phone, and visit date.' })
      return
    }
    try {
      await createBooking({
        property_id: id,
        tenant_name: form.name,
        tenant_phone: form.phone,
        scheduled_at: new Date(form.date).toISOString(),
        message: form.message || null
      })
      localStorage.setItem(
        'rentpilot-visit',
        JSON.stringify({ name: form.name, phone: form.phone, date: form.date })
      )
      setSubmitted(true)
      pushToast({ title: 'Visit booked', message: 'Landlord will confirm shortly.' })
    } catch (error) {
      pushToast({ title: 'Booking failed', message: error.message })
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-ink-500">
        Loading listing...
      </div>
    )
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Card className="p-6 text-center">
          <p className="text-sm font-semibold text-ink-900">Listing not found</p>
          <p className="text-xs text-ink-500">
            Please return to the marketplace and pick another listing.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <div
              className="h-80 rounded-3xl bg-cover bg-center shadow-card"
              style={{ backgroundImage: `url(${activeImage})` }}
            />
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
              {gallery.map((image, index) => (
                <button
                  key={`${property.id}-thumb-${index}`}
                  className={`h-20 rounded-2xl bg-cover bg-center transition ${
                    activeImage === image
                      ? 'ring-2 ring-brand-500'
                      : 'ring-1 ring-ink-100'
                  }`}
                  style={{ backgroundImage: `url(${image})` }}
                  onClick={() => setActiveImage(image)}
                  aria-label="Preview property image"
                />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-ink-900">
              {property.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <MapPin className="h-4 w-4" />
              {property.address}
              <Badge tone="info">{property.status}</Badge>
            </div>
          </div>
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
                  Monthly rent
                </p>
                <p className="text-2xl font-semibold text-ink-900">
                  {formatRupee(property.rent)}
                </p>
              </div>
              <div className="space-y-1 text-xs text-ink-600">
                <p>Type: {property.type}</p>
                <p>BHK: {property.bhk}</p>
                <p>Furnished: {property.furnished}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-ink-900">Amenities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity}>{amenity}</Badge>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-ink-900">Rules</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {property.rules.map((rule) => (
                <li key={rule}>• {rule}</li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-ink-900">
              Book a site visit
            </h3>
            <p className="mt-2 text-sm text-ink-600">
              Your booking is sent to the backend and stored for the landlord.
            </p>
            <div className="mt-4 space-y-3">
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <Input
                placeholder="Phone number"
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
              <Input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
              />
              <Textarea
                placeholder="Message (optional)"
                rows={2}
                value={form.message}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, message: event.target.value }))
                }
              />
              <Button className="w-full" onClick={handleBooking}>
                Book site visit
              </Button>
              {submitted && (
                <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-700">
                  Visit booked. Confirmation shared with landlord.
                </div>
              )}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-ink-900">
              Contact landlord
            </h3>
            <Textarea placeholder="Share your requirements" rows={4} />
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => setContacted(true)}
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              Send details
            </Button>
            {contacted && (
              <p className="mt-3 text-xs text-ink-500">
                Landlord messaging API is not available yet — use site visit booking.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
