import "./CameraView.css";

function CameraView() {
  // TODO: remove video.mp4 from /public when live streaming is implemented.
  return (
    <div className="cameraView">
      <video width="1000" autoPlay loop muted>
        <source src="video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default CameraView;
