import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";
import SwerveDriveMode from "./SwerveDriveMode";

import "./ArmDexterityPanel.css"

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <RoverModel />
      <CameraStream cameraName="upperArm" />
      <CameraStream cameraName="front" />
      <SwerveDriveMode />
    </div>
  );
}

export default ArmDexterityPanel;