import { Outlet } from 'react-router-dom'
import { ModeSwitch } from './ModeSwitch'

export function PhoneShell() {
  return (
    <div className="page-bg">
      <div className="brand-bar">
        <div className="logo-mark" aria-hidden />
        <div>
          <div className="brand">KennelCoach</div>
          <div className="tagline">Animal-only long-haul transport</div>
        </div>
      </div>
      <div className="phone-frame">
        <div className="phone-notch" aria-hidden />
        <div className="phone-status">
          <span>9:41</span>
          <span className="dots">●●●</span>
        </div>
        <ModeSwitch />
        <main className="phone-content">
          <Outlet />
        </main>
      </div>
      <p className="disclaimer">
        Clickable MVP prototype · Pay later · Map stubs · No owner-in-car
      </p>
    </div>
  )
}
