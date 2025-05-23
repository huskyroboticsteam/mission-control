import CameraStream from '../camera/CameraStream'

import './SciencePanel.css'

function ArmDexterityPanel() {
  return (
    <div className="science-panel">
      {/* <CameraStream cameraName="mast" cameraID={40} /> */}
      {/* <CameraStream cameraName="pano" /> */}
      {/* <CameraStream cameraName="drill" /> */}
      {/* <CameraStream cameraName="microscope" cameraID={500} /> */}
      {/* <CameraStream cameraName="drill" cameraID={540} /> */}
      <CameraStream cameraName="box" cameraID={520} />
    </div>
  )
}

export default ArmDexterityPanel
