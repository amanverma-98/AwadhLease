import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, MapPin, SlidersHorizontal, ChevronDown, CheckCircle2, TrendingUp, Key, MessageSquareCode } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { PropertyCard } from '../components/PropertyCard'
import { EmptyState } from '../components/EmptyState'
import { usePropertyStore } from '../store/usePropertyStore'
import { lucknowLocations } from '../constants/locations'
import { propertyTypes } from '../constants/filters'
import { cn } from '../utils/cn'


const floatingCards = [
  { title: 'AI Rent Inflow', value: '₹14.2L automated', trend: '+12.4%', delay: 0.1 },
  { title: 'Predictive Maintenance', value: '4 tickets triaged', trend: 'Auto-resolved', delay: 0.2 },
  { title: 'Predictive Tenant Pulse', value: '98% retention rate', trend: 'Excellent', delay: 0.3 }
]

const stats = [
  { value: '500+', label: 'Premium Listings' },
  { value: '₹12Cr+', label: 'Rent Disbursed' },
  { value: '98.6%', label: 'AI Resolution Rate' },
  { value: '< 10m', label: 'KYC Verification' }
]

const steps = [
  {
    icon: Compass,
    title: 'Discover Premium Listings',
    desc: 'Browse through curated, high-end apartments, PGs, and shared spaces verified in real-time.'
  },
  {
    icon: MessageSquareCode,
    title: 'Interact with AI Assistant',
    desc: 'Get immediate matching scores, arrange visits, negotiate rent terms, and triage repair tickets through natural conversation.'
  },
  {
    icon: Key,
    title: 'Automate Rent & Maintenance',
    desc: 'Sign smart contracts, verify credentials instantly, and automate recurring rent payments and contractor dispatching.'
  }
]

// Lucide icon components for steps
function Compass(props) {
  return <SlidersHorizontal {...props} />
}

