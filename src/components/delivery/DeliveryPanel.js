import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";
import Compass from "../delivery/Compass";
import "./DeliveryPanel.css";

function DeliveryPanel() {
  return (
    <div className="delivery-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <RoverModel />
      <Compass />
    </div>
  );
}

export default DeliveryPanel;