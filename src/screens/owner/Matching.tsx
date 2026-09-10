import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export function Matching() {
  const nav = useNavigate()
  const { setStatus } = useApp()

  useEffect(() => {
    setStatus('Pickup scheduled')
    const t = setTimeout(() => nav('/owner/live'), 1800)
    return () => clearTimeout(t)
  }, [nav, setStatus])

  return (
    <div className="screen center-screen">
      <div className="spinner" aria-hidden />
      <h1>Finding a transporter…</h1>
      <p className="muted">Matching crate-capable long-haul drivers near you.</p>
      <button
        type="button"
        className="btn ghost"
        onClick={() => nav('/owner/live')}
      >
        Skip
      </button>
    </div>
  )
}
