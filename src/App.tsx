import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { PhoneShell } from './components/PhoneShell'
import { OwnerHome } from './screens/owner/Home'
import { TripSetup } from './screens/owner/TripSetup'
import { PetCrate } from './screens/owner/PetCrate'
import { PickupWindow } from './screens/owner/PickupWindow'
import { Matching } from './screens/owner/Matching'
import { LiveHaul } from './screens/owner/LiveHaul'
import { Delivered } from './screens/owner/Delivered'
import { GoOnline } from './screens/transporter/GoOnline'
import { IncomingJob } from './screens/transporter/IncomingJob'
import { ActiveHaul } from './screens/transporter/ActiveHaul'
import { Complete } from './screens/transporter/Complete'
import './App.css'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PhoneShell />}>
            <Route index element={<Navigate to="/owner" replace />} />
            <Route path="owner" element={<OwnerHome />} />
            <Route path="owner/trip" element={<TripSetup />} />
            <Route path="owner/pet" element={<PetCrate />} />
            <Route path="owner/pickup" element={<PickupWindow />} />
            <Route path="owner/matching" element={<Matching />} />
            <Route path="owner/live" element={<LiveHaul />} />
            <Route path="owner/delivered" element={<Delivered />} />
            <Route path="transporter" element={<GoOnline />} />
            <Route path="transporter/job" element={<IncomingJob />} />
            <Route path="transporter/active" element={<ActiveHaul />} />
            <Route path="transporter/complete" element={<Complete />} />
            <Route path="*" element={<Navigate to="/owner" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
