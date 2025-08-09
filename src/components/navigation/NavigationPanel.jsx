import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import OpModeSelect from './OpModeSelect'
import WaypointNav from './WaypointNav'

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream cameraName="mast" cameraID={40} />
      <CameraStream cameraName="hand" cameraID={20} />

      <Compass />
      <CameraStream cameraName="wrist" cameraID={30} />
      <OpModeSelect />
      <WaypointNav />
    </div>
  )
}

export default NavigationPanel
