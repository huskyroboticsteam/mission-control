import CameraStream from "../camera/CameraStream";

import "./SciencePanel.css"

function ArmDexterityPanel() {
  return (
    <div className="science-panel">
      <CameraStream cameraName="microscope" />
      {/* placeholder microscope cameras, will replace with other science feeds */}
      <CameraStream cameraName="microscope" />
      <CameraStream cameraName="microscope" />
      <CameraStream cameraName="microscope" />
    </div>
  );
}

export default ArmDexterityPanel;