import "./CameraView.css";

function CameraView() {
  // TODO: remove video.mp4 from /public when live streaming is implemented.

  // TODO: remove this placeholder.
  const roverConnected = false;

  if (roverConnected) {
    return (
      <div className="cameraView">
        <img src="rtp://localhost:8080" alt="" />
      </div>
    );
  } else {
    return (
      <div className="cameraView">
        <p>No camera available</p>
      </div>
    );
  }
}

export default CameraView;
