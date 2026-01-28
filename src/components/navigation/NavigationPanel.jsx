import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import WaypointNav from './WaypointNav'
import NetworkStats from './NetworkStats.tsx'

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream camera="mast" />
      <CameraStream camera="hand" />
      <Compass />
      <CameraStream camera="wrist" />
      <WaypointNav />
      <NetworkStats />
    </div>
  )
}

export default NavigationPanel
