export function MapStub({ label = 'Route map' }: { label?: string }) {
  return (
    <div className="map-stub" role="img" aria-label={label}>
      <div className="map-grid" />
      <div className="map-route" />
      <div className="map-pin origin" aria-hidden>
        <span>A</span>
      </div>
      <div className="map-pin dest" aria-hidden>
        <span>B</span>
      </div>
      <span className="map-label">{label} · stub</span>
    </div>
  )
}
