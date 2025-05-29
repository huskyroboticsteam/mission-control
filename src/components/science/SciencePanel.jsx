import CameraStream from '../camera/CameraStream'
import Servos from './Servos'

import './SciencePanel.css'

function ArmDexterityPanel() {
  return (
    <div className="science-panel">
      {/* <CameraStream cameraName="mast" />
      <CameraStream cameraName="box" />
      <CameraStream cameraName="drill" /> */}
      {/* <div/>
      <div/>
      <div/> */}
      <Servos />
    </div>
  )
}

export default ArmDexterityPanel
