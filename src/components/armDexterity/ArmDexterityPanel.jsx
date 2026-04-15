import RoverModel from '../roverModel/RoverModel'
import CameraStream from '../camera/CameraStream'
import CustomizationPanel from './CustomizationPanel'
import './ArmDexterityPanel.css'

function ArmDexterityPanel() {
  const handleChildData = (data) => {
    console.log("Received from child:", data);
  };

  return (
    <div className="arm-dexterity-panel">
      <CameraStream camera="hand" />
      <CameraStream camera="wrist" />
      <RoverModel />
      <CustomizationPanel onSend={handleChildData} components={['Component 1', 'Component 2', 'Component 3']} />
      
    </div>
  )
}

export default ArmDexterityPanel
