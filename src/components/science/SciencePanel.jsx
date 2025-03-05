import CameraStream from '../camera/CameraStream'

import './SciencePanel.css'

function ArmDexterityPanel() {
  return (
    <div className="science-panel">
      <CameraStream cameraName="pano" />
      <CameraStream cameraName="drill" />
    </div>
  )
}

export default ArmDexterityPanel
