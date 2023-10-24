import { useCallback, useEffect, useMemo, useState } from "react";
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

  const frameDataArray = useSelector(selectCameraStreamFrameData(cameraName));
  const cameraTitle = camelCaseToTitle(cameraName);
  const [hasRendered, setHasRendered] = useState(false);

  const [lastFrameTime, setLastFrameTime] = useState(0.0);
  const [currentFpsAvg, setCurrentFpsAvg] = useState(20);
  const [popoutWindow, setPopOutWindow] = useState(null);
  const vidTag = <video id={`${cameraName}-player`} className='video-tag' muted autoPlay preload="auto" alt={`${cameraTitle} stream`}></video>;

  const handlePopOut = useCallback(() => {
    if (popoutWindow) {
      // if the window popout exists
      popoutWindow.close();
      setPopOutWindow(null);
    } else {
      // if the window popout doesn't exist
      let newWindow = window.open("", "", "width=500,height=500");
      newWindow.document.title = cameraTitle + " Stream";
      // newWindow.document.body.innerHTML = `<div>HEADER</div><div>${JSON.stringify(vidTag)}</div>`;
      
      setPopOutWindow(newWindow);
      newWindow.addEventListener("beforeunload", () => {
        setPopOutWindow(null);
      });
    }
  }, [popoutWindow, cameraTitle, vidTag]);

  const jmuxer = useMemo(() => {
    if (hasRendered && cameraName) {
      return new JMuxer({
        node: `${cameraName}-player`,
        mode: 'video',
        flushingTime: 0,
        maxDelay: 0,
        clearBuffer: true,
        onError: function(data) {
          console.warn('Buffer error encountered', data);
        },
        
        onMissingVideoFrames: function (data) {
          console.warn('Video frames missing', data);
        }
      });
    }
    return null;
  }, [cameraName, hasRendered]);

  useEffect(() => {
    if (frameDataArray && vidTag && jmuxer) {
      for (let i = 0; i < frameDataArray.length; i++) {
        jmuxer.feed({
          video: new Uint8Array(frameDataArray[i])
        });
      }
      const currentTime = Date.now();
      if (currentTime !== lastFrameTime) {
        setCurrentFpsAvg((oldFps) => {
          return (oldFps + 1 / ((currentTime - lastFrameTime) / 1000)) / 2;
        });
      }
      setLastFrameTime(currentTime); // current time in ms
    }
    // eslint-disable-next-line
  }, [frameDataArray]);
  
  useEffect(() => {
    // this indicates that the site has rendered and the player is able to be modified (specifically the src)
    setHasRendered(true);
  }, []);

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraTitle}</h2>
      { !popoutWindow && vidTag }
      { !frameDataArray && <h3>No Stream Available</h3> }
      <div className='camera-stream-fps'>FPS: {currentFpsAvg && frameDataArray ? Math.round(currentFpsAvg) : 'N/A'}</div>
      <div className='camera-stream-pop-header'>
        <span className='camera-stream-pop-button' title={`Open "${cameraTitle}" camera stream in a new window.`} onClick={ handlePopOut }>{ popoutWindow ? 'Close Window' : 'Pop Out' }</span>
      </div>
    </div>
  );
}

export default CameraStream;
