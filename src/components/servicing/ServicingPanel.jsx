import RoverModel from "../roverModel/RoverModel";
import CameraStream from "../camera/CameraStream";
import "./ServicingPanel.css";

function ServicingPanel() {
  return (
    <div className="servicing-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="rear" />
      <CameraStream cameraName="upperArm" />
      <RoverModel />
    </div>
  );
}

export default ServicingPanel;
