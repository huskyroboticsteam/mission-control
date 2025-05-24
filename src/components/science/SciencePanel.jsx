import React from 'react'
import CameraStream from '../camera/CameraStream'
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
      <CameraStream cameraName="pano" />
      <CameraStream cameraName="drill" />
      <div className={className}>
        <button onClick={handleClick}>{text}</button>
      </div>
    </div>
  )
}

export default ArmDexterityPanel
