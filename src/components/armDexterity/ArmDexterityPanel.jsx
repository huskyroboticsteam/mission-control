import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";

import "./ArmDexterityPanel.css"

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <RoverModel />
      <CameraStream cameraName="hand" />
      <CameraStream cameraName="wrist" />
      {/* <CameraStream cameraName="mast" /> */}
    </div>
  );
}

export default ArmDexterityPanel;