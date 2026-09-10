import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatEstDelivery, formatPickupDateTime } from '../../data'
import { useApp } from '../../context/AppContext'
import { MapStub } from '../../components/MapStub'
import { StatusChips } from '../../components/StatusChips'

export function ActiveHaul() {
  const { trip, status, advanceStatus, jobAccepted } = useApp()
  const nav = useNavigate()

  useEffect(() => {
    if (!jobAccepted) nav('/transporter')
  }, [jobAccepted, nav])

  useEffect(() => {
    if (status === 'Delivered') nav('/transporter/complete')
  }, [status, nav])

  return (
    <div className="screen">
      <header className="screen-head">
        <h1>Active haul</h1>
        <p className="muted">
          {trip.petName} · {trip.destination}
        </p>
      </header>

      <MapStub label="Navigation stub" />

      <button type="button" className="btn ghost block" disabled>
        Open turn-by-turn (stub)
      </button>

      <StatusChips current={status} onAdvance={advanceStatus} />

      <div className="card soft">
        <div className="muted small">From → To</div>
        <div>
          {trip.origin} → {trip.destination}
        </div>
        <div className="muted small" style={{ marginTop: 6 }}>
          {trip.pickupDate && (
            <>Pickup {formatPickupDateTime(trip.pickupDate, trip.pickupTime)}</>
          )}
          {trip.pickupDate &&
            (trip.estDeliveryLabel || trip.dropoffDate) &&
            ' · '}
          {(trip.estDeliveryLabel || trip.dropoffDate) && (
            <>
              Est. delivery{' '}
              {formatEstDelivery(trip.estDeliveryLabel, trip.dropoffDate)}
            </>
          )}
          {(trip.pickupDate || trip.estDeliveryLabel || trip.dropoffDate) &&
            ' · '}
          Confirm venue staff on delivery
        </div>
      </div>
    </div>
  )
}
