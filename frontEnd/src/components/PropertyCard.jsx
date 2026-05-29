import { Heart, MapPin, Star, Sparkles, Building2, Layout, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { formatRupee } from '../utils/format'
import { usePropertyStore } from '../store/usePropertyStore'
import { cn } from '../utils/cn'

export function PropertyCard({ property }) {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = usePropertyStore()
  const isFavorite = favorites.includes(property.id)

  // Calculate unique custom AI Match Score for the investor feel
  const aiMatchScore = Math.floor(88 + (parseInt(String(property.id || '').replace(/\D/g, '') || '5') % 12))


  return (
    <Card
      className="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 bg-white dark:bg-ink-900/60 dark:border-ink-800/40"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/listing/${property.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate(`/listing/${property.id}`)
        }
      }}
    >
      {/* Top Image area */}
      <div
        className="relative h-48 w-full bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
        
        {/* Favorite heart button */}
        <button
          className="absolute right-3.5 top-3.5 rounded-2xl bg-white/90 dark:bg-ink-950/80 p-2.5 shadow-soft hover:scale-105 active:scale-95 transition-all text-ink-500 hover:text-rose-500 border border-ink-100/50 dark:border-ink-800/50"
          onClick={(event) => {
            event.stopPropagation()
            toggleFavorite(property.id)
          }}
          aria-label="Save property"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite ? "fill-rose-500 text-rose-500" : "text-ink-500 dark:text-ink-400"
            )}
          />
        </button>

        {/* Status indicator */}
        <Badge 
          className="absolute left-3.5 top-3.5 font-bold uppercase tracking-wider text-[9px] shadow-sm" 
          tone={property.status === 'Available' ? 'success' : 'info'}
        >
          {property.status}
        </Badge>
        
        {/* Custom AI Match score badge */}
        <div className="absolute left-3.5 bottom-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500 text-white text-[10px] font-bold shadow-glow-purple border border-purple-400/25">
          <Sparkles className="h-3 w-3" />
          <span>{aiMatchScore}% Match</span>
        </div>
      </div>

      {/* Card Content details */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-ink-950 dark:text-ink-50 font-sora tracking-tight leading-snug truncate max-w-[190px]">
              {property.title}
            </h4>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-500 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-ink-400" />
              <span className="truncate max-w-[160px]">{property.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs font-bold text-ink-700 dark:text-ink-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 flex-shrink-0">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            {property.rating}
          </div>
        </div>

        <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-2 min-h-[32px]">
          {property.description}
        </p>

        {/* BHK Details, Furnishing indicators */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <Badge tone="default" size="sm" className="font-bold flex items-center gap-1 text-[10px] bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 border border-ink-100 dark:border-ink-800">
            <Building2 className="h-3 w-3" />
            {property.bhk || '2 BHK'}
          </Badge>
          <Badge tone="default" size="sm" className="font-bold flex items-center gap-1 text-[10px] bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 border border-ink-100 dark:border-ink-800">
            <Layout className="h-3 w-3" />
            {property.furnished ? 'Furnished' : 'Unfurnished'}
          </Badge>
        </div>

        {/* Price & tap button section */}
        <div className="flex items-center justify-between pt-3.5 border-t border-ink-100/50 dark:border-ink-800/30">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-ink-400 dark:text-ink-500">Monthly Rent</span>
            <p className="text-base font-bold font-sora text-brand-600 dark:text-brand-400">
              {formatRupee(property.rent)}
              <span className="text-xs font-semibold text-ink-400 dark:text-ink-500">/mo</span>
            </p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
            Book Space
          </span>
        </div>
      </div>
    </Card>
  )
}
