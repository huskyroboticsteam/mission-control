import "./VideoStream.css";

/*src={"data:image/jpg;base64," + frameData}*/

function VideoStream({ cameraName, frameData }) {
  return (
    <div className="videoStream">
      <img src="https://i.pinimg.com/originals/e7/e4/6c/e7e46c2164e249af734527afa9a1eb03.png" alt={`${cameraName} stream`} />
      <div className="videoStream__cameraNameContainer">
        <div className="videoStream__cameraName">
          {cameraName}
        </div>
      </div>
    </div>
  );
}

export default VideoStream;
