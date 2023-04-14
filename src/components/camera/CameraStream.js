import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JMuxer from "jmuxer";
import {
  openCameraStream,
  closeCameraStream,
  selectCameraStreamFrameData
} from "../../store/camerasSlice";
import camelCaseToTitle from "../../util/camelCaseToTitle";
import "./CameraStream.css";

function CameraStream({ cameraName }) {
  const dispatch = useDispatch();
  useEffect(() => {
    // Open the camera stream.
    dispatch(openCameraStream({ cameraName }));
    return () => {
      // Close the camera stream.
      dispatch(closeCameraStream({ cameraName }));
    };
  }, [cameraName, dispatch]);

  const frameData = useSelector(selectCameraStreamFrameData(cameraName));
  const cameraTitle = camelCaseToTitle(cameraName);
  const [hasRendered, setHasRendered] = useState(false);
  const [lastFrameTime, setLastFrameTime] = useState(0.0);
  const [currentFps, setCurrentFps] = useState(0.0);

  const jmuxer = useMemo(() => {
    if (hasRendered && cameraTitle && cameraName) {
      return new JMuxer({
        node: `${cameraName}-player`,
        mode: 'video',
        flushingTime: 0,
        maxDelay: 0,
        clearBuffer: true,
        // fps: 40,
        // readFpsFromTrack: true,
        onError: function(data) {
          console.warn('Buffer error encountered', data);
        },
        
        onMissingVideoFrames: function (data) {
          console.warn('Video frames missing', data);
        }
        // , debug: true
      });
    }
    return null;
  }, [cameraTitle, cameraName, hasRendered]);

  useEffect(() => {
    if (frameData && jmuxer) {
      jmuxer.feed({
        video: new Uint8Array(frameData)
      });
      setCurrentFps(1000 * (1.0 / (Date.now() - lastFrameTime)));
      setLastFrameTime(Date.now());
    }
  }, [frameData, jmuxer]);

  useEffect(() => {
    // this indicates that the site has rendered and the player is able to be modified (specifically the src)
    setHasRendered(true);
  }, []);

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraTitle}</h2>
      <div className='camera-stream-fps'>{currentFps ? Math.round(currentFps) : 'N/A'}</div>
      <video style={{"display": frameData ? "block" : "none"}}id={`${cameraName}-player`} muted autoPlay preload="auto" alt={`${cameraTitle} stream`}></video>
      { !frameData && <h3>No Stream Available</h3> }
    </div>
  );
}

export default CameraStream;
