import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mapsDirectionsUrl } from '../../data'
import { useApp } from '../../context/AppContext'
import type { EventType } from '../../types'
import {
  computeArrival,
  getRouteDuration,
} from '../../lib/routeDuration'

const EVENTS: EventType[] = ['Dog show', 'Boarding', 'Other']

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const fallback = `${lat.toFixed(5)}, ${lon.toFixed(5)}`
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('format', 'json')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lon))
    url.searchParams.set('zoom', '18')
    url.searchParams.set('addressdetails', '0')
    url.searchParams.set('email', 'joncole999@gmail.com')
    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return fallback
    const data = (await res.json()) as { display_name?: string }
    const name = data.display_name?.trim()
    return name || fallback
  } catch {
    return fallback
  }
}

export function TripSetup() {
  const { trip, setTrip } = useApp()
  const nav = useNavigate()
  const [geoBusy, setGeoBusy] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [routeBusy, setRouteBusy] = useState(false)
  const [routeError, setRouteError] = useState('')
  const routeSeq = useRef(0)

  const from = trip.origin.trim()
  const to = trip.destination.trim()
  const otherOk =
    trip.eventType !== 'Other' || Boolean(trip.eventOther.trim())
  const canContinue = Boolean(
    from && to && trip.pickupDate && trip.pickupTime && otherOk,
  )
  const mapsUrl =
    from && to ? mapsDirectionsUrl(trip.origin, trip.destination) : null

  // Recalculate est. delivery when From, To, or pickup date/time changes
  useEffect(() => {
    if (!from || !to || !trip.pickupDate || !trip.pickupTime) {
      setRouteBusy(false)
      setRouteError('')
      if (
        trip.dropoffDate ||
        trip.estDeliveryLabel ||
        trip.routeDurationLabel ||
        trip.routeSource
      ) {
        setTrip({
          dropoffDate: '',
          estDeliveryLabel: '',
          routeDurationLabel: '',
          routeSource: '',
        })
      }
      return
    }

    const seq = ++routeSeq.current
    setRouteBusy(true)
    setRouteError('')

    const timer = window.setTimeout(async () => {
      try {
        const route = await getRouteDuration(from, to)
        if (seq !== routeSeq.current) return
        const arrival = computeArrival(
          trip.pickupDate,
          trip.pickupTime,
          route.durationSeconds,
          route.isEstimate,
        )
        if (!arrival) {
          setRouteBusy(false)
          setRouteError('Could not compute delivery from pickup time.')
          return
        }
        setTrip({
          dropoffDate: arrival.dropoffDate,
          estDeliveryLabel: arrival.estDeliveryLabel,
          routeDurationLabel: route.durationLabel,
          routeSource: route.source,
        })
        setRouteError(route.warning || '')
        setRouteBusy(false)
      } catch {
        if (seq !== routeSeq.current) return
        setRouteBusy(false)
        setRouteError('Route lookup failed. Try again or check addresses.')
        setTrip({
          dropoffDate: '',
          estDeliveryLabel: '',
          routeDurationLabel: '',
          routeSource: '',
        })
      }
    }, 450)

    return () => {
      window.clearTimeout(timer)
    }
    // setTrip is stable enough via context; include fields that drive ETA
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, trip.pickupDate, trip.pickupTime])

  function selectEvent(e: EventType) {
    if (e === 'Other') {
      setTrip({ eventType: e })
    } else {
      setTrip({ eventType: e, eventOther: '' })
    }
  }

  function useMyLocation() {
    setGeoError('')
    if (!navigator.geolocation) {
      setGeoError('Location is not supported in this browser.')
      return
    }
    setGeoBusy(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const label = await reverseGeocode(latitude, longitude)
          setTrip({ origin: label })
          setGeoError('')
        } catch {
          setTrip({
            origin: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          })
        } finally {
          setGeoBusy(false)
        }
      },
      (err) => {
        setGeoBusy(false)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Enter From address manually.')
        } else if (err.code === err.TIMEOUT) {
          setGeoError('Location timed out. Try again or type the address.')
        } else {
          setGeoError('Could not get location. Enter From address manually.')
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  }

  const sourceHint =
    trip.routeSource === 'google'
      ? 'From Google Maps drive time'
      : trip.routeSource === 'osrm'
        ? 'From OpenStreetMap routing (OSRM)'
        : trip.routeSource === 'estimate'
          ? 'Fallback estimate — not live routing'
          : ''

  return (
    <div className="screen">
      <header className="screen-head">
        <button type="button" className="back" onClick={() => nav('/owner')}>
          ← Back
        </button>
        <h1>Trip setup</h1>
        <p className="muted">Where is the pet going?</p>
      </header>

      <label className="field">
        <span>Event type</span>
        <div className="seg">
          {EVENTS.map((e) => (
            <button
              key={e}
              type="button"
              className={trip.eventType === e ? 'on' : ''}
              onClick={() => selectEvent(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </label>

      {trip.eventType === 'Other' && (
        <label className="field">
          <span>What is the event?</span>
          <input
            type="text"
            required
            placeholder="e.g. Agility trial, vet visit…"
            value={trip.eventOther}
            onChange={(e) => setTrip({ eventOther: e.target.value })}
            autoComplete="off"
          />
        </label>
      )}

      <label className="field">
        <span>From</span>
        <div className="input-with-action">
          <input
            type="text"
            placeholder="Pickup address or place"
            value={trip.origin}
            onChange={(e) => {
              setGeoError('')
              setTrip({ origin: e.target.value })
            }}
            autoComplete="street-address"
          />
          <button
            type="button"
            className="geo-btn"
            onClick={useMyLocation}
            disabled={geoBusy}
            title="Use my location"
            aria-label="Use my location"
          >
            {geoBusy ? (
              <span className="geo-busy" aria-hidden>
                …
              </span>
            ) : (
              <svg
                className="compass-icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
                <path
                  d="M12 7.2l2.4 7.2-2.4-1.4-2.4 1.4z"
                  fill="currentColor"
                />
                <circle cx="12" cy="12" r="1.2" fill="#fff" />
              </svg>
            )}
          </button>
        </div>
        {geoError && (
          <span className="hint field-error" role="alert">
            {geoError}
          </span>
        )}
      </label>

      <label className="field">
        <span>To</span>
        <input
          type="text"
          placeholder="Dropoff address or place"
          value={trip.destination}
          onChange={(e) => setTrip({ destination: e.target.value })}
          autoComplete="street-address"
        />
      </label>

      {mapsUrl && (
        <p className="hint maps-link">
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            Open route in Google Maps
          </a>
        </p>
      )}

      <div className="field-row">
        <label className="field">
          <span>Pickup date</span>
          <input
            type="date"
            required
            value={trip.pickupDate}
            onChange={(e) => setTrip({ pickupDate: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Pickup time</span>
          <input
            type="time"
            required
            value={trip.pickupTime}
            onChange={(e) => setTrip({ pickupTime: e.target.value })}
          />
        </label>
      </div>

      <div className="field">
        <span>Est. delivery</span>
        <div
          className="readonly-box"
          aria-live="polite"
          aria-busy={routeBusy}
        >
          {routeBusy ? (
            <span className="muted">Calculating route…</span>
          ) : trip.estDeliveryLabel ? (
            <>
              <strong>{trip.estDeliveryLabel}</strong>
              {trip.routeDurationLabel && (
                <span className="muted small">
                  {' '}
                  · {trip.routeDurationLabel} drive
                </span>
              )}
            </>
          ) : (
            <span className="muted">
              Enter From, To, and pickup to estimate arrival
            </span>
          )}
        </div>
        {sourceHint && !routeBusy && trip.estDeliveryLabel && (
          <span className="hint muted">{sourceHint}</span>
        )}
        {routeError && (
          <span className="hint field-error" role="alert">
            {routeError}
          </span>
        )}
      </div>

      <button
        type="button"
        className="btn primary block"
        disabled={!canContinue || routeBusy}
        onClick={() => nav('/owner/pet')}
      >
        Continue
      </button>
    </div>
  )
}
