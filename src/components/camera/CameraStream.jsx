import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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
  const [popoutWindow, setPopoutWindow] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  let cameraCanvas = useRef(null);
  let cameraContext = useRef(null);
  
  const vidTag = useMemo(() => {
    return <video style={{opacity: popoutWindow ? '0' : '1'}} id={`${cameraName}-player`} className='video-tag' muted autoPlay preload="auto" alt={`${cameraTitle} stream`}></video>;
  }, [cameraName, cameraTitle, popoutWindow])

  const handlePopOut = useCallback(() => {
    if (popoutWindow) {
      // if the window popout exists
      popoutWindow.close();
      setPopoutWindow(null);
    } else {
      // if the window popout doesn't exist
      let newWindow = window.open("", "", "width=500,height=500");
      newWindow.document.body.style.margin = "0";
      newWindow.document.title = cameraTitle + " Stream";
      newWindow.document.body.innerHTML = `
      <div style="background-color:black;width:100%;height:100%;font-family:Arial,Helvetica,sans-serif;display:flex;justify-content:center">
        <div style="z-index:100;position:absolute;width:100%;font-size:30px;font-weight:bold;text-align:center;color:white;padding-top:5px;padding-bottom:5px;background-color:#00000066;">${cameraTitle}</div>
        <div id="ext-fps" style="z-index:101;position:absolute;top:5;left:5;font-size:15px;font-weight:bold;color:red;">FPS: N/A</div>
        <canvas id="ext-vid" style="z-index:1;border:none;display:block;margin:auto 0;"></canvas>
        </div>
      </div>`;

      let canvas = newWindow.document.querySelector('#ext-vid');
      let context = canvas.getContext('2d');
      let aspectRatio = document.querySelector(`#${cameraName}-player`).videoHeight / document.querySelector(`#${cameraName}-player`).videoWidth;
      setAspectRatio(aspectRatio);
      
      canvas.width = aspectRatio * 400;
      canvas.height = 400;
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      setPopoutWindow(newWindow);
      cameraCanvas.current = canvas;
      cameraContext.current = context;
      newWindow.addEventListener("beforeunload", () => {
        setPopoutWindow(null);
      });
    }
  }, [popoutWindow, setPopoutWindow, setAspectRatio, cameraTitle]);

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

      if (popoutWindow) {
        // draw it onto the popout window

        // if the window is wider than the stream
        if (popoutWindow.innerHeight / popoutWindow.innerWidth > aspectRatio) {
          // set the height of the canvas to the height of the window
          cameraCanvas.current.width = Math.floor(popoutWindow.innerWidth);
          cameraCanvas.current.height = Math.floor(popoutWindow.innerWidth * aspectRatio);
        } else {
          // set the width of the canvas to the height of the window
          cameraCanvas.current.width = Math.floor(popoutWindow.innerHeight / aspectRatio);
          cameraCanvas.current.height = Math.floor(popoutWindow.innerHeight);
        }
        cameraContext.current.drawImage(document.getElementById(vidTag.props.id), 0, 0, cameraCanvas.current.width, cameraCanvas.current.height);
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
  }, [frameDataArray, popoutWindow, cameraCanvas, cameraContext]);
  
  useEffect(() => {
    // this indicates that the site has rendered and the player is able to be modified (specifically the src)
    setHasRendered(true);
  }, []);

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraTitle}</h2>
      { vidTag }
      { popoutWindow ? <h3>Stream In External Window</h3> : (!frameDataArray && <h3>No Stream Available</h3>) }
      <div className='camera-stream-fps'>FPS: {currentFpsAvg && frameDataArray ? Math.round(currentFpsAvg) : 'N/A'}</div>
      <div className='camera-stream-pop-header'>
        <span className='camera-stream-pop-button'
        title={`Open "${cameraTitle}" camera stream in a new window.`}
        onClick={ handlePopOut }>
          { popoutWindow ? 'Merge Window' : 'Pop Out' }
        </span>
      </div>
    </div>
  );
}

export default CameraStream;
