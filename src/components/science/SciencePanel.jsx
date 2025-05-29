import CameraStream from '../camera/CameraStream'
import Servos from './Servos'
import Steppers from './Steppers'

import './SciencePanel.css'
import {useSelector, useDispatch} from 'react-redux'
import {selectDrillMotor, toggleDrillMotor} from '../../store/inputSlice'

function ArmDexterityPanel() {
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
      <CameraStream cameraName="microscope" cameraID={500} />
      <CameraStream cameraName="drill" cameraID={540} />
      <CameraStream cameraName="box" cameraID={520} />
      <div style={{flexDirection: 'column'}}>
        <Servos />
        <Steppers />
      </div>
      <div className={className}>
        <button onClick={handleClick}>{text}</button>
      </div>
    </div>
  )
}

export default ArmDexterityPanel
