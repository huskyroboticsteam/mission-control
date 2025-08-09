import CameraStream from '../camera/CameraStream'
import Servos from './Servos'
import Steppers from './Steppers'

import './SciencePanel.css'
import {useSelector, useDispatch} from 'react-redux'
import {selectDrillMotor, toggleDrillMotor} from '../../store/inputSlice'

function SciencePanel() {
  const dispatch = useDispatch()
  const isDrillOn = useSelector(selectDrillMotor)

const handleClick = () => {
    dispatch(toggleDrillMotor())
  }

  const className =
    'enable-drill-button enable-drill-button--' + (isDrillOn ? 'enabled' : 'disabled')
  const text = isDrillOn ? 'Turn off Drill' : 'Turn on Drill'

  return (
    <div className="science-panel">
      <CameraStream cameraName="mast" cameraID={40} />
      <CameraStream cameraName="hand" cameraID={20} />
      <CameraStream cameraName="wrist" cameraID={30} />
    </div>
  )
}

export default SciencePanel
