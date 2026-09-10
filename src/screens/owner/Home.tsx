import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatEventLabel, formatTripDate, shortPlace } from '../../data'
import { useApp } from '../../context/AppContext'

function petInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (name.trim().slice(0, 2) || '?').toUpperCase()
}

export function OwnerHome() {
  const {
    resetTrip,
    previousRides,
    favorites,
    addFavorite,
    removeFavorite,
    useFavoriteAs,
    pets,
  } = useApp()
  const nav = useNavigate()
  const [adding, setAdding] = useState(false)
  const [favLabel, setFavLabel] = useState('')
  const [favAddress, setFavAddress] = useState('')
  const [favError, setFavError] = useState('')

  function submitFavorite() {
    setFavError('')
    const created = addFavorite(favLabel, favAddress)
    if (!created) {
      setFavError(
        !favLabel.trim() || !favAddress.trim()
          ? 'Label and address are required.'
          : 'That address is already saved.',
      )
      return
    }
    setFavLabel('')
    setFavAddress('')
    setAdding(false)
  }

  return (
    <div className="screen home-screen">
      <div className="home-scroll">
        <header className="screen-head">
          <h1>Hello, Alex</h1>
          <p className="muted">Ship your pet to the show — you stay home.</p>
        </header>

        <section className="section pets-section">
          <div className="section-head-row">
            <h2>Your pets</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => nav('/owner/pets/new')}
            >
              Add pet
            </button>
          </div>
          {pets.length === 0 ? (
            <p className="muted small empty-copy">
              No pets yet. Add your first traveler.
            </p>
          ) : (
            <ul className="pet-chip-row">
              {pets.map((pet) => (
                <li key={pet.id} className="pet-chip">
                  <div className="pet-avatar" aria-hidden>
                    {pet.photoDataUrl ? (
                      <img src={pet.photoDataUrl} alt="" />
                    ) : (
                      <span>{petInitials(pet.name)}</span>
                    )}
                  </div>
                  <div className="pet-chip-meta">
                    <div className="card-title">{pet.name}</div>
                    <div className="muted small">
                      {pet.breed || 'Breed TBD'}
                      {pet.weight ? ` · ${pet.weight}` : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="section">
          <h2>Previous rides</h2>
          {previousRides.length === 0 ? (
            <p className="muted small empty-copy">
              No completed hauls yet. Book a haul to get started.
            </p>
          ) : (
            <ul className="list">
              {previousRides.map((ride) => (
                <li key={ride.id}>
                  <button
                    type="button"
                    className="card list-card tap-card"
                    onClick={() => nav(`/owner/rides/${ride.id}`)}
                  >
                    <div className="card-title">
                      {formatEventLabel(ride.eventType, ride.eventOther)}
                    </div>
                    <div className="muted small route-line">
                      {shortPlace(ride.origin)} → {shortPlace(ride.destination)}
                    </div>
                    <div className="row-meta">
                      <span className="muted small">
                        {formatTripDate(ride.pickupDate) || ride.pickupDate}
                      </span>
                      <span className="status-pill delivered">Delivered</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="section">
          <div className="section-head-row">
            <h2>Favorites</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setAdding((v) => !v)
                setFavError('')
              }}
            >
              {adding ? 'Cancel' : 'Add favorite'}
            </button>
          </div>

          {adding && (
            <div className="card soft add-fav-form">
              <label className="field">
                <span>Label</span>
                <input
                  type="text"
                  placeholder="e.g. Purina Farms"
                  value={favLabel}
                  onChange={(e) => setFavLabel(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="field">
                <span>Address</span>
                <input
                  type="text"
                  placeholder="Venue or street address"
                  value={favAddress}
                  onChange={(e) => setFavAddress(e.target.value)}
                  autoComplete="street-address"
                />
              </label>
              {favError && (
                <p className="hint field-error" role="alert">
                  {favError}
                </p>
              )}
              <button
                type="button"
                className="btn primary block small"
                onClick={submitFavorite}
              >
                Save place
              </button>
            </div>
          )}

          {favorites.length === 0 ? (
            <p className="muted small empty-copy">
              No saved places yet. Add a venue or save From/To from a previous
              ride.
            </p>
          ) : (
            <ul className="list">
              {favorites.map((fav) => (
                <li key={fav.id} className="card list-card fav-card">
                  <div className="card-title">{fav.label}</div>
                  <div className="muted small">{fav.address}</div>
                  <div className="fav-actions">
                    <button
                      type="button"
                      className="btn ghost small"
                      onClick={() => {
                        useFavoriteAs(fav, 'from')
                        nav('/owner/trip')
                      }}
                    >
                      Use as From
                    </button>
                    <button
                      type="button"
                      className="btn ghost small"
                      onClick={() => {
                        useFavoriteAs(fav, 'to')
                        nav('/owner/trip')
                      }}
                    >
                      Use as To
                    </button>
                    <button
                      type="button"
                      className="link-btn danger"
                      onClick={() => removeFavorite(fav.id)}
                      aria-label={`Remove ${fav.label}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="hint card soft">
          <strong>Crate assumed.</strong> KennelCoach moves animals only — no
          owner rides along. Pay later after delivery.
        </div>
      </div>

      <div className="home-footer">
        <Link
          to="/owner/trip"
          className="btn primary block"
          onClick={() => resetTrip()}
        >
          Book a haul
        </Link>
      </div>
    </div>
  )
}
