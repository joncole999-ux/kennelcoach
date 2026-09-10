/** Drive-duration lookup: Google Maps (when key set) → OSRM/Nominatim → heuristic estimate. */

export type RouteSource = 'google' | 'osrm' | 'estimate'

export interface RouteDurationResult {
  durationSeconds: number
  distanceMeters: number | null
  source: RouteSource
  /** Short human label e.g. "12 hr 40 min" */
  durationLabel: string
  /** True when we fell back after a routing failure */
  isEstimate: boolean
  warning?: string
}

export interface ArrivalEstimate {
  dropoffDate: string
  /** Local display e.g. "Sat, Apr 11 · 8:40 PM" */
  estDeliveryLabel: string
  arrival: Date
}

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const OSRM = 'https://router.project-osrm.org/route/v1/driving'
const NOMINATIM_EMAIL = 'joncole999@gmail.com'

/** Default long-haul stub (~Brooklyn → Purina Farms scale). */
const HEURISTIC_SECONDS = 12 * 3600 + 40 * 60

function mapsKey(): string {
  try {
    return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() || ''
  } catch {
    return ''
  }
}

export function formatDurationLabel(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h <= 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}

/** Format local Date as YYYY-MM-DD */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Combine YYYY-MM-DD + HH:mm into a local Date */
export function combinePickupDateTime(date: string, time: string): Date | null {
  if (!date) return null
  const t = time && /^\d{1,2}:\d{2}/.test(time) ? time : '08:00'
  const [y, mo, d] = date.split('-').map(Number)
  const [hh, mm] = t.split(':').map(Number)
  if (!y || !mo || !d) return null
  const dt = new Date(y, mo - 1, d, hh || 0, mm || 0, 0, 0)
  if (Number.isNaN(dt.getTime())) return null
  return dt
}

export function computeArrival(
  pickupDate: string,
  pickupTime: string,
  durationSeconds: number,
  isEstimate: boolean,
): ArrivalEstimate | null {
  const start = combinePickupDateTime(pickupDate, pickupTime)
  if (!start) return null
  const arrival = new Date(start.getTime() + durationSeconds * 1000)
  const estDeliveryLabel =
    arrival.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }) + (isEstimate ? ' (estimate)' : '')
  return {
    dropoffDate: toIsoDate(arrival),
    estDeliveryLabel,
    arrival,
  }
}

interface LatLon {
  lat: number
  lon: number
}

async function geocodeNominatim(query: string): Promise<LatLon | null> {
  const url = new URL(NOMINATIM)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('email', NOMINATIM_EMAIL)
  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  const data = (await res.json()) as Array<{ lat?: string; lon?: string }>
  if (!data?.length || !data[0].lat || !data[0].lon) return null
  return { lat: Number(data[0].lat), lon: Number(data[0].lon) }
}

async function routeOsrm(from: LatLon, to: LatLon): Promise<RouteDurationResult | null> {
  const path = `${from.lon},${from.lat};${to.lon},${to.lat}`
  const url = `${OSRM}/${path}?overview=false&alternatives=false`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  const data = (await res.json()) as {
    code?: string
    routes?: Array<{ duration?: number; distance?: number }>
  }
  if (data.code !== 'Ok' || !data.routes?.[0]?.duration) return null
  const durationSeconds = Math.round(data.routes[0].duration)
  const distanceMeters =
    typeof data.routes[0].distance === 'number'
      ? Math.round(data.routes[0].distance)
      : null
  return {
    durationSeconds,
    distanceMeters,
    source: 'osrm',
    durationLabel: formatDurationLabel(durationSeconds),
    isEstimate: false,
  }
}

/**
 * Google Distance Matrix REST — structured for when a key exists.
 * Browser CORS often blocks this; caller should fall through on failure.
 */
async function routeGoogleMaps(
  origin: string,
  destination: string,
  key: string,
): Promise<RouteDurationResult | null> {
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json')
  url.searchParams.set('origins', origin)
  url.searchParams.set('destinations', destination)
  url.searchParams.set('mode', 'driving')
  url.searchParams.set('units', 'imperial')
  url.searchParams.set('key', key)
  const res = await fetch(url.toString())
  if (!res.ok) return null
  const data = (await res.json()) as {
    status?: string
    rows?: Array<{
      elements?: Array<{
        status?: string
        duration?: { value?: number }
        distance?: { value?: number }
      }>
    }>
  }
  if (data.status !== 'OK') return null
  const el = data.rows?.[0]?.elements?.[0]
  if (!el || el.status !== 'OK' || typeof el.duration?.value !== 'number') return null
  const durationSeconds = el.duration.value
  return {
    durationSeconds,
    distanceMeters:
      typeof el.distance?.value === 'number' ? el.distance.value : null,
    source: 'google',
    durationLabel: formatDurationLabel(durationSeconds),
    isEstimate: false,
  }
}

function heuristicResult(warning: string): RouteDurationResult {
  return {
    durationSeconds: HEURISTIC_SECONDS,
    distanceMeters: null,
    source: 'estimate',
    durationLabel: formatDurationLabel(HEURISTIC_SECONDS),
    isEstimate: true,
    warning,
  }
}

/**
 * Resolve drive duration From → To.
 * Prefers Google Maps when VITE_GOOGLE_MAPS_API_KEY is set, else OSRM
 * (Nominatim geocode + public router), else a labeled heuristic estimate.
 */
export async function getRouteDuration(
  origin: string,
  destination: string,
): Promise<RouteDurationResult> {
  const from = origin.trim()
  const to = destination.trim()
  if (!from || !to) {
    return heuristicResult('Enter From and To to estimate delivery.')
  }

  const key = mapsKey()
  if (key) {
    try {
      const g = await routeGoogleMaps(from, to, key)
      if (g) return g
    } catch {
      // CORS / network — fall through to free routing
    }
  }

  try {
    const [a, b] = await Promise.all([
      geocodeNominatim(from),
      geocodeNominatim(to),
    ])
    if (a && b) {
      const osrm = await routeOsrm(a, b)
      if (osrm) return osrm
    }
    return heuristicResult(
      'Could not route those addresses. Showing a fallback estimate.',
    )
  } catch {
    return heuristicResult(
      'Route lookup failed. Showing a fallback estimate.',
    )
  }
}
