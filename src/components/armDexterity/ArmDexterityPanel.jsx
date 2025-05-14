import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";

import "./ArmDexterityPanel.css"

function ArmDexterityPanel() {
  return (
    <div className="arm-dexterity-panel">
      <CameraStream cameraName="hand" />
      <RoverModel />
    </div>
  );
}

export default ArmDexterityPanel;