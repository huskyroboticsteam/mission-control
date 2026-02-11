import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import WaypointNav from './WaypointNav'
import TelemetryInfo from './TelemetryInfo'

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream cameraName="mast" cameraID={40} />
      <CameraStream cameraName="hand" cameraID={20} />

      <Compass />
      <CameraStream cameraName="wrist" cameraID={30} />

      <TelemetryInfo />
      <WaypointNav />
    </div>
  )
}

export default NavigationPanel
