import "./WebcamVideo.css";

function WebcamVideo({ frameBytes }) {
  if (frameBytes == null) {
    return (
      <p className="webcamVideo">No camera available</p>
    );
  } else {
    return (
      <img className="webcamVideo" src={"data:image/jpg;base64," + frameBytes} alt="" />
    );
  }
}

export default WebcamVideo;
