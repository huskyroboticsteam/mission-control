import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cameraStreamOpenRequested, cameraStreamCloseRequested, selectCameraStreamFrameData } from "../../store/camerasSlice";
import "./CameraStream.css";

function CameraStream({ cameraName }) {
  const dispatch = useDispatch();
  useEffect(() => {
    // Open the camera stream.
    dispatch(cameraStreamOpenRequested({ cameraName }));
    return () => {
      // Close the camera stream.
      dispatch(cameraStreamCloseRequested({ cameraName }));
    };
  }, [cameraName, dispatch]);

  const frameData = useSelector(selectCameraStreamFrameData(cameraName));

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraName}</h2>
      {frameData
        ? <img src={`data:image/jpg;base64,${frameData}`} alt={`${cameraName} stream`} />
        : <h3>No Stream Available</h3>
      }
    </div>
  );
}

export default CameraStream;
