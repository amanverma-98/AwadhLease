const makeImage = (title, accent = '#6366f1') => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)" />
      <text x="90" y="400" font-family="Manrope, Arial" font-size="42" fill="white">${title}</text>
    </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const occupancyToStatus = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance'
}

export function mapPropertyFromApi(property) {
  const amenityLabels = [...(property.amenities || [])]
  if (property.parking && !amenityLabels.includes('Parking')) amenityLabels.push('Parking')
  if (property.wifi && !amenityLabels.includes('WiFi')) amenityLabels.push('WiFi')
  if (property.ac && !amenityLabels.includes('AC')) amenityLabels.push('AC')
  if (property.pet_friendly && !amenityLabels.includes('Pet Friendly')) {
    amenityLabels.push('Pet Friendly')
  }

  const gallery =
    property.images?.length > 0
      ? property.images
      : [makeImage(property.name)]

  return {
    id: property.id,
    title: property.name,
    location: property.locality || property.city || 'Lucknow',
    type: property.property_type,
    bhk: property.bhk ? `${property.bhk} BHK` : 'N/A',
    rent: property.monthly_rent,
    rating: 4.5,
    status:
      occupancyToStatus[property.occupancy_status?.toLowerCase()] ||
      property.occupancy_status ||
      'Available',
    occupancy: property.occupancy_status,
    furnished: property.furnished ? 'Furnished' : 'Unfurnished',
    description: property.description || 'No description provided yet.',
    amenities: amenityLabels,
    image: gallery[0],
    gallery,
    rules: property.rules || [],
    requirements: [],
    availability: property.available_from
      ? new Date(property.available_from).toLocaleDateString()
      : 'Immediate',
    landlord: 'Landlord',
    address: property.address,
    _raw: property
  }
}

export function buildPropertyQueryParams(filters = {}) {
  const params = { limit: 100, city: 'Lucknow' }

  if (filters.location && filters.location !== 'All') {
    params.locality = filters.location
  }
  if (filters.type && filters.type !== 'All') {
    params.property_type = filters.type
  }
  if (filters.bhk && filters.bhk !== 'All') {
    const match = filters.bhk.match(/(\d+)/)
    if (match) params.bhk = Number(match[1])
  }
  if (filters.furnished === 'Fully furnished') params.furnished = true
  if (filters.furnished === 'Unfurnished') params.furnished = false

  if (filters.budget === 'Under 15k') {
    params.max_rent = 15000
  } else if (filters.budget === '15k - 30k') {
    params.min_rent = 15000
    params.max_rent = 30000
  } else if (filters.budget === '30k - 60k') {
    params.min_rent = 30000
    params.max_rent = 60000
  } else if (filters.budget === '60k+') {
    params.min_rent = 60000
  }

  if (filters.sortBy === 'Rent (low to high)') params.sort_by = 'rent_asc'
  if (filters.sortBy === 'Newest') params.sort_by = 'newest'

  const features = filters.features || []
  if (features.includes('Parking')) params.parking = true
  if (features.includes('WiFi')) params.wifi = true
  if (features.includes('AC')) params.ac = true
  if (features.includes('Pet friendly')) params.pet_friendly = true

  return params
}

export function mapPropertyToCreatePayload(form) {
  return {
    name: form.name,
    address: form.address,
    city: 'Lucknow',
    locality: form.locality || form.address,
    property_type: form.propertyType,
    bhk: form.bhk ? Number(form.bhk) : null,
    furnished: form.furnished === 'true',
    occupancy_status: form.occupancyStatus || 'available',
    monthly_rent: Number(form.monthlyRent),
    security_deposit: form.securityDeposit ? Number(form.securityDeposit) : null,
    amenities: form.amenities
      ? form.amenities.split(',').map((item) => item.trim()).filter(Boolean)
      : [],
    rules: form.rules
      ? form.rules.split('\n').map((item) => item.trim()).filter(Boolean)
      : [],
    description: form.description || null
  }
}
