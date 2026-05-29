import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  PhoneCall, 
  ArrowLeft,
  Calendar,
  Compass,
  Home,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  User,
  Heart,
  Share2,
  X,
  ChevronLeft,
  Camera
} from 'lucide-react'
import { properties as mockProperties } from '../data/properties'
import { contactLandlord, getProperty } from '../services/propertyService'
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
  const navigate = useNavigate()
  const { pushToast } = useNotificationStore()
  const [submitted, setSubmitted] = useState(false)
  const [contacted, setContacted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', date: '', message: '' })
  const [activeImage, setActiveImage] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  
  // Card Tab inside booking panel (visit vs chat)
  const [activeCardTab, setActiveCardTab] = useState('visit')
  const [isLiked, setIsLiked] = useState(false)

  // Full-screen Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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

  // ESC key handler for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.date) {
      pushToast({ 
        title: 'Missing Details', 
        message: 'Please fill name, phone, and visit date.',
        tone: 'warning'
      })
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
      pushToast({ 
        title: 'Visit Booked', 
        message: 'Owner has been notified of your schedule preference.' 
      })
    } catch (error) {
      pushToast({ 
        title: 'Booking Failed', 
        message: error.message,
        tone: 'danger'
      })
    }
  }

  const handleContact = async () => {
    if (!form.name || !form.phone) {
      pushToast({ 
        title: 'Missing Contact Details', 
        message: 'Please fill in your name and phone.',
        tone: 'warning'
      })
      return
    }
    try {
      await contactLandlord(id, {
        name: form.name,
        phone: form.phone,
        message: contactMessage || null
      })
      setContacted(true)
      pushToast({ 
        title: 'Message Sent', 
        message: 'Instant SMS and dashboard dispatch shared with landlord.' 
      })
    } catch (error) {
      pushToast({ 
        title: 'Send Failed', 
        message: error.message,
        tone: 'danger'
      })
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-ink-200 dark:bg-ink-800 rounded-xl" />
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="h-96 bg-ink-150 dark:bg-ink-800/60 rounded-3xl" />
            <div className="h-10 w-2/3 bg-ink-250 dark:bg-ink-800/80 rounded-xl" />
          </div>
          <div className="h-96 bg-ink-150 dark:bg-ink-800/60 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Card className="p-8 text-center border-dashed border-2 border-ink-150">
          <p className="text-sm font-bold text-ink-950">Listing not found</p>
          <p className="text-xs text-ink-500 mt-2">
            Please return to the marketplace search index.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => navigate('/')}>
            Back to Marketplace
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 animate-fade-in-up space-y-6">
      {/* Back button row */}
      <div className="flex items-center justify-between pb-4 border-b border-ink-100 dark:border-ink-850">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-ink-600 dark:text-ink-400 hover:text-brand-500 transition uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setIsLiked(!isLiked)
              pushToast({
                title: isLiked ? 'Removed shortlist' : 'Added to Shortlist',
                message: isLiked ? 'Removed from your properties list' : 'Saved to your profile shortlist.'
              })
            }}
            className={`p-2 rounded-xl border border-ink-200 dark:border-ink-800 transition ${
              isLiked 
                ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20' 
                : 'text-ink-600 hover:bg-ink-50 dark:text-ink-400 dark:hover:bg-ink-900/30'
            }`}
            aria-label="Shortlist property"
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              pushToast({ title: 'Link copied', message: 'Share link saved to clipboard.' })
            }}
            className="p-2 rounded-xl border border-ink-200 dark:border-ink-800 text-ink-600 hover:bg-ink-50 dark:text-ink-400 dark:hover:bg-ink-900/30 transition"
            aria-label="Share listing"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Asymmetric Gallery Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Main large photo */}
        <div 
          onClick={() => {
            setLightboxIndex(0)
            setIsLightboxOpen(true)
          }}
          className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-ink-100 dark:border-ink-800 shadow-soft h-[300px] md:h-[420px] cursor-pointer"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.01]"
            style={{ backgroundImage: `url(${activeImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          {property.ai_score && (
            <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-brand-500/90 text-white text-xs font-bold font-sora flex items-center gap-1.5 shadow backdrop-blur-sm animate-pulse-dot">
              <Sparkles className="h-4 w-4" />
              <span>AI Match: {property.ai_score}%</span>
            </div>
          )}
          
          {/* Immersive View Gallery Overlay Indicator */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Click to expand gallery
          </div>
        </div>

        {/* Stacked smaller thumbnails */}
        <div className="grid grid-cols-3 md:grid-cols-1 md:grid-rows-2 gap-4 h-[90px] md:h-[420px]">
          {/* Thumbnail 1 */}
          {gallery[1] && (
            <button
              onClick={() => {
                setActiveImage(gallery[1])
                setLightboxIndex(1)
              }}
              className="relative overflow-hidden rounded-3xl border border-ink-100 dark:border-ink-850 h-full w-full group cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${gallery[1]})` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-200" />
            </button>
          )}

          {/* Thumbnail 2 with 'See All' overlay */}
          {gallery[2] && (
            <button
              onClick={() => {
                setLightboxIndex(2)
                setIsLightboxOpen(true)
              }}
              className="relative overflow-hidden rounded-3xl border border-ink-100 dark:border-ink-850 h-full w-full group cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${gallery[2]})` }}
              />
              {/* Glassmorphic see all overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-200 flex flex-col items-center justify-center text-white p-2">
                <Camera className="h-5 w-5 mb-1 text-brand-300 group-hover:scale-110 transition duration-200 animate-pulse-dot" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-center font-sora">
                  View Gallery ({gallery.length})
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Details on Left, Sticky booking on Right */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {/* General Title Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold font-sora text-ink-950 dark:text-ink-50">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-555 dark:text-ink-400 font-medium">
              <span className="flex items-center gap-1 text-brand-650 dark:text-brand-400 font-bold">
                <MapPin className="h-4 w-4" />
                {property.address}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-ink-200 dark:bg-ink-850" />
              <Badge tone="success" className="text-[9px] uppercase tracking-wider font-bold">
                {property.status}
              </Badge>
            </div>
          </div>

          {/* Quick Specifications */}
          <Card className="p-5 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 text-center divide-x divide-ink-100/60 dark:divide-ink-800">
              <div>
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">Type</p>
                <p className="text-sm font-bold text-ink-900 dark:text-ink-150 mt-1 font-sora">{property.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest pl-2 sm:pl-0">Layout</p>
                <p className="text-sm font-bold text-ink-900 dark:text-ink-150 mt-1 font-sora pl-2 sm:pl-0">{property.bhk} BHK</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest pl-2 sm:pl-0">Furnishing</p>
                <p className="text-sm font-bold text-ink-900 dark:text-ink-150 mt-1 font-sora pl-2 sm:pl-0">{property.furnished}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest pl-2 sm:pl-0">Rent Yield</p>
                <p className="text-sm font-bold text-brand-650 dark:text-brand-400 mt-1 font-sora pl-2 sm:pl-0">
                  {formatRupee(property.rent)}
                  <span className="text-[9px] text-ink-400">/mo</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Amenities Grid */}
          <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-4">
            <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50 uppercase tracking-wider flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-brand-500" />
              Equipped Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity} tone="info" className="text-xs px-3 py-1 bg-brand-50 dark:bg-brand-950/20 text-brand-700 border-0 font-medium">
                  {amenity}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Rules Section */}
          <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-4">
            <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50 uppercase tracking-wider flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-brand-500" />
              Tenancy Guidelines & Policies
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2 text-xs text-ink-650 dark:text-ink-400 font-semibold leading-relaxed">
              {property.rules.map((rule) => (
                <li key={rule} className="flex items-start gap-2 bg-ink-50/20 dark:bg-ink-900/10 p-2.5 rounded-xl border border-ink-100/50">
                  <CheckCircle className="h-4 w-4 text-emerald-555 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Neighborhood & Map */}
          <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-4">
            <div>
              <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50 uppercase tracking-wider">
                Neighborhood Transit Index
              </h3>
              <p className="text-xs text-ink-400 mt-0.5">
                Approximate distance timelines to transit and emergency junctions.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Mock map graphic SVG */}
              <div className="h-48 bg-ink-50 dark:bg-ink-900 rounded-2xl relative overflow-hidden border border-ink-100 flex items-center justify-center">
                <svg className="absolute inset-0 h-full w-full opacity-35" viewBox="0 0 300 150">
                  <path d="M0,75 Q75,50 150,75 T300,75" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M75,0 Q100,75 75,150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="150" cy="75" r="8" fill="#8b5cf6" />
                  <circle cx="150" cy="75" r="16" fill="#8b5cf6" fillOpacity="0.2" className="animate-ping" />
                </svg>
                <div className="absolute p-3 rounded-2xl bg-white dark:bg-ink-950 text-[10px] font-bold text-brand-650 shadow border border-ink-100 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Skyline Residencies A-302</span>
                </div>
              </div>

              {/* Transit indices */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-ink-50/40 dark:bg-ink-900/10 rounded-xl text-xs font-semibold">
                  <span className="text-ink-700 dark:text-ink-300">Shalimar Metro Junction</span>
                  <span className="text-brand-650 font-bold">5 mins walk</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-ink-50/40 dark:bg-ink-900/10 rounded-xl text-xs font-semibold">
                  <span className="text-ink-700 dark:text-ink-300">Awadh Corporate Center</span>
                  <span className="text-brand-650 font-bold">12 mins drive</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-ink-50/40 dark:bg-ink-900/10 rounded-xl text-xs font-semibold">
                  <span className="text-ink-700 dark:text-ink-300">Apollo Emergency Health</span>
                  <span className="text-brand-650 font-bold">8 mins drive</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sticky Desktop Panel */}
        <div className="lg:relative">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Action booking card */}
            <Card className="p-6 border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 shadow-soft space-y-5">
              {/* Tab Selector Inside Booking Card */}
              <div className="flex border-b border-ink-100/80 dark:border-ink-800/80 pb-2">
                <button
                  onClick={() => setActiveCardTab('visit')}
                  className={`flex-1 text-center text-xs font-bold uppercase tracking-wider pb-1.5 transition ${
                    activeCardTab === 'visit' 
                      ? 'border-b-2 border-brand-500 text-brand-650 dark:text-brand-400' 
                      : 'text-ink-400 hover:text-ink-600'
                  }`}
                >
                  Book site visit
                </button>
                <button
                  onClick={() => setActiveCardTab('chat')}
                  className={`flex-1 text-center text-xs font-bold uppercase tracking-wider pb-1.5 transition ${
                    activeCardTab === 'chat' 
                      ? 'border-b-2 border-brand-500 text-brand-650 dark:text-brand-400' 
                      : 'text-ink-400 hover:text-ink-600'
                  }`}
                >
                  Chat with owner
                </button>
              </div>

              {activeCardTab === 'visit' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
                      Reserve a Visit Slot
                    </h3>
                    <p className="text-xs text-ink-400 mt-0.5">
                      Select date/details to dispatch a schedule trigger.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="font-medium"
                    />
                    <Input
                      placeholder="Mobile Phone Number"
                      value={form.phone}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      className="font-medium"
                    />
                    <div className="relative">
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, date: event.target.value }))
                        }
                        className="font-medium pr-10"
                      />
                    </div>
                    <Textarea
                      placeholder="Describe requirements (optional)"
                      rows={2}
                      value={form.message}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, message: event.target.value }))
                      }
                      className="font-medium"
                    />
                    
                    <Button className="w-full py-3 shadow-glow flex items-center justify-center gap-1.5" onClick={handleBooking}>
                      <Calendar className="h-4.5 w-4.5" />
                      <span>Confirm Visit Date</span>
                    </Button>

                    {submitted && (
                      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-700 dark:text-emerald-450 font-semibold leading-relaxed flex items-start gap-2.5">
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                        <span>Visit slot logged. Landlord has been shared your availability details.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeCardTab === 'chat' && (
                <div className="space-y-4 animate-fade-in-up">
                  <div>
                    <h3 className="text-sm font-bold font-sora text-ink-950 dark:text-ink-50">
                      Message the Landlord
                    </h3>
                    <p className="text-xs text-ink-400 mt-0.5">
                      Send your rent proposal details or list questions.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="font-medium"
                    />
                    <Input
                      placeholder="Mobile Phone Number"
                      value={form.phone}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      className="font-medium"
                    />
                    <Textarea
                      placeholder="Ask about furnishing details, security refunds, or rental rules..."
                      rows={4}
                      value={contactMessage}
                      onChange={(event) => setContactMessage(event.target.value)}
                      className="font-medium"
                    />
                    <Button
                      className="w-full py-3 flex items-center justify-center gap-2"
                      variant="secondary"
                      onClick={handleContact}
                    >
                      <PhoneCall className="h-4.5 w-4.5" />
                      <span>Share Details Now</span>
                    </Button>

                    {contacted && (
                      <p className="text-xs text-ink-500 text-center font-bold">
                        ✓ SMS notifications pushed to landlord account.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Landlord credentials trust */}
            <Card className="p-4 border border-ink-150/60 dark:border-ink-800/40 bg-ink-50/20 rounded-2xl flex items-center gap-3 text-xs">
              <User className="h-10 w-10 text-brand-650 bg-brand-100 p-2 rounded-xl dark:bg-brand-950/20" />
              <div>
                <p className="font-bold text-ink-900 dark:text-ink-100">Shalimar Corporate Group</p>
                <p className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">Premium Verified Landlord</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex flex-col justify-between p-6 text-white animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-bold font-sora text-white">{property.title}</h3>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider mt-0.5">Verified Property Gallery</p>
            </div>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main image viewer */}
          <div className="flex-1 flex items-center justify-between gap-4 max-w-4xl mx-auto w-full py-8">
            <button
              onClick={() => setLightboxIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition text-white shrink-0"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <img 
                src={gallery[lightboxIndex]} 
                alt={`${property.title} slide ${lightboxIndex + 1}`} 
                className="max-h-[60vh] max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain"
              />
              <span className="text-xs font-bold font-sora tracking-widest text-white/70 uppercase">
                Image {lightboxIndex + 1} of {gallery.length}
              </span>
            </div>

            <button
              onClick={() => setLightboxIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition text-white shrink-0"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnail strip at bottom */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-center gap-2.5 overflow-x-auto max-w-2xl mx-auto w-full">
            {gallery.map((image, index) => (
              <button
                key={`lightbox-thumb-${index}`}
                onClick={() => setLightboxIndex(index)}
                className={`h-14 w-20 rounded-xl bg-cover bg-center transition-all ${
                  lightboxIndex === index 
                    ? 'ring-2 ring-brand-500 scale-105 opacity-100' 
                    : 'opacity-50 hover:opacity-80'
                }`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
