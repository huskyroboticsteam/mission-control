import Compass from './Compass'
import OpModeSelect from './OpModeSelect'
import CameraStream from '../camera/CameraStream'
import WaypointNav from './WaypointNav'
import ScienceStatus from './ScienceStatus'
import './NavigationPanel.css'

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream cameraName="mast" cameraID={40} />
      <CameraStream cameraName="wrist" cameraID={30} />
      {/* <CameraStream cameraName="hand" cameraID={20} /> */}
      <CameraStream cameraName="rand" cameraID={50} />

      <Compass />
      <OpModeSelect />
      <WaypointNav />
      <ScienceStatus />
    </div>
  )
}

export default NavigationPanel
