import CameraStream from "../camera/CameraStream";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="science-panel">
      <CameraStream cameraName="front" />
      <CameraStream cameraName="front" />
      <CameraStream cameraName="front" />
      <CameraStream cameraName="front" />
    </div>
  );
}

export default SciencePanel;
