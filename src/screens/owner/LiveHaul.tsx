import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ETA_STUB, formatTripDate } from '../../data'
import { useApp } from '../../context/AppContext'
import { MapStub } from '../../components/MapStub'
import { StatusChips } from '../../components/StatusChips'
import { TransporterCard } from '../../components/TransporterCard'

export function LiveHaul() {
  const { trip, status, advanceStatus, transporter } = useApp()
  const nav = useNavigate()

  useEffect(() => {
    if (status === 'Delivered') nav('/owner/delivered')
  }, [status, nav])

  const dateLine = [
    trip.pickupDate ? `Pickup ${formatTripDate(trip.pickupDate)}` : null,
    trip.dropoffDate ? `Dropoff ${formatTripDate(trip.dropoffDate)}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="screen">
      <header className="screen-head">
        <h1>Live haul</h1>
        <p className="muted">
          {trip.petName} · ETA {ETA_STUB}
        </p>
      </header>

      <MapStub label="Live tracking" />
      <TransporterCard t={transporter} />
      <StatusChips current={status} onAdvance={advanceStatus} />

      <div className="card soft">
        <div className="muted small">Route</div>
        <div>
          {trip.origin} → {trip.destination}
        </div>
        <div className="muted small" style={{ marginTop: 6 }}>
          Window {trip.pickupWindow} · Crate{' '}
          {trip.crateRequired ? 'required' : 'optional'}
          {dateLine ? ` · ${dateLine}` : ''}
        </div>
      </div>
    </div>
  )
}
