import ArmModel from "../armModel/ArmModel";
import CameraStream from "../camera/CameraStream";
import LazySusan from "../lazySusan/LazySusan";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="science-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <LazySusan/>
      <ArmModel />
    </div>
  );
}

export default SciencePanel;
