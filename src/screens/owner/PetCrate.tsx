import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export function PetCrate() {
  const { trip, setTrip } = useApp()
  const nav = useNavigate()

  return (
    <div className="screen">
      <header className="screen-head">
        <button type="button" className="back" onClick={() => nav('/owner/trip')}>
          ← Back
        </button>
        <h1>Pet + crate</h1>
        <p className="muted">Travelers ride in crates — default on.</p>
      </header>

      <label className="field">
        <span>Pet name</span>
        <input
          value={trip.petName}
          onChange={(e) => setTrip({ petName: e.target.value })}
          placeholder="Scout"
        />
      </label>

      <label className="field">
        <span>Breed / size</span>
        <input
          value={trip.breedSize}
          onChange={(e) => setTrip({ breedSize: e.target.value })}
          placeholder="Border Collie · Medium"
        />
      </label>

      <label className="toggle-row card">
        <div>
          <div className="card-title">Crate required</div>
          <div className="muted small">Recommended for all long-haul hauls</div>
        </div>
        <input
          type="checkbox"
          checked={trip.crateRequired}
          onChange={(e) => setTrip({ crateRequired: e.target.checked })}
        />
      </label>

      <label className="field">
        <span>Special handling notes</span>
        <textarea
          rows={3}
          value={trip.specialNotes}
          onChange={(e) => setTrip({ specialNotes: e.target.value })}
          placeholder="Anxiety meds, feeding schedule…"
        />
      </label>

      <button
        type="button"
        className="btn primary block"
        onClick={() => nav('/owner/pickup')}
      >
        Continue
      </button>
    </div>
  )
}
