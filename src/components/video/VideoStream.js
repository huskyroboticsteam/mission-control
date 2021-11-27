import "./VideoStream.css";

function VideoStream({ cameraName, frameData }) {
  if (frameData === null) {
    return (
      <div className="video-stream">
        <div className="video-stream__camera-name-container">
          <div className="video-stream__camera-name">
            {cameraName}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="video-stream">
        <img src={`data:image/jpg;base64,${frameData}`} alt={`${cameraName} stream`} />
        <div className="video-stream__camera-name-container">
          <div className="video-stream__camera-name">
            {cameraName}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoStream;
