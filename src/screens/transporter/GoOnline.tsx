import { useNavigate } from 'react-router-dom'
import { CRATE_SIZES } from '../../data'
import { useApp } from '../../context/AppContext'

export function GoOnline() {
  const { prefs, setPrefs } = useApp()
  const nav = useNavigate()

  function toggleCrate(size: string) {
    const has = prefs.crateSizes.includes(size)
    setPrefs({
      crateSizes: has
        ? prefs.crateSizes.filter((s) => s !== size)
        : [...prefs.crateSizes, size],
    })
  }

  return (
    <div className="screen">
      <header className="screen-head">
        <h1>Go online</h1>
        <p className="muted">Set long-haul availability for KennelCoach jobs.</p>
      </header>

      <label className="toggle-row card">
        <div>
          <div className="card-title">Available for long-haul</div>
          <div className="muted small">Animal-only · crate transport</div>
        </div>
        <input
          type="checkbox"
          checked={prefs.online}
          onChange={(e) => setPrefs({ online: e.target.checked })}
        />
      </label>

      <label className="field">
        <span>Max distance: {prefs.maxDistance} mi</span>
        <input
          type="range"
          min={100}
          max={1500}
          step={50}
          value={prefs.maxDistance}
          onChange={(e) => setPrefs({ maxDistance: Number(e.target.value) })}
        />
      </label>

      <div className="field">
        <span>Crate sizes OK</span>
        <div className="seg">
          {CRATE_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className={prefs.crateSizes.includes(s) ? 'on' : ''}
              onClick={() => toggleCrate(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn primary block"
        disabled={!prefs.online}
        onClick={() => nav('/transporter/job')}
      >
        {prefs.online ? 'Go online & wait for jobs' : 'Turn on availability'}
      </button>
    </div>
  )
}
