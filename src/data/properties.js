const makeImage = (title, accent) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)" />
      <rect x="60" y="520" width="1080" height="200" rx="32" fill="rgba(255,255,255,0.15)" />
      <text x="90" y="600" font-family="Manrope, Arial" font-size="42" fill="white">${title}</text>
      <text x="90" y="660" font-family="Manrope, Arial" font-size="24" fill="white" opacity="0.8">AwadhLease preview</text>
    </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const properties = [
  {
    id: 'rp-101',
    title: 'Skyline Residences A-302',
    location: 'Gomti Nagar',
    type: 'Flat',
    bhk: '3 BHK',
    rent: 32000,
    rating: 4.7,
    status: 'Available',
    occupancy: 'Family',
    furnished: 'Semi-furnished',
    description: 'Sunlit 3 BHK with smart security, AI energy monitor, and skyline balcony views.',
    amenities: ['Parking', 'WiFi', 'AC', 'Lift'],
    image: makeImage('Skyline Residences A-302', '#6366f1'),
    gallery: [
      makeImage('Skyline Residences A-302', '#6366f1'),
      makeImage('Skyline Residences - Living', '#0ea5e9'),
      makeImage('Skyline Residences - Balcony', '#22c55e')
    ],
    rules: ['No loud music after 10 PM', 'ID verification required', 'Pets allowed with deposit'],
    requirements: ['Minimum 6-month lease', 'Employment proof'],
    availability: 'Immediate',
    landlord: 'Arjun Tandon',
    address: 'Vibhuti Khand Road, Gomti Nagar'
  },
  {
    id: 'rp-112',
    title: 'Hazratganj Heritage House',
    location: 'Hazratganj',
    type: 'House',
    bhk: '4 BHK',
    rent: 54000,
    rating: 4.6,
    status: 'Limited',
    occupancy: 'Family',
    furnished: 'Fully furnished',
    description: 'Colonial style bungalow with AI-assisted maintenance and private garden space.',
    amenities: ['Parking', 'Pet Friendly', 'WiFi'],
    image: makeImage('Hazratganj Heritage House', '#0f172a'),
    gallery: [
      makeImage('Hazratganj Heritage House', '#0f172a'),
      makeImage('Hazratganj Garden View', '#10b981'),
      makeImage('Hazratganj Lounge', '#6366f1')
    ],
    rules: ['Garden upkeep shared', 'Security deposit mandatory'],
    requirements: ['Corporate lease preferred'],
    availability: 'Within 15 days',
    landlord: 'Neha Kapoor',
    address: 'Kaiserbagh Avenue, Hazratganj'
  },
  {
    id: 'rp-125',
    title: 'Indira Nagar Co-Live Suites',
    location: 'Indira Nagar',
    type: 'PG',
    bhk: 'Twin Sharing',
    rent: 12500,
    rating: 4.5,
    status: 'Filling Fast',
    occupancy: 'Women',
    furnished: 'Fully furnished',
    description: 'Smart co-living PG with biometric access, AI meal planner, and weekly housekeeping.',
    amenities: ['WiFi', 'AC', 'Lift'],
    image: makeImage('Indira Nagar Co-Live Suites', '#1e40af'),
    gallery: [
      makeImage('Indira Nagar Co-Live Suites', '#1e40af'),
      makeImage('Co-Live Lounge', '#ec4899'),
      makeImage('Co-Live Rooms', '#14b8a6')
    ],
    rules: ['No overnight guests', 'Quiet hours after 11 PM'],
    requirements: ['Student or working professional ID'],
    availability: 'Immediate',
    landlord: 'Vikram Singh',
    address: 'Faizabad Road, Indira Nagar'
  },
  {
    id: 'rp-138',
    title: 'Aliganj WorkHub Suites',
    location: 'Aliganj',
    type: 'Commercial',
    bhk: '1800 sq.ft',
    rent: 85000,
    rating: 4.8,
    status: 'Available',
    occupancy: 'Office',
    furnished: 'Customizable',
    description: 'Premium office space with AI occupancy analytics and smart utilities.',
    amenities: ['Parking', 'WiFi', 'Lift'],
    image: makeImage('Aliganj WorkHub Suites', '#10b981'),
    gallery: [
      makeImage('Aliganj WorkHub Suites', '#10b981'),
      makeImage('WorkHub Boardroom', '#0f172a'),
      makeImage('WorkHub Lounge', '#1e40af')
    ],
    rules: ['Business registration required', '24x7 access'],
    requirements: ['Company profile'],
    availability: 'Immediate',
    landlord: 'Rohit Bhatia',
    address: 'Sector L, Aliganj'
  },
  {
    id: 'rp-149',
    title: 'Jankipuram Emerald Enclave',
    location: 'Jankipuram',
    type: 'Flat',
    bhk: '2 BHK',
    rent: 23000,
    rating: 4.4,
    status: 'Available',
    occupancy: 'Family',
    furnished: 'Unfurnished',
    description: 'Affordable 2 BHK with AI-enabled rent reminders and secure access.',
    amenities: ['Parking', 'Pet Friendly'],
    image: makeImage('Jankipuram Emerald Enclave', '#4f46e5'),
    gallery: [
      makeImage('Jankipuram Emerald Enclave', '#4f46e5'),
      makeImage('Emerald Enclave Living', '#6366f1'),
      makeImage('Emerald Enclave Exterior', '#0f172a')
    ],
    rules: ['No major structural changes', 'Monthly maintenance fees'],
    requirements: ['Government ID'],
    availability: 'Immediate',
    landlord: 'Meera Joshi',
    address: 'Ring Road, Jankipuram'
  }
]
