import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";

import "./ArmDexterityPanel.css"

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <RoverModel />
      <CameraStream cameraName="upperArm" />
      <CameraStream cameraName="front" />
    </div>
  );
}

export default ArmDexterityPanel;