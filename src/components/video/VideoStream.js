import "./VideoStream.css";

function VideoStream({ cameraName, frameData }) {
  if (frameData === null) {
    return (
      <div className="videoStream">
        <div className="videoStream__cameraNameContainer">
          <div className="videoStream__cameraName">
            {cameraName}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="videoStream">
        <img src={`data:image/jpg;base64,${frameData}`} alt={`${cameraName} stream`} />
        <div className="videoStream__cameraNameContainer">
          <div className="videoStream__cameraName">
            {cameraName}
          </div>
        </div>
      </div>
    );
  }
}

export default VideoStream;
