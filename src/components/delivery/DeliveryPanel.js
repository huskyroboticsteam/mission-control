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
      <Compass orientW="100" orientX="0" orientY="200" orientZ="200" />
    </div>
  );
}

export default DeliveryPanel;
