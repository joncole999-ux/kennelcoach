import { useNavigate } from 'react-router-dom'
import { MILES_STUB } from '../../data'
import { useApp } from '../../context/AppContext'
import { MapStub } from '../../components/MapStub'

export function IncomingJob() {
  const { trip, setJobAccepted, setStatus } = useApp()
  const nav = useNavigate()

  function accept() {
    setJobAccepted(true)
    setStatus('Pickup scheduled')
    nav('/transporter/active')
  }

  function decline() {
    nav('/transporter')
  }

  return (
    <div className="screen">
      <header className="screen-head">
        <h1>Incoming job</h1>
        <p className="muted">New KennelCoach long-haul request</p>
      </header>

      <MapStub label="Job route" />

      <div className="card">
        <div className="card-title">
          {trip.origin.split('—')[0].trim()} → venue
        </div>
        <div className="muted">
          {trip.origin} → {trip.destination}
        </div>
        <div className="stats-row tight">
          <div className="stat">
            <div className="stat-val">{MILES_STUB}</div>
            <div className="muted small">miles</div>
          </div>
          <div className="stat">
            <div className="stat-val">{trip.eventType}</div>
            <div className="muted small">event</div>
          </div>
        </div>
        <ul className="detail-list">
          <li>
            Pet: <strong>{trip.petName}</strong> · {trip.breedSize}
          </li>
          <li>Crate: {trip.crateRequired ? 'Required' : 'Optional'}</li>
          <li>Window: {trip.pickupWindow}</li>
          {trip.specialNotes && <li>Notes: {trip.specialNotes}</li>}
        </ul>
      </div>

      <div className="btn-row">
        <button type="button" className="btn ghost" onClick={decline}>
          Decline
        </button>
        <button type="button" className="btn primary" onClick={accept}>
          Accept
        </button>
      </div>
    </div>
  )
}
