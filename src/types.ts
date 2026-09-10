export type Mode = 'owner' | 'transporter'

export type EventType = 'Dog show' | 'Boarding' | 'Other'

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
  /** Free-text when eventType is Other */
  eventOther: string
  /** From address / place — Maps origin */
  origin: string
  /** To address / place — Maps destination */
  destination: string
  /** Required pickup / start transport date (YYYY-MM-DD) */
  pickupDate: string
  /** Pickup clock time HH:mm (local) — used with route duration for ETA */
  pickupTime: string
  /** Derived dropoff / delivery date (YYYY-MM-DD) from route + pickup */
  dropoffDate: string
  /** Read-only display label for estimated delivery (Maps/OSRM/estimate) */
  estDeliveryLabel: string
  /** Drive duration label e.g. "12 hr 40 min" */
  routeDurationLabel: string
  /** google | osrm | estimate | empty */
  routeSource: string
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

export interface CompletedRide {
  id: string
  eventType: EventType
  eventOther: string
  origin: string
  destination: string
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  estDeliveryLabel: string
  petName: string
  breedSize: string
  crateRequired: boolean
  specialNotes: string
  pickupWindow: string
  status: 'Delivered'
}

export interface FavoritePlace {
  id: string
  label: string
  address: string
}

export interface TransporterPrefs {
  online: boolean
  maxDistance: number
  crateSizes: string[]
}

export interface PetProfile {
  id: string
  name: string
  breed: string
  height: string
  weight: string
  fixed: boolean
  /** data URL or empty for initials avatar */
  photoDataUrl: string
}

