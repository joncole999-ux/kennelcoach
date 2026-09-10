import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  CompletedRide,
  FavoritePlace,
  HaulStatus,
  Mode,
  PetProfile,
  TransporterPrefs,
  TripDraft,
} from '../types'
import {
  MOCK_FAVORITES,
  MOCK_PETS,
  MOCK_PREVIOUS_RIDES,
  MOCK_TRANSPORTER,
} from '../data'

const defaultTrip: TripDraft = {
  eventType: 'Dog show',
  eventOther: '',
  origin: '123 Atlantic Ave, Brooklyn, NY',
  destination: 'Purina Farms, Gray Summit, MO',
  pickupDate: '2026-04-11',
  pickupTime: '08:00',
  dropoffDate: '',
  estDeliveryLabel: '',
  routeDurationLabel: '',
  routeSource: '',
  petName: 'Scout',
  breedSize: 'Border Collie · Medium',
  crateRequired: true,
  specialNotes: '',
  pickupWindow: 'Thu 6–8 AM',
}

const defaultPrefs: TransporterPrefs = {
  online: false,
  maxDistance: 1000,
  crateSizes: ['M', 'L', 'XL'],
}

interface AppState {
  mode: Mode
  setMode: (m: Mode) => void
  trip: TripDraft
  setTrip: (t: Partial<TripDraft>) => void
  resetTrip: () => void
  /** Prefill trip from a completed ride for rebook (keeps pet/crate/purpose/route/dates). */
  prefillFromRide: (ride: CompletedRide) => void
  /** Start a new booking using a favorite as From or To. */
  useFavoriteAs: (fav: FavoritePlace, which: 'from' | 'to') => void
  status: HaulStatus
  setStatus: (s: HaulStatus) => void
  advanceStatus: () => void
  rating: number
  setRating: (n: number) => void
  prefs: TransporterPrefs
  setPrefs: (p: Partial<TransporterPrefs>) => void
  jobAccepted: boolean
  setJobAccepted: (v: boolean) => void
  transporter: typeof MOCK_TRANSPORTER
  previousRides: CompletedRide[]
  recordCompletedRide: (ride?: Partial<CompletedRide>) => void
  favorites: FavoritePlace[]
  addFavorite: (label: string, address: string) => FavoritePlace | null
  removeFavorite: (id: string) => void
  pets: PetProfile[]
  addPet: (pet: Omit<PetProfile, 'id'>) => PetProfile | null
}

const AppContext = createContext<AppState | null>(null)

let idCounter = 100

function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('owner')
  const [trip, setTripState] = useState<TripDraft>(defaultTrip)
  const [status, setStatus] = useState<HaulStatus>('Pickup scheduled')
  const [rating, setRating] = useState(0)
  const [prefs, setPrefsState] = useState<TransporterPrefs>(defaultPrefs)
  const [jobAccepted, setJobAccepted] = useState(false)
  const [previousRides, setPreviousRides] =
    useState<CompletedRide[]>(MOCK_PREVIOUS_RIDES)
  const [favorites, setFavorites] = useState<FavoritePlace[]>(MOCK_FAVORITES)
  const [pets, setPets] = useState<PetProfile[]>(MOCK_PETS)

  const value = useMemo<AppState>(
    () => ({
      mode,
      setMode,
      trip,
      setTrip: (partial) => setTripState((t) => ({ ...t, ...partial })),
      resetTrip: () => {
        setTripState(defaultTrip)
        setStatus('Pickup scheduled')
        setRating(0)
      },
      prefillFromRide: (ride) => {
        setTripState({
          eventType: ride.eventType,
          eventOther: ride.eventOther,
          origin: ride.origin,
          destination: ride.destination,
          pickupDate: ride.pickupDate,
          pickupTime: ride.pickupTime || '08:00',
          dropoffDate: ride.dropoffDate,
          estDeliveryLabel: ride.estDeliveryLabel || '',
          routeDurationLabel: '',
          routeSource: '',
          petName: ride.petName,
          breedSize: ride.breedSize,
          crateRequired: ride.crateRequired,
          specialNotes: ride.specialNotes,
          pickupWindow: ride.pickupWindow,
        })
        setStatus('Pickup scheduled')
        setRating(0)
      },
      useFavoriteAs: (fav, which) => {
        setTripState({
          ...defaultTrip,
          origin: which === 'from' ? fav.address : '',
          destination: which === 'to' ? fav.address : '',
          pickupDate: '',
          pickupTime: '08:00',
          dropoffDate: '',
          estDeliveryLabel: '',
          routeDurationLabel: '',
          routeSource: '',
        })
        setStatus('Pickup scheduled')
        setRating(0)
      },
      status,
      setStatus,
      advanceStatus: () => {
        const order: HaulStatus[] = [
          'Pickup scheduled',
          'En route to you',
          'Pet loaded',
          'In transit',
          'Arriving at venue',
          'Delivered',
        ]
        const i = order.indexOf(status)
        if (i < order.length - 1) setStatus(order[i + 1])
      },
      rating,
      setRating,
      prefs,
      setPrefs: (partial) => setPrefsState((p) => ({ ...p, ...partial })),
      jobAccepted,
      setJobAccepted,
      transporter: MOCK_TRANSPORTER,
      previousRides,
      recordCompletedRide: (partial) => {
        const ride: CompletedRide = {
          id: nextId('ride'),
          eventType: trip.eventType,
          eventOther: trip.eventOther,
          origin: trip.origin,
          destination: trip.destination,
          pickupDate: trip.pickupDate,
          pickupTime: trip.pickupTime,
          dropoffDate: trip.dropoffDate,
          estDeliveryLabel: trip.estDeliveryLabel,
          petName: trip.petName,
          breedSize: trip.breedSize,
          crateRequired: trip.crateRequired,
          specialNotes: trip.specialNotes,
          pickupWindow: trip.pickupWindow,
          status: 'Delivered',
          ...partial,
        }
        setPreviousRides((list) => [ride, ...list])
      },
      favorites,
      addFavorite: (label, address) => {
        const lab = label.trim()
        const addr = address.trim()
        if (!lab || !addr) return null
        const dup = favorites.some(
          (f) => f.address.toLowerCase() === addr.toLowerCase(),
        )
        if (dup) return null
        const fav: FavoritePlace = { id: nextId('fav'), label: lab, address: addr }
        setFavorites((list) => [fav, ...list])
        return fav
      },
      removeFavorite: (id) => {
        setFavorites((list) => list.filter((f) => f.id !== id))
      },
      pets,
      addPet: (pet) => {
        const name = pet.name.trim()
        if (!name) return null
        const created: PetProfile = {
          ...pet,
          id: nextId('pet'),
          name,
          breed: pet.breed.trim(),
          height: pet.height.trim(),
          weight: pet.weight.trim(),
        }
        setPets((list) => [...list, created])
        return created
      },
    }),
    [
      mode,
      trip,
      status,
      rating,
      prefs,
      jobAccepted,
      previousRides,
      favorites,
      pets,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
