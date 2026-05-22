import { motion } from 'framer-motion'
import { Search, Sparkles, MapPin } from 'lucide-react'
import { Button } from '../components/ui/button'
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
  const { listings, filters, setFilters } = usePropertyStore()
  const filterChips = [
    'Parking',
    'WiFi',
    'AC',
    'Lift',
    'Pet friendly',
    'PG - Women',
    'PG - Men',
    'Availability: Immediate'
  ]

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(filters.query.toLowerCase())
  )

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
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="ghost">
                Book Demo
              </Button>
            </div>
            <div className="glass-panel rounded-3xl p-4 shadow-card">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm">
                  <Search className="h-4 w-4 text-ink-400" />
                  <Input
                    className="border-none p-0 shadow-none"
                    placeholder="Search flats, PGs, houses, commercial"
                    value={filters.query}
                    onChange={(event) => setFilters({ query: event.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-500">
                  <MapPin className="h-4 w-4" />
                  Lucknow
                </div>
                <Button>Search</Button>
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
            <div className="absolute -left-8 top-16 hidden w-40 animate-floaty rounded-3xl bg-brand-500/15 p-4 text-xs font-semibold text-brand-700 shadow-glow md:block">
              AI predicted occupancy lift +12%
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
          <select className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48">
            <option>BHK</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
            <option>4+ BHK</option>
          </select>
          <select className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48">
            {lucknowLocations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
          <select className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48">
            <option>Budget</option>
            <option>Under 15k</option>
            <option>15k - 30k</option>
            <option>30k - 60k</option>
            <option>60k+</option>
          </select>
          <select className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48">
            <option>Furnished</option>
            <option>Fully furnished</option>
            <option>Semi-furnished</option>
            <option>Unfurnished</option>
          </select>
          <select className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48">
            <option>PG gender</option>
            <option>Women</option>
            <option>Men</option>
            <option>Any</option>
          </select>
          <select className="w-full rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 md:w-48">
            <option>Sort by</option>
            <option>Rent (low to high)</option>
            <option>Popularity</option>
            <option>Newest</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filterChips.map((chip) => (
            <button
              key={chip}
              className="rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-semibold text-ink-600"
            >
              {chip}
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
          </div>
          <Button variant="secondary">View all</Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  )
}
