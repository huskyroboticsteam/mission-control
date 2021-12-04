import "./CameraStream.css";

function CameraStream({ cameraName, frameData }) {
  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraName}</h2>
      {
        frameData
          ? <img src={`data:image/jpg;base64,${frameData}`} alt={`${cameraName} stream`} />
          : <h3>No Stream Available</h3>
      }
    </div>
  );
}

export default CameraStream;
