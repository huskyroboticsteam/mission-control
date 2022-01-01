import ArmModel from "../armModel/ArmModel";
import CameraStream from "../camera/CameraStream";
import "./DeliveryPanel.css";

function DeliveryPanel() {
  return (
    <div className="delivery-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <ArmModel />
    </div>
  );
}

export default DeliveryPanel;
