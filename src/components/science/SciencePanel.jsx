import CameraStream from '../camera/CameraStream'
import Servos from './Servos'

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
      {/* <CameraStream cameraName="mast" />
      <CameraStream cameraName="box" />
      <CameraStream cameraName="drill" /> */}
      {/* <div/>
      <div/>
      <div/> */}
      <Servos />
      <div className={className}>
        <button onClick={handleClick}>{text}</button>
      </div>
    </div>
  )
}

export default ArmDexterityPanel
