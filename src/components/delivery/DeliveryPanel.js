import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";
import "./DeliveryPanel.css";

function DeliveryPanel() {
  return (
    <div className="delivery-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <RoverModel />
    </div>
  );
}

export default DeliveryPanel;
