import RoverModel from '../roverModel/RoverModel'
import CameraStream from '../camera/CameraStream'

import './ArmDexterityPanel.css'

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <CameraStream cameraName="hand" cameraID={20} />
      <CameraStream cameraName="wrist" cameraID={30} />
      <CameraStream cameraName="mast" cameraID={40} />
      <RoverModel />
    </div>
  )
}

export default ArmDexterityPanel
