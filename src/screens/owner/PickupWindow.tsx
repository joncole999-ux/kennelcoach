import { useNavigate } from 'react-router-dom'
import { DURATION_STUB, MILES_STUB, PICKUP_WINDOWS } from '../../data'
import { useApp } from '../../context/AppContext'
import { MapStub } from '../../components/MapStub'

export function PickupWindow() {
  const { trip, setTrip } = useApp()
  const nav = useNavigate()

  return (
    <div className="screen">
      <header className="screen-head">
        <button type="button" className="back" onClick={() => nav('/owner/pet')}>
          ← Back
        </button>
        <h1>Pickup window</h1>
        <p className="muted">Choose when the transporter arrives.</p>
      </header>

      <MapStub label="Origin → venue" />

      <div className="stats-row">
        <div className="stat">
          <div className="stat-val">{MILES_STUB}</div>
          <div className="muted small">miles (stub)</div>
        </div>
        <div className="stat">
          <div className="stat-val">{DURATION_STUB}</div>
          <div className="muted small">drive time</div>
        </div>
      </div>

      <div className="field">
        <span>Pickup window</span>
        <div className="window-grid">
          {PICKUP_WINDOWS.map((w) => (
            <button
              key={w}
              type="button"
              className={`window ${trip.pickupWindow === w ? 'on' : ''}`}
              onClick={() => setTrip({ pickupWindow: w })}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn primary block"
        onClick={() => nav('/owner/matching')}
      >
        Find a transporter
      </button>
    </div>
  )
}
