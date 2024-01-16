import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";
import Compass from "./Compass";
import "./DeliveryPanel.css";

function DeliveryPanel() {
  return (
    <div className="delivery-panel">
      <CameraStream cameraName="front" />
      <Compass />
      <CameraStream cameraName="upperArm" />
      <RoverModel />
    </div>
  );
}

export default DeliveryPanel;