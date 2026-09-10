import { useNavigate } from 'react-router-dom'
import { mapsDirectionsUrl } from '../../data'
import { useApp } from '../../context/AppContext'
import type { EventType } from '../../types'

const EVENTS: EventType[] = ['Dog show', 'Boarding', 'Other']

export function TripSetup() {
  const { trip, setTrip } = useApp()
  const nav = useNavigate()

  const from = trip.origin.trim()
  const to = trip.destination.trim()
  const canContinue = Boolean(from && to && trip.pickupDate)
  const mapsUrl =
    from && to ? mapsDirectionsUrl(trip.origin, trip.destination) : null

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
              onClick={() => setTrip({ eventType: e })}
            >
              {e}
            </button>
          ))}
        </div>
      </label>

      <label className="field">
        <span>From</span>
        <input
          type="text"
          placeholder="Pickup address or place"
          value={trip.origin}
          onChange={(e) => setTrip({ origin: e.target.value })}
          autoComplete="street-address"
        />
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
        <span>Dropoff / delivery date (optional)</span>
        <input
          type="date"
          value={trip.dropoffDate}
          min={trip.pickupDate || undefined}
          onChange={(e) => setTrip({ dropoffDate: e.target.value })}
        />
        <span className="hint muted">
          Leave blank if delivery is same-day as pickup.
        </span>
      </label>

      <button
        type="button"
        className="btn primary block"
        disabled={!canContinue}
        onClick={() => nav('/owner/pet')}
      >
        Continue
      </button>
    </div>
  )
}
