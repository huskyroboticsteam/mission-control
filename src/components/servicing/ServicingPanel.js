import ArmModel from "../armModel/ArmModel";
import CameraStream from "../camera/CameraStream";
import "./ServicingPanel.css";

function ServicingPanel() {
  return (
    <div className="servicing-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <ArmModel />
    </div>
  );
}

export default ServicingPanel;
