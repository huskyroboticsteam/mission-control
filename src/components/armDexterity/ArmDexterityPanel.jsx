import RoverModel from '../roverModel/RoverModel'
import CameraStream from '../camera/CameraStream'
import CustomizationPanel from './CustomizationPanel'
import './ArmDexterityPanel.css'

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <CameraStream camera="hand" />
      <CameraStream camera="wrist" />
      <RoverModel />
      <CustomizationPanel components={['Component 1', 'Component 2', 'Component 3']} />
      
    </div>
  )
}

export default ArmDexterityPanel
