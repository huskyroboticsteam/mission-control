import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import OpModeSelect from './OpModeSelect'
import WaypointList from './WaypointList'
import WaypointNav from './WaypointNav'

function NavigationPanel() {
  return (
    <div className="navigation-panel">
      <CameraStream camera="mast" />
      <CameraStream camera="hand" />
      <Compass />
      <CameraStream camera="wrist" />
      {/* <OpModeSelect /> */}
      <WaypointList />
      <WaypointNav />
    </div>
  )
}

export default NavigationPanel
