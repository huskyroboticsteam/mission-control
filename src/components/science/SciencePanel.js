import ArmModel from "../armModel/ArmModel";
import CameraStream from "../camera/CameraStream";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="science-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <ArmModel />
    </div>
  );
}

export default SciencePanel;
