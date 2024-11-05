import CameraStream from "../camera/CameraStream";

import "./SciencePanel.css"

function ArmDexterityPanel() {
  return (
    <div className="science-panel">
      <CameraStream cameraName="mast" />
      {/* placeholder cameras, will replace with other science feeds */}
      <CameraStream cameraName="mast" />
      <CameraStream cameraName="hand" />
      <CameraStream cameraName="wrist" />
    </div>
  );
}

export default ArmDexterityPanel;