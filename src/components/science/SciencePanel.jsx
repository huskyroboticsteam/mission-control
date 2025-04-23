import CameraStream from '../camera/CameraStream'
import './SciencePanel.css'
import {useDispatch, useSelector} from 'react-redux'
import {selectDrillIsEnabled, enableDrillOn} from '../../store/jointsSlice'

function ArmDexterityPanel() {
  const dispatch = useDispatch()
  const isDrillOn = useSelector(selectDrillIsEnabled)

  const handleClick = () => {
    if (!isDrillOn) {
      console.log('Drill is OFF')
    } else {
      console.log('Drill is ON')
    }
    dispatch(enableDrillOn({enabled: !isDrillOn}))
  }

  const className =
    'enable-drill-button enable-drill-button--' + (isDrillOn ? 'enabled' : 'disabled')
  const text = isDrillOn ? 'Disable drill' : 'Enable drill'

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
