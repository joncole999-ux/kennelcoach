import { Link } from 'react-router-dom'
import { UPCOMING } from '../../data'
import { useApp } from '../../context/AppContext'

export function OwnerHome() {
  const { resetTrip } = useApp()
  return (
    <div className="screen">
      <header className="screen-head">
        <h1>Hello, Alex</h1>
        <p className="muted">Ship your pet to the show — you stay home.</p>
      </header>

      <Link
        to="/owner/trip"
        className="btn primary block"
        onClick={() => resetTrip()}
      >
        Book a haul
      </Link>

      <section className="section">
        <h2>Upcoming events</h2>
        <ul className="list">
          {UPCOMING.map((e) => (
            <li key={e.id} className="card list-card">
              <div className="card-title">{e.title}</div>
              <div className="muted small">
                {e.date} · {e.venue}
              </div>
              <Link
                to="/owner/trip"
                className="link"
                onClick={() => resetTrip()}
              >
                Book haul →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="hint card soft">
        <strong>Crate assumed.</strong> KennelCoach moves animals only — no
        owner rides along. Pay later after delivery.
      </div>
    </div>
  )
}
