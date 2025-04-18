import CameraStream from '../camera/CameraStream'
import './SciencePanel.css'
import { useDispatch, useSelector } from 'react-redux' // Import Redux hooks
import { requestJointPower, selectJointCurrentPosition } from '../../store/jointsSlice' // Import actions and selectors from jointsSlice

function ArmDexterityPanel() {
  const dispatch = useDispatch()
  const isDrillOn = useSelector(state => selectJointCurrentPosition('drillMotor')(state)) === 'on' || false // Get drill state from Redux store

  const drillOnClick = () => {
    dispatch(requestJointPower({ jointName: 'drillMotor', power: 1})) // Dispatch action to turn drill on
    console.log('Drill is now ON')
  }

  const drillOffClick = () => {
    dispatch(requestJointPower({ jointName: 'drillMotor', power: 0})) // Dispatch action to turn drill off
    console.log('Drill is now OFF')
  }

  return (
    <div className="science-panel">
      <CameraStream cameraName="pano" />
      <CameraStream cameraName="drill" />
      <div className="drill-controls">
        <button onClick={drillOnClick} disabled={isDrillOn}>
          Drill On
        </button>
        <button onClick={drillOffClick} disabled={!isDrillOn}>
          Drill Off
        </button>
      </div>
    </div>
  )
}

export default ArmDexterityPanel
