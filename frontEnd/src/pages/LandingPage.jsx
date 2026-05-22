import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, MapPin } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { PropertyCard } from '../components/PropertyCard'
import { usePropertyStore } from '../store/usePropertyStore'
import { lucknowLocations } from '../constants/locations'
import { propertyTypes } from '../constants/filters'

const floatingCards = [
  { title: 'AI Rent Tracker', value: 'INR 5.4L collected' },
  { title: 'Maintenance AI', value: '18 tickets automated' },
  { title: 'Tenant Pulse', value: '94% retention predicted' }
]

export function LandingPage() {
  const navigate = useNavigate()
  const { listings, filters, setFilters, fetchListings, isLoading, loadError, useMockFallback } =
    usePropertyStore()

  useEffect(() => {
    fetchListings(filters)
  }, [
    fetchListings,
    filters.location,
    filters.type,
    filters.bhk,
    filters.furnished,
    filters.budget,
    filters.sortBy,
    filters.features
  ])
  const filterChips = [
    { key: 'Parking', type: 'amenity', value: 'Parking' },
    { key: 'WiFi', type: 'amenity', value: 'WiFi' },
    { key: 'AC', type: 'amenity', value: 'AC' },
    { key: 'Lift', type: 'amenity', value: 'Lift' },
    { key: 'Pet friendly', type: 'amenity', value: 'Pet Friendly' },
    { key: 'PG - Women', type: 'occupancy', value: 'Women' },
    { key: 'PG - Men', type: 'occupancy', value: 'Men' },
    { key: 'Availability: Immediate', type: 'availability', value: 'Immediate' }
  ]
  const chipLookup = Object.fromEntries(
    filterChips.map((chip) => [chip.key, chip])
  )

  const toggleChip = (key) => {
    setFilters({
      features: filters.features.includes(key)
        ? filters.features.filter((item) => item !== key)
        : [...filters.features, key]
    })
  }

  const filteredListings = listings
    .filter((listing) =>
      listing.title.toLowerCase().includes(filters.query.toLowerCase())
    )
    .filter((listing) =>
      filters.type === 'All' ? true : listing.type === filters.type
    )
    .filter((listing) =>
      filters.location === 'All' ? true : listing.location === filters.location
    )
    .filter((listing) =>
      filters.bhk === 'All' ? true : listing.bhk === filters.bhk
    )
    .filter((listing) =>
      filters.furnished === 'All'
        ? true
        : listing.furnished === filters.furnished
    )
    .filter((listing) => {
      if (filters.pgGender === 'Any') return true
      if (listing.type !== 'PG') return false
      return listing.occupancy === filters.pgGender
    })
    .filter((listing) =>
      filters.features.every((key) => {
        const chip = chipLookup[key]
        if (!chip) return true
        if (chip.type === 'amenity') {
          return listing.amenities.includes(chip.value)
        }
        if (chip.type === 'occupancy') {
          return listing.occupancy === chip.value
        }
        if (chip.type === 'availability') {
          return listing.availability === chip.value
        }
        return true
      })
    )
    .sort((a, b) => {
      if (filters.sortBy === 'Rent (low to high)') {
        return a.rent - b.rent
      }
      if (filters.sortBy === 'Newest') {
        return b.id.localeCompare(a.id)
      }
      return b.rating - a.rating
    })

  return (
    <div className="px-6 pb-20">
      <section className="mx-auto max-w-6xl py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-600">
              <Sparkles className="h-4 w-4" />
              AI-native property management
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-ink-900 md:text-5xl">
              AI Property Management for Modern Indian Landlords
            </h1>
            <p className="text-base text-ink-600 md:text-lg">
              Search rentals, automate rent collection, manage maintenance, and
              run properties using intelligent AI agents.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Find Properties</Button>
            </div>
            <div className="glass-panel rounded-3xl p-4 shadow-card">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm">
                  <Search className="h-4 w-4 text-ink-400" />
                  <Input
                    className="border-none p-0 shadow-none"
                    placeholder="Search flats, PGs, houses, commercial"
                    value={filters.query}
                    onChange={(event) =>
                      setFilters({ query: event.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-500">
                  <MapPin className="h-4 w-4" />
                  Lucknow
                </div>
                <Button onClick={() => fetchListings(filters)}>Search</Button>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-[32px] border border-white/40 bg-gradient-to-br from-white/80 to-white/20 p-6 shadow-card backdrop-blur">
              <div className="rounded-3xl border border-ink-100 bg-white/80 p-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
                  Live dashboard preview
                </p>
                <div className="mt-4 space-y-4">
                  {floatingCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-ink-100 bg-white px-4 py-3"
                    >
                      <p className="text-xs text-ink-500">{card.title}</p>
                      <p className="text-sm font-semibold text-ink-900">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 right-6 hidden w-44 animate-floaty rounded-3xl bg-emerald-500/15 p-4 text-xs font-semibold text-emerald-700 shadow-glow md:block">
              Rent automation active in 18 units
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl rounded-3xl border border-ink-100 bg-white/80 p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-4">
          <select
            className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48"
            value={filters.type}
            onChange={(event) => setFilters({ type: event.target.value })}
          >
            <option>All</option>
            {propertyTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <select
            className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48"
            value={filters.bhk}
            onChange={(event) => setFilters({ bhk: event.target.value })}
          >
            <option>All</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
            <option>4+ BHK</option>
          </select>
          <select
            className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48"
            value={filters.location}
            onChange={(event) => setFilters({ location: event.target.value })}
          >
            <option>All</option>
            {lucknowLocations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
          <select
            className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48"
            value={filters.budget}
            onChange={(event) => setFilters({ budget: event.target.value })}
          >
            <option>Any</option>
            <option>Under 15k</option>
            <option>15k - 30k</option>
            <option>30k - 60k</option>
            <option>60k+</option>
          </select>
          <select
            className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48"
            value={filters.furnished}
            onChange={(event) => setFilters({ furnished: event.target.value })}
          >
            <option>All</option>
            <option>Fully furnished</option>
            <option>Semi-furnished</option>
            <option>Unfurnished</option>
          </select>
          <select
            className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48"
            value={filters.pgGender}
            onChange={(event) => setFilters({ pgGender: event.target.value })}
          >
            <option>Any</option>
            <option>Women</option>
            <option>Men</option>
          </select>
          <select
            className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48"
            value={filters.sortBy}
            onChange={(event) => setFilters({ sortBy: event.target.value })}
          >
            <option>Popularity</option>
            <option>Rent (low to high)</option>
            <option>Newest</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filterChips.map((chip) => (
            <button
              key={chip.key}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                filters.features.includes(chip.key)
                  ? 'border-brand-500 bg-brand-500 text-white shadow-glow'
                  : 'border-ink-100 bg-white text-ink-600'
              }`}
              onClick={() => toggleChip(chip.key)}
            >
              {chip.key}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">
              Marketplace
            </p>
            <h2 className="text-2xl font-semibold text-ink-900">
              Curated listings in Lucknow
            </h2>
            {loadError && (
              <p className="mt-1 text-xs text-amber-600">
                API unavailable — showing cached listings.
              </p>
            )}
            {useMockFallback && !loadError && (
              <p className="mt-1 text-xs text-ink-400">
                No live listings yet. Showing demo data.
              </p>
            )}
          </div>
          <Button variant="secondary" onClick={() => navigate('/properties')}>
            View all
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && (
            <p className="text-sm text-ink-500 md:col-span-3">Loading listings...</p>
          )}
          {!isLoading &&
            filteredListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>
      </section>
    </div>
  )
}
