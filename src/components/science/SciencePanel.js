import RoverModel from "../roverModel/RoverModel";
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
      <RoverModel />
    </div>
  );
}

export default SciencePanel;
