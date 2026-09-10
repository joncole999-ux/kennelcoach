import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { Mode } from '../types'

export function ModeSwitch() {
  const { mode, setMode, resetTrip, setJobAccepted, setPrefs } = useApp()
  const nav = useNavigate()

  function switchMode(m: Mode) {
    if (m === mode) return
    setMode(m)
    if (m === 'owner') {
      resetTrip()
      nav('/owner')
    } else {
      setJobAccepted(false)
      setPrefs({ online: false })
      nav('/transporter')
    }
  }

  return (
    <div className="mode-switch" role="tablist" aria-label="App mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'owner'}
        className={mode === 'owner' ? 'on' : ''}
        onClick={() => switchMode('owner')}
      >
        Owner
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'transporter'}
        className={mode === 'transporter' ? 'on' : ''}
        onClick={() => switchMode('transporter')}
      >
        Transporter
      </button>
    </div>
  )
}
