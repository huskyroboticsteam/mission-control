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

  // player must be an object in order to reference it in the JMuxer constructor
  const player = useMemo(() => {
    return <video id={`${cameraName}-player`} muted autoPlay preload="auto" alt={`${cameraTitle} stream`}></video>;
  }, [cameraTitle, cameraName]);

  const jmuxer = useMemo(() => {
    if (player && hasRendered) {
      return new JMuxer({
        node: player.props.id,
        mode: 'video',
        flushingTime: 0,
        maxDelay: 0,
        clearBuffer: true,
        fps: 60,
        // readFpsFromTrack: true,
        onError: function(data) {
          console.warn('Buffer error encountered', data);
        },
        onMissingVideoFrames: function (data) {
          console.warn('Video frames missing', data);
        },
        debug: true
      });
    }
    return null;
  }, [player, hasRendered]);

  useEffect(() => {
    if (frameData) {
      jmuxer.feed({
        video: new Uint8Array(JSON.parse(frameData))
      });
    }
  }, [frameData, jmuxer]);

  useEffect(() => {
    // this indicates that the site has rendered and the player is able to be modified (specifically the src)
    setHasRendered(true);
  }, []);

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraTitle}</h2>
      <div style={{"display": "none"}}>
        {
        // this div needs to be here so that jmuxer will always have
        // a video tag to refer to regardless of frameData
        player
        }
      </div>
      {frameData
        ? player
        : <h3>No Stream Available</h3>
      }
    </div>
  );
}

export default CameraStream;
