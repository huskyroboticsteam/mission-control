import RoverModel from '../roverModel/RoverModel'
import CameraStream from '../camera/CameraStream'
import LimitSwitchStatus from './LimitSwitchStatus'

import './ArmDexterityPanel.css'

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <CameraStream camera="hand" />
      <CameraStream camera="wrist" />
      <RoverModel />
      <LimitSwitchStatus/>
    </div>
  )
}

export default ArmDexterityPanel
