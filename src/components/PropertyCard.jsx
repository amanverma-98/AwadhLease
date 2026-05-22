import { Heart, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { formatRupee } from '../utils/format'
import { usePropertyStore } from '../store/usePropertyStore'

export function PropertyCard({ property }) {
  const { favorites, toggleFavorite } = usePropertyStore()
  const isFavorite = favorites.includes(property.id)

  return (
    <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-card">
      <div
        className="relative h-44 w-full"
        style={{ backgroundImage: property.image }}
      >
        <button
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2"
          onClick={() => toggleFavorite(property.id)}
          aria-label="Save property"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? 'text-rose-500' : 'text-ink-500'
            }`}
          />
        </button>
        <Badge className="absolute left-3 top-3" tone="info">
          {property.status}
        </Badge>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-ink-900">
              {property.title}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
              <MapPin className="h-3 w-3" />
              {property.location}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-ink-700">
            <Star className="h-3 w-3 text-amber-400" />
            {property.rating}
          </div>
        </div>
        <p className="text-xs text-ink-500">{property.description}</p>
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900">
            {formatRupee(property.rent)}
            <span className="text-xs font-medium text-ink-500">/mo</span>
          </p>
          <Link
            to={`/listing/${property.id}`}
            className="text-xs font-semibold text-brand-600"
          >
            View details
          </Link>
        </div>
      </div>
    </Card>
  )
}
