import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  HaulStatus,
  Mode,
  TransporterPrefs,
  TripDraft,
} from '../types'
import { MOCK_TRANSPORTER } from '../data'

const defaultTrip: TripDraft = {
  eventType: 'Dog show',
  eventOther: '',
  origin: '123 Atlantic Ave, Brooklyn, NY',
  destination: 'Purina Farms, Gray Summit, MO',
  pickupDate: '2026-04-11',
  dropoffDate: '',
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
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('owner')
  const [trip, setTripState] = useState<TripDraft>(defaultTrip)
  const [status, setStatus] = useState<HaulStatus>('Pickup scheduled')
  const [rating, setRating] = useState(0)
  const [prefs, setPrefsState] = useState<TransporterPrefs>(defaultPrefs)
  const [jobAccepted, setJobAccepted] = useState(false)

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
    }),
    [mode, trip, status, rating, prefs, jobAccepted],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
