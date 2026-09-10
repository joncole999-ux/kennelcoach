import type { TransporterProfile, UpcomingEvent } from './types'

export const MOCK_TRANSPORTER: TransporterProfile = {
  name: 'Maya R.',
  vehicle: 'Ford Transit · Climate kennels',
  rating: 4.9,
  trips: 214,
  photoInitials: 'MR',
}

export const DESTINATIONS = [
  'Westminster Kennel Club · NYC',
  'Purina Farms · Gray Summit, MO',
  'Orlando Dog Training Center',
  'AKC National Championship · Orlando',
  'Hound Hollow Trial Grounds · VA',
]

export const ORIGINS = [
  'Home — Brooklyn, NY',
  'Home — Austin, TX',
  'Home — Chicago, IL',
  'Boarding kennel — Denver, CO',
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
    title: 'Regional Obedience Trial',
    date: 'Sun · May 4',
    venue: 'Hound Hollow',
  },
]

export const CRATE_SIZES = ['S', 'M', 'L', 'XL']

export const MILES_STUB = 842
export const DURATION_STUB = '12 hr 40 min'
export const ETA_STUB = 'Sat 2:15 PM'
