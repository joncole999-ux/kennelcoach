import { useNavigate, useParams } from 'react-router-dom'
import { formatEstDelivery, formatEventLabel, formatPickupDateTime } from '../../data'
import { useApp } from '../../context/AppContext'

export function RideSummary() {
  const { id } = useParams<{ id: string }>()
  const {
    previousRides,
    prefillFromRide,
    addFavorite,
    favorites,
  } = useApp()
  const nav = useNavigate()
  const ride = previousRides.find((r) => r.id === id)

  if (!ride) {
    return (
      <div className="screen">
        <header className="screen-head">
          <button type="button" className="back" onClick={() => nav('/owner')}>
            ← Back
          </button>
          <h1>Ride not found</h1>
          <p className="muted">That haul is no longer in your history.</p>
        </header>
        <button
          type="button"
          className="btn primary block"
          onClick={() => nav('/owner')}
        >
          Back to home
        </button>
      </div>
    )
  }

  function alreadySaved(address: string) {
    return favorites.some(
      (f) => f.address.toLowerCase() === address.trim().toLowerCase(),
    )
  }

  function savePlace(label: string, address: string) {
    addFavorite(label, address)
  }

  return (
    <div className="screen">
      <header className="screen-head">
        <button type="button" className="back" onClick={() => nav('/owner')}>
          ← Back
        </button>
        <h1>Trip summary</h1>
        <p className="muted">
          Read-only view of a completed haul. Book again to prefill a new trip.
        </p>
      </header>

      <div className="card summary">
        <div className="row">
          <span className="muted">Status</span>
          <span className="status-pill delivered">Delivered</span>
        </div>
        <div className="row">
          <span className="muted">Purpose</span>
          <span>{formatEventLabel(ride.eventType, ride.eventOther)}</span>
        </div>
        <div className="row">
          <span className="muted">From</span>
          <span>{ride.origin}</span>
        </div>
        <div className="row">
          <span className="muted">To</span>
          <span>{ride.destination}</span>
        </div>
        <div className="row">
          <span className="muted">Pickup</span>
          <span>
            {formatPickupDateTime(ride.pickupDate, ride.pickupTime) ||
              ride.pickupDate}
          </span>
        </div>
        {ride.estDeliveryLabel || ride.dropoffDate ? (
          <div className="row">
            <span className="muted">Est. delivery</span>
            <span>
              {formatEstDelivery(ride.estDeliveryLabel, ride.dropoffDate)}
            </span>
          </div>
        ) : null}
        <div className="row">
          <span className="muted">Pet</span>
          <span>
            {ride.petName}
            {ride.breedSize ? ` · ${ride.breedSize}` : ''}
          </span>
        </div>
        <div className="row">
          <span className="muted">Crate</span>
          <span>{ride.crateRequired ? 'Yes' : 'No'}</span>
        </div>
        {ride.specialNotes ? (
          <div className="row">
            <span className="muted">Notes</span>
            <span>{ride.specialNotes}</span>
          </div>
        ) : null}
      </div>

      <div className="fav-save-row">
        <button
          type="button"
          className="btn ghost small"
          disabled={alreadySaved(ride.origin)}
          onClick={() =>
            savePlace(
              ride.origin.split(',')[0]?.trim() || 'From place',
              ride.origin,
            )
          }
        >
          {alreadySaved(ride.origin) ? 'From saved' : 'Save From'}
        </button>
        <button
          type="button"
          className="btn ghost small"
          disabled={alreadySaved(ride.destination)}
          onClick={() =>
            savePlace(
              ride.destination.split(',')[0]?.trim() || 'To place',
              ride.destination,
            )
          }
        >
          {alreadySaved(ride.destination) ? 'To saved' : 'Save To'}
        </button>
      </div>

      <button
        type="button"
        className="btn primary block"
        onClick={() => {
          prefillFromRide(ride)
          nav('/owner/trip')
        }}
      >
        Book again
      </button>
    </div>
  )
}