export function LandingPage() {
  const navigate = useNavigate()
  const { listings, filters, setFilters, fetchListings, isLoading, loadError, useMockFallback } =
    usePropertyStore()

  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [draftFilters, setDraftFilters] = useState(() => ({
    ...filters,
    type: 'All',
    bhk: 'All',
    location: 'All',
    budget: 'All',
    furnished: 'All',
    pgGender: 'Any',
    sortBy: 'Popularity'
  }))

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const applyFilters = () => {
    setFilters(draftFilters)
    setHasAppliedFilters(true)
    fetchListings(draftFilters)
    
    // Smooth scroll to marketplace
    document.getElementById('marketplace')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  const resetFilters = () => {
    const fresh = {
      query: '',
      type: 'All',
      bhk: 'All',
      location: 'All',
      budget: 'All',
      furnished: 'All',
      pgGender: 'Any',
      sortBy: 'Popularity',
      features: []
    }
    setDraftFilters(fresh)
    setFilters(fresh)
    setHasAppliedFilters(false)
    fetchListings(fresh)
  }

  const updateDraftFilters = (next) => {
    setDraftFilters((current) => ({ ...current, ...next }))
  }

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

  const chipLookup = useMemo(() => Object.fromEntries(
    filterChips.map((chip) => [chip.key, chip])
  ), [])

  const toggleChip = (key) => {
    setDraftFilters((current) => ({
      ...current,
      features: current.features.includes(key)
        ? current.features.filter((item) => item !== key)
        : [...current.features, key]
    }))
  }

  const filteredListings = useMemo(() => {
    if (!hasAppliedFilters) return []
    return listings
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
      .filter((listing) => {
        if (filters.budget === 'All') return true
        const rent = listing.rent || 0
        if (filters.budget === 'Under 15k') return rent < 15000
        if (filters.budget === '15k - 30k') return rent >= 15000 && rent <= 30000
        if (filters.budget === '30k - 60k') return rent >= 30000 && rent <= 60000
        if (filters.budget === '60k+') return rent > 60000
        return true
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
  }, [filters, hasAppliedFilters, listings, chipLookup])

  const latestListings = useMemo(() => {
    const scoreId = (value) => {
      const match = String(value || '').match(/\d+/)
      return match ? Number(match[0]) : 0
    }
    return [...listings]
      .sort((a, b) => scoreId(b.id) - scoreId(a.id))
      .slice(0, 10)
  }, [listings])

  const displayedListings = hasAppliedFilters
    ? filteredListings
    : latestListings

  return (
    <div className="px-4 md:px-8 max-w-6xl mx-auto pb-24 overflow-visible">
      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-24 relative overflow-visible">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[500px] bg-hero-glow opacity-60 pointer-events-none" />
        
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-100 dark:bg-brand-900/20 border border-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Smarter Property Operations
            </p>
            
            <h1 className="text-4xl font-bold tracking-tight text-ink-950 dark:text-ink-50 md:text-5xl lg:text-6xl font-sora leading-[1.1]">
              Next-Gen Rentals, Elevated by <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">AI Intelligence</span>
            </h1>
            
            <p className="text-base text-ink-500 dark:text-ink-400 md:text-lg max-w-xl leading-relaxed">
              Find premium listings in Lucknow, automate your rent collections, coordinate repairs dynamically, and sign smart contracts with our platform.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="shadow-lg shadow-brand-500/15" onClick={() => {
                document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                Explore Marketplace
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/auth/register')}>
                List Property
              </Button>
            </div>
          </motion.div>

          {/* Interactive Live preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:block"
          >
            <div className="rounded-[36px] border border-ink-100 dark:border-ink-800 bg-gradient-to-br from-white/90 to-white/40 dark:from-ink-900 dark:to-ink-950/80 p-8 shadow-card backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-ink-100/50 dark:border-ink-800/40">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">
                    Live Preview
                  </p>
                  <p className="text-sm font-bold text-ink-950 dark:text-ink-50 mt-1">AI Automation Dashboard</p>
                </div>
                <div className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Ready
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {floatingCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-ink-100/60 dark:border-ink-800 bg-white/70 dark:bg-ink-950/60 p-4 flex items-center justify-between shadow-soft hover:scale-[1.02] transition-all duration-300"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wide">{card.title}</p>
                      <p className="text-sm font-bold text-ink-950 dark:text-ink-50 mt-1.5">{card.value}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {card.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute -bottom-5 right-5 animate-floaty rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-xs font-bold text-white shadow-glow flex items-center gap-2 border border-emerald-400/20">
              <CheckCircle2 className="h-4.5 w-4.5" />
              18 Units Managed Auto-pilot
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Unified Search & Filter Panel */}
      <section className="mt-8 relative z-20">
        <div className="rounded-[32px] border border-ink-100/80 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 p-6 md:p-8 shadow-card backdrop-blur-md">
          {/* Main search input bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-ink-200 dark:border-ink-800 bg-white/60 dark:bg-ink-900 px-4 py-3.5 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
              <Search className="h-5 w-5 text-ink-400 dark:text-ink-500" />
              <input
                className="border-none w-full bg-transparent p-0 text-sm text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none"
                placeholder="Search premium flats, fully-furnished PGs, or locations in Lucknow..."
                value={draftFilters.query}
                onChange={(event) =>
                  updateDraftFilters({ query: event.target.value })
                }
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex items-center gap-2 px-5 hover:bg-ink-100/70"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <SlidersHorizontal className="h-4.5 w-4.5" />
                Filters
                <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
              </Button>
              
              <Button onClick={applyFilters} className="px-7 md:w-auto w-full shadow-glow">
                Search
              </Button>
            </div>
          </div>

          {/* Advanced collapsible selects */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-ink-100/50 dark:border-ink-800/40 mt-6">
                  {/* Property Type */}
                  <div>
                    <label className="form-label text-xs">Property Type</label>
                    <Select
                      value={draftFilters.type}
                      onChange={(e) => updateDraftFilters({ type: e.target.value })}
                      options={[{ value: 'All', label: 'All Types' }, ...propertyTypes.map(t => ({ value: t, label: t }))]}
                    />
                  </div>

                  {/* BHK Config */}
                  <div>
                    <label className="form-label text-xs">Layout (BHK)</label>
                    <Select
                      value={draftFilters.bhk}
                      onChange={(e) => updateDraftFilters({ bhk: e.target.value })}
                      options={[
                        { value: 'All', label: 'Any BHK' },
                        { value: '1 BHK', label: '1 BHK' },
                        { value: '2 BHK', label: '2 BHK' },
                        { value: '3 BHK', label: '3 BHK' },
                        { value: '4+ BHK', label: '4+ BHK' }
                      ]}
                    />
                  </div>

                  {/* Location Selection */}
                  <div>
                    <label className="form-label text-xs">Select Area</label>
                    <Select
                      value={draftFilters.location}
                      onChange={(e) => updateDraftFilters({ location: e.target.value })}
                      options={[{ value: 'All', label: 'All Lucknow' }, ...lucknowLocations.map(l => ({ value: l, label: l }))]}
                    />
                  </div>

                  {/* Budget Ranges */}
                  <div>
                    <label className="form-label text-xs">Monthly Rent</label>
                    <Select
                      value={draftFilters.budget}
                      onChange={(e) => updateDraftFilters({ budget: e.target.value })}
                      options={[
                        { value: 'All', label: 'Any Budget' },
                        { value: 'Under 15k', label: 'Under ₹15k' },
                        { value: '15k - 30k', label: '₹15k - ₹30k' },
                        { value: '30k - 60k', label: '₹30k - ₹60k' },
                        { value: '60k+', label: '₹60k+' }
                      ]}
                    />
                  </div>

                  {/* Furnishing Status */}
                  <div>
                    <label className="form-label text-xs">Furnishing</label>
                    <Select
                      value={draftFilters.furnished}
                      onChange={(e) => updateDraftFilters({ furnished: e.target.value })}
                      options={[
                        { value: 'All', label: 'Any Furnishing' },
                        { value: 'Fully furnished', label: 'Fully Furnished' },
                        { value: 'Semi-furnished', label: 'Semi-Furnished' },
                        { value: 'Unfurnished', label: 'Unfurnished' }
                      ]}
                    />
                  </div>

                  {/* PG Room Occupancy Type */}
                  <div>
                    <label className="form-label text-xs">PG Specifics</label>
                    <Select
                      value={draftFilters.pgGender}
                      onChange={(e) => updateDraftFilters({ pgGender: e.target.value })}
                      options={[
                        { value: 'Any', label: 'Co-ed / Any' },
                        { value: 'Women', label: 'Girls PG' },
                        { value: 'Men', label: 'Boys PG' }
                      ]}
                    />
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="form-label text-xs">Sort By</label>
                    <Select
                      value={draftFilters.sortBy}
                      onChange={(e) => updateDraftFilters({ sortBy: e.target.value })}
                      options={[
                        { value: 'Popularity', label: 'Top Rated' },
                        { value: 'Rent (low to high)', label: 'Rent: Low to High' },
                        { value: 'Newest', label: 'Newly Listed' }
                      ]}
                    />
                  </div>

                  {/* Reset Filters Option */}
                  <div className="flex items-end">
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full text-xs font-semibold py-3 border border-dashed border-ink-200 dark:border-ink-800 rounded-2xl">
                      Reset All Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rapid Tag Selection */}
          <div className="mt-5 pt-5 border-t border-ink-100/50 dark:border-ink-800/30 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 dark:text-ink-500 mr-2">
              Popular Tags:
            </span>
            {filterChips.map((chip) => {
              const active = draftFilters.features.includes(chip.key)
              return (
                <button
                  key={chip.key}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all select-none",
                    active
                      ? "border-brand-500 bg-brand-500 text-white shadow-soft"
                      : "border-ink-100 dark:border-ink-800 bg-white/50 dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:border-ink-200 dark:hover:border-ink-700"
                  )}
                  onClick={() => toggleChip(chip.key)}
                >
                  {chip.key}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="py-12 mt-8 rounded-[36px] bg-gradient-to-br from-ink-950 to-brand-950 text-white overflow-hidden relative shadow-glow">
        <div className="absolute inset-0 bg-noise-bg opacity-10 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div key={stat.label} className={cn("space-y-1.5", i >= 2 && "pt-6 md:pt-0")}>
              <h3 className="text-3xl md:text-4xl font-bold font-sora text-brand-300">
                {stat.value}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-24 border-b border-ink-100/80 dark:border-ink-800/40">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <p className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">
            Workflows
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-ink-950 dark:text-ink-50 font-sora">
            Premium Operations. Automated.
          </h2>
          <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
            AwadhLease automates the entire renting journey, saving hours of paperwork, dispute, and manual follow-ups.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div key={step.title} className="rounded-3xl border border-ink-100 dark:border-ink-800 bg-white/40 dark:bg-ink-900/30 p-8 shadow-soft relative overflow-hidden flex flex-col items-start hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl" />
              <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold mb-6">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 mb-2">Step {idx + 1}</span>
              <h4 className="text-lg font-bold font-sora text-ink-950 dark:text-ink-50 mb-3">{step.title}</h4>
              <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-brand-500" />
              <p className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">
                Explore Rentals
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-ink-950 dark:text-ink-50 font-sora mt-2.5">
              Available Units in Lucknow
            </h2>
            {loadError && (
              <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-3 py-1 rounded-full border border-rose-200/50">
                API offline &bull; Rendering offline vault fallback.
              </p>
            )}
            {useMockFallback && !loadError && (
              <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-ink-500 bg-ink-100 dark:bg-ink-900 px-3 py-1 rounded-full">
                Interactive demonstration mock data.
              </p>
            )}
          </div>
          
          <Button
            variant="secondary"
            className="flex-shrink-0 self-start sm:self-end"
            onClick={() => resetFilters()}
          >
            Clear Filters
          </Button>
        </div>

        {/* Property cards block with skeleton states */}
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="rounded-3xl border border-ink-100/60 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-soft space-y-4">
                <div className="w-full aspect-[4/3] rounded-2xl bg-ink-100 dark:bg-ink-800 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-2/3 bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
                  <div className="h-3 w-full bg-ink-100 dark:bg-ink-800 rounded animate-pulse" />
                  <div className="h-5 w-1/3 bg-ink-100 dark:bg-ink-800 rounded animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="max-w-2xl mx-auto py-12">
            <EmptyState
              title={hasAppliedFilters ? "No matching rentals found" : "No recent listings found"}
              description="Try adjusting your budget, furnishing criteria, or select another locality in Lucknow to expand your search results."
              actionText="Reset filters and view all properties"
              onAction={resetFilters}
            />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayedListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
