import VideoStream from "../video/VideoStream";
import "./SciencePanel.css";

function SciencePanel() {
  return (
    <div className="sciencePanel">
      <VideoStream cameraName="Camera 1" frameData="" />
      <VideoStream cameraName="Camera 2" frameData="" />
    </div>
  );
}

export default SciencePanel;
