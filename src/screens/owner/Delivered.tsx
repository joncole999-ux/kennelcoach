import { useNavigate } from 'react-router-dom'
import { formatEventLabel, formatTripDate } from '../../data'
import { useApp } from '../../context/AppContext'
import { TransporterCard } from '../../components/TransporterCard'

export function Delivered() {
  const { trip, rating, setRating, transporter, resetTrip } = useApp()
  const nav = useNavigate()

  return (
    <div className="screen">
      <header className="screen-head">
        <h1>Delivered 🎉</h1>
        <p className="muted">
          {trip.petName} arrived at {trip.destination}.
        </p>
      </header>

      <div className="card summary">
        <div className="row">
          <span className="muted">Event</span>
          <span>{formatEventLabel(trip.eventType, trip.eventOther)}</span>
        </div>
        <div className="row">
          <span className="muted">From</span>
          <span>{trip.origin}</span>
        </div>
        <div className="row">
          <span className="muted">To</span>
          <span>{trip.destination}</span>
        </div>
        <div className="row">
          <span className="muted">Pickup date</span>
          <span>{formatTripDate(trip.pickupDate) || '—'}</span>
        </div>
        {trip.dropoffDate ? (
          <div className="row">
            <span className="muted">Dropoff date</span>
            <span>{formatTripDate(trip.dropoffDate)}</span>
          </div>
        ) : null}
        <div className="row">
          <span className="muted">Pickup window</span>
          <span>{trip.pickupWindow}</span>
        </div>
        <div className="row">
          <span className="muted">Crate</span>
          <span>{trip.crateRequired ? 'Yes' : 'No'}</span>
        </div>
        <div className="row">
          <span className="muted">Payment</span>
          <span>Pay later — no charge now</span>
        </div>
      </div>

      <TransporterCard t={transporter} />

      <div className="field">
        <span>Rate this haul</span>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={n <= rating ? 'on' : ''}
              onClick={() => setRating(n)}
              aria-label={`${n} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn primary block"
        onClick={() => {
          resetTrip()
          nav('/owner')
        }}
      >
        Back to home
      </button>
    </div>
  )
}
