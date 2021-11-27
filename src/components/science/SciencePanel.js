import VideoStream from "../video/VideoStream";
import "./SciencePanel.css";

function SciencePanel({ cameraStreamFrameData }) {
  return (
    <div className="science-panel">
      <VideoStream cameraName="Front" frameData={cameraStreamFrameData} />
      <VideoStream cameraName="Front" frameData={cameraStreamFrameData} />
      <VideoStream cameraName="Front" frameData={cameraStreamFrameData} />
      <VideoStream cameraName="Front" frameData={cameraStreamFrameData} />
    </div>
  );
}

export default SciencePanel;
