import { useNavigate } from 'react-router-dom'
import { MILES_STUB, formatEventLabel } from '../../data'
import { useApp } from '../../context/AppContext'

export function Complete() {
  const { trip, setJobAccepted, setPrefs, setStatus } = useApp()
  const nav = useNavigate()

  function finish() {
    setJobAccepted(false)
    setPrefs({ online: false })
    setStatus('Pickup scheduled')
    nav('/transporter')
  }

  return (
    <div className="screen">
      <header className="screen-head">
        <h1>Haul complete</h1>
        <p className="muted">Confirm venue handoff</p>
      </header>

      <div className="card">
        <label className="check-row">
          <input type="checkbox" defaultChecked />
          <span>
            Handed {trip.petName} to venue staff at {trip.destination}
          </span>
        </label>
        <label className="check-row">
          <input type="checkbox" defaultChecked />
          <span>Crate inspected & returned/left as arranged</span>
        </label>
      </div>

      <div className="card summary">
        <h2>Simple tally</h2>
        <div className="row">
          <span className="muted">Distance</span>
          <span>{MILES_STUB} mi</span>
        </div>
        <div className="row">
          <span className="muted">Event</span>
          <span>{formatEventLabel(trip.eventType, trip.eventOther)}</span>
        </div>
        <div className="row">
          <span className="muted">Payout</span>
          <span>Pay later — tracked offline</span>
        </div>
      </div>

      <button type="button" className="btn primary block" onClick={finish}>
        Done — go offline
      </button>
    </div>
  )
}
