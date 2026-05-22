import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, PhoneCall } from 'lucide-react'
import { properties } from '../data/properties'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { formatRupee } from '../utils/format'

export function ListingDetails() {
  const { id } = useParams()
  const [submitted, setSubmitted] = useState(false)
  const [contacted, setContacted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', date: '' })

  useEffect(() => {
    const saved = localStorage.getItem('rentpilot-visit')
    if (saved) {
      setForm(JSON.parse(saved))
    }
  }, [])

  const property = useMemo(
    () => properties.find((item) => item.id === id),
    [id]
  )

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
          <div className="grid gap-4 md:grid-cols-2">
            {property.gallery.map((image, index) => (
              <div
                key={`${property.id}-img-${index}`}
                className="h-56 rounded-3xl"
                style={{ backgroundImage: image }}
              />
            ))}
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
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-ink-900">Nearby places</h2>
            <div className="mt-4 rounded-2xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-500">
              Google Maps preview will render here. Nearby: Wave Mall, City
              Hospital, Metro Station, 24x7 grocery.
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-ink-900">
              Book a site visit
            </h3>
            <p className="mt-2 text-sm text-ink-600">
              AI will auto-fill your details next time and send a confirmation
              instantly.
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
              <Button
                className="w-full"
                onClick={() => {
                  localStorage.setItem('rentpilot-visit', JSON.stringify(form))
                  setSubmitted(true)
                }}
              >
                Book site visit
              </Button>
              {submitted && (
                <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-700">
                  Visit booked. Confirmation shared with landlord and tenant.
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
                Landlord notified. Continue chat inside RentPilot AI.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
