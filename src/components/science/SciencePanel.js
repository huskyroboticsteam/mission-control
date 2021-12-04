import CameraStream from "../camera/CameraStream";
import "./SciencePanel.css";

function SciencePanel({ cameraStreamFrameData }) {
  return (
    <div className="science-panel">
      <CameraStream cameraName="front" frameData={cameraStreamFrameData} />
      <CameraStream cameraName="front" frameData={cameraStreamFrameData} />
      <CameraStream cameraName="front" frameData={cameraStreamFrameData} />
      <CameraStream cameraName="front" frameData={cameraStreamFrameData} />
    </div>
  );
}

export default SciencePanel;
