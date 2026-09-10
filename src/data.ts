import type { CompletedRide, FavoritePlace, PetProfile, TransporterProfile } from './types'

export const MOCK_TRANSPORTER: TransporterProfile = {
  name: 'Maya R.',
  vehicle: 'Ford Transit · Climate kennels',
  rating: 4.9,
  trips: 214,
  photoInitials: 'MR',
}

/** Example To addresses (placeholders for text inputs) */
export const DESTINATION_EXAMPLES = [
  'Westminster Kennel Club, New York, NY',
  'Purina Farms, Gray Summit, MO',
  'Orlando Dog Training Center, Orlando, FL',
  'AKC National Championship, Orlando, FL',
  'Hound Hollow Boarding Kennels, VA',
]

/** Example From addresses */
export const ORIGIN_EXAMPLES = [
  '123 Atlantic Ave, Brooklyn, NY',
  '4500 Guadalupe St, Austin, TX',
  '200 N Michigan Ave, Chicago, IL',
  'Boarding kennel, Denver, CO',
]

export const PICKUP_WINDOWS = [
  'Thu 6–8 AM',
  'Thu 8–10 AM',
  'Thu 12–2 PM',
  'Fri 6–8 AM',
]

/** Seeded completed hauls for owner Home → Previous rides */
export const MOCK_PREVIOUS_RIDES: CompletedRide[] = [
  {
    id: 'ride-1',
    eventType: 'Dog show',
    eventOther: '',
    origin: '123 Atlantic Ave, Brooklyn, NY',
    destination: 'Purina Farms, Gray Summit, MO',
    pickupDate: '2026-03-14',
    pickupTime: '06:00',
    dropoffDate: '2026-03-15',
    estDeliveryLabel: 'Sun, Mar 15 · 6:40 PM (estimate)',
    petName: 'Scout',
    breedSize: 'Border Collie · Medium',
    crateRequired: true,
    specialNotes: '',
    pickupWindow: 'Thu 6–8 AM',
    status: 'Delivered',
  },
  {
    id: 'ride-2',
    eventType: 'Boarding',
    eventOther: '',
    origin: '123 Atlantic Ave, Brooklyn, NY',
    destination: 'Hound Hollow Boarding Kennels, VA',
    pickupDate: '2026-02-01',
    pickupTime: '06:00',
    dropoffDate: '2026-02-01',
    estDeliveryLabel: 'Sun, Feb 1 · 2:20 PM (estimate)',
    petName: 'Scout',
    breedSize: 'Border Collie · Medium',
    crateRequired: true,
    specialNotes: 'Needs evening meds',
    pickupWindow: 'Fri 6–8 AM',
    status: 'Delivered',
  },
  {
    id: 'ride-3',
    eventType: 'Other',
    eventOther: 'Agility trial',
    origin: '4500 Guadalupe St, Austin, TX',
    destination: 'Orlando Dog Training Center, Orlando, FL',
    pickupDate: '2025-11-08',
    pickupTime: '08:00',
    dropoffDate: '2025-11-09',
    estDeliveryLabel: 'Sun, Nov 9 · 4:15 PM (estimate)',
    petName: 'Scout',
    breedSize: 'Border Collie · Medium',
    crateRequired: true,
    specialNotes: '',
    pickupWindow: 'Thu 8–10 AM',
    status: 'Delivered',
  },
]

/** Seeded saved places (venues / addresses — not transporters) */
export const MOCK_FAVORITES: FavoritePlace[] = [
  {
    id: 'fav-1',
    label: 'Purina Farms',
    address: 'Purina Farms, Gray Summit, MO',
  },
  {
    id: 'fav-2',
    label: 'Home · Brooklyn',
    address: '123 Atlantic Ave, Brooklyn, NY',
  },
]


/** Seeded pets for owner Home → Your pets */
export const MOCK_PETS: PetProfile[] = [
  {
    id: 'pet-1',
    name: 'Scout',
    breed: 'Border Collie',
    height: '20 in',
    weight: '38 lb',
    fixed: true,
    photoDataUrl: '',
  },
  {
    id: 'pet-2',
    name: 'Maple',
    breed: 'Beagle',
    height: '14 in',
    weight: '24 lb',
    fixed: false,
    photoDataUrl: '',
  },
]

export const CRATE_SIZES = ['S', 'M', 'L', 'XL']

export const MILES_STUB = 842
export const DURATION_STUB = '12 hr 40 min'
export const ETA_STUB = 'Sat 2:15 PM'

/** Build a Google Maps directions URL (no API key). */
export function mapsDirectionsUrl(origin: string, destination: string): string {
  const o = encodeURIComponent(origin.trim())
  const d = encodeURIComponent(destination.trim())
  return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}`
}

/** Format YYYY-MM-DD for display in later screens. */
export function formatTripDate(iso: string): string {
  if (!iso) return ''
  const [y, m, day] = iso.split('-').map(Number)
  if (!y || !m || !day) return iso
  const d = new Date(y, m - 1, day)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/** Prefer route-derived est delivery label; fall back to dropoff date. */
export function formatEstDelivery(
  estDeliveryLabel: string,
  dropoffDate: string,
): string {
  const label = estDeliveryLabel?.trim()
  if (label) return label
  return formatTripDate(dropoffDate)
}

/** Format pickup date + optional HH:mm. */
export function formatPickupDateTime(date: string, time: string): string {
  const d = formatTripDate(date)
  if (!d) return ''
  if (!time) return d
  const [hh, mm] = time.split(':').map(Number)
  if (Number.isNaN(hh)) return d
  const probe = new Date(2000, 0, 1, hh, mm || 0)
  const t = probe.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${d} · ${t}`
}

/** Display label for trip event type (includes Other custom text). */
export function formatEventLabel(
  eventType: string,
  eventOther: string,
): string {
  if (eventType === 'Other') {
    const t = eventOther.trim()
    return t ? `Other: ${t}` : 'Other'
  }
  return eventType
}

/** Short place label for list rows (first comma segment, truncated). */
export function shortPlace(addr: string, max = 26): string {
  const part = (addr.split(',')[0] || addr).trim()
  if (part.length <= max) return part
  return `${part.slice(0, max - 1)}…`
}
