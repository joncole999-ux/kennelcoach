import type { TransporterProfile } from '../types'

export function TransporterCard({ t }: { t: TransporterProfile }) {
  return (
    <div className="card transporter-card">
      <div className="avatar">{t.photoInitials}</div>
      <div className="tc-body">
        <div className="tc-name">{t.name}</div>
        <div className="muted small">{t.vehicle}</div>
        <div className="tc-meta">
          ★ {t.rating} · {t.trips} long-haul trips
        </div>
      </div>
    </div>
  )
}
