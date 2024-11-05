import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";
import SwerveDriveMode from "./SwerveDriveMode";

import "./ArmDexterityPanel.css"

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <CameraStream cameraName="hand" />
      <CameraStream cameraName="wrist" />
      <CameraStream cameraName="mast" />
      <RoverModel />
      <SwerveDriveMode />
    </div>
  );
}

export default ArmDexterityPanel;