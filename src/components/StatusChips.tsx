import { HAUL_STATUSES, type HaulStatus } from '../types'

export function StatusChips({
  current,
  onAdvance,
}: {
  current: HaulStatus
  onAdvance?: () => void
}) {
  const idx = HAUL_STATUSES.indexOf(current)
  return (
    <div className="status-block">
      <div className="status-chips">
        {HAUL_STATUSES.map((s, i) => (
          <span
            key={s}
            className={`chip ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}
          >
            {s}
          </span>
        ))}
      </div>
      {onAdvance && current !== 'Delivered' && (
        <button type="button" className="btn ghost small" onClick={onAdvance}>
          Advance status (demo)
        </button>
      )}
    </div>
  )
}
