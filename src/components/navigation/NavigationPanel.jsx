import Compass from './Compass'
import OpModeSelect from './OpModeSelect'
import CameraStream from '../camera/CameraStream'
import WaypointNav from './WaypointNav'
import './NavigationPanel.css'

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream cameraName="mast" cameraID={40} />
      <CameraStream cameraName="hand" cameraID={20} />
      <Compass />
      <OpModeSelect />
      <WaypointNav />
    </div>
  )
}

export default NavigationPanel
