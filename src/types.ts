export type Mode = 'owner' | 'transporter'

export type EventType = 'Dog show' | 'Trial' | 'Other'

export type HaulStatus =
  | 'Pickup scheduled'
  | 'En route to you'
  | 'Pet loaded'
  | 'In transit'
  | 'Arriving at venue'
  | 'Delivered'

export const HAUL_STATUSES: HaulStatus[] = [
  'Pickup scheduled',
  'En route to you',
  'Pet loaded',
  'In transit',
  'Arriving at venue',
  'Delivered',
]

export interface TripDraft {
  eventType: EventType
  origin: string
  destination: string
  date: string
  petName: string
  breedSize: string
  crateRequired: boolean
  specialNotes: string
  pickupWindow: string
}

export interface TransporterProfile {
  name: string
  vehicle: string
  rating: number
  trips: number
  photoInitials: string
}

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  venue: string
}

export interface TransporterPrefs {
  online: boolean
  maxDistance: number
  crateSizes: string[]
}
