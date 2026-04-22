import RoverModel from '../roverModel/RoverModel'
import CameraStream from '../camera/CameraStream'
import CustomizationPanel from './CustomizationPanel'
import './ArmDexterityPanel.css'

function ArmDexterityPanel() {
  const components = ['handcam', 'wristcam', 'rovermodel'];
  const handleChildData = (data) => {
    console.log("Received from child:", data);
  };

  return (
    <div className="arm-dexterity-panel">
      <CameraStream camera="hand" />
      <CameraStream camera="wrist" />
      <RoverModel />
      <CustomizationPanel onSend={handleChildData} components={components} />
    </div>
  )
}

export default ArmDexterityPanel
