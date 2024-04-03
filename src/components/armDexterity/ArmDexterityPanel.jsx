import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";
import DriveMode from "../DriveMode";

import "./ArmDexterityPanel.css"

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <RoverModel />
      <CameraStream cameraName="upperArm" />
      <CameraStream cameraName="front" />
      <DriveMode />
    </div>
  );
}

export default ArmDexterityPanel;