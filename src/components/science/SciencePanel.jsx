import CameraStream from '../camera/CameraStream'
import Servos from './Servos'

import './SciencePanel.css'

function ArmDexterityPanel() {
  return (
    <div className="science-panel">
      <CameraStream cameraName="pano" />
      <CameraStream cameraName="drill" />
      <Servos />
    </div>
  )
}

export default ArmDexterityPanel
