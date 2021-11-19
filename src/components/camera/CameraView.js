import WebcamVideo from "./WebcamVideo";
import "./CameraView.css";

function CameraView({ webcamFrameBytes }) {
  return (
    <div className="cameraView">
      <WebcamVideo frameBytes={webcamFrameBytes} />
    </div>
  );
}

export default CameraView;
