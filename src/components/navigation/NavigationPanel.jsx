import {useSelector} from 'react-redux'
import {selectDriveTank} from '../../store/inputSlice'
import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import OpModeSelect from './OpModeSelect'
import WaypointNav from './WaypointNav'

function NavigationPanel() {
  const tank = useSelector(selectDriveTank)

  return (
    <div className="navigation-panel">
      <CameraStream cameraName="mast" />
      <CameraStream cameraName="hand" />
      <Compass />
      <CameraStream cameraName="wrist" />
      <OpModeSelect />
      <WaypointNav />
    </div>
  )
}

export default NavigationPanel
