import { useNavigate } from 'react-router-dom'
import { DESTINATIONS, ORIGINS } from '../../data'
import { useApp } from '../../context/AppContext'
import type { EventType } from '../../types'

const EVENTS: EventType[] = ['Dog show', 'Trial', 'Other']

export function TripSetup() {
  const { trip, setTrip } = useApp()
  const nav = useNavigate()

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
        <span>Origin</span>
        <select
          value={trip.origin}
          onChange={(e) => setTrip({ origin: e.target.value })}
        >
          {ORIGINS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Destination (venue)</span>
        <select
          value={trip.destination}
          onChange={(e) => setTrip({ destination: e.target.value })}
        >
          {DESTINATIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Pickup date</span>
        <input
          type="date"
          value={trip.date}
          onChange={(e) => setTrip({ date: e.target.value })}
        />
      </label>

      <button
        type="button"
        className="btn primary block"
        onClick={() => nav('/owner/pet')}
      >
        Continue
      </button>
    </div>
  )
}
