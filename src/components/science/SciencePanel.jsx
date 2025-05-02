import CameraStream from '../camera/CameraStream'

import './SciencePanel.css'

function ArmDexterityPanel() {
  return (
    <div className="science-panel">
      {/* <CameraStream cameraName="mast" cameraID={40} /> */}
      {/* placeholder cameras, will replace with other science feeds */}
      <CameraStream cameraName="mast" cameraID={40} />
      {/* <CameraStream cameraName="hand" cameraID={20} />
      <CameraStream cameraName="wrist" cameraID={30} /> */}
    </div>
  )
}

export default ArmDexterityPanel
