import type { TransporterProfile, UpcomingEvent } from './types'

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

export const UPCOMING: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Spring Spaniel Specialty',
    date: 'Sat · Apr 12',
    venue: 'Purina Farms',
  },
  {
    id: '2',
    title: 'Weekend boarding drop-off',
    date: 'Sun · May 4',
    venue: 'Hound Hollow',
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
