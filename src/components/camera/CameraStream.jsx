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

/**
 * Takes:
 *    cameraTitle: the camera title,
 *    cameraName: the camera name,
 *    unloadCallback: a callback that is ran before the window is fully unloaded
 *    video_width: the stream width
 *    video_height: the stream height
 * Returns: Promise of an object with keys: window, canvas, context, aspectRatio
 */
async function createPopOutWindow(cameraTitle, cameraName, unloadCallback, video_width, video_height) {
  let newWindow = window.open("/camera/cam_popout.html", "", "width=500,height=500");
  var hasLoaded = false;
  newWindow.onload = () => {
    hasLoaded = true;
  }
  while (!hasLoaded) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  newWindow.document.title = `${cameraTitle} Stream`;
  newWindow.document.querySelector('#ext-title').innerText = cameraTitle;
  newWindow.document.querySelector('#ext-download-button').onclick = `download(${cameraTitle}, ${video_width}, ${video_height})`;

  let canvas = newWindow.document.querySelector('#ext-vid');
  let context = canvas.getContext('2d');
  let aspectRatio = document.querySelector(`#${cameraName}-player`).videoHeight / document.querySelector(`#${cameraName}-player`).videoWidth;
  canvas.width = aspectRatio * 400;
  canvas.height = 400;
  context.fillStyle = "blue";
  context.fillRect(0, 0, canvas.width, canvas.height);

  window.onunload = () => {
    if (newWindow && !newWindow.closed) {
        newWindow.close();
    }
  };

  newWindow.onbeforeunload = unloadCallback;

  let output = {
    popout: newWindow,
    canvas: canvas,
    context: context,
    aspectRatio: aspectRatio
  }; 
  return output;
}

/**
 * Takes
 *    video: HTMLVideoElement representing the video tag which should be processed.
 *    cameraTitle: name of the camera, used for the filename.
 */
function downloadCurrentFrame(video, cameraTitle) {
  if (!video || !(video.videoWidth && video.videoHeight)) return null;
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  let link = document.createElement("a");
  link.href = canvas.toDataURL("image/jpeg", 1);

  let time = new Date();
  let timezoneOffset = time.getTimezoneOffset() * 60000;
  let timeString = new Date(time - timezoneOffset).toISOString().replace(":", "_").substring(0, 19);

  link.download = `${cameraTitle}-${timeString}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
  const [hasFrame, setHasFrame] = useState(false);

  const [lastFrameTime, setLastFrameTime] = useState(0.0);
  const [currentFpsAvg, setCurrentFpsAvg] = useState(20);
  const [popoutWindow, setPopoutWindow] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  const cameraCanvas = useRef(null);  // used for popout window
  const cameraContext = useRef(null);  // used for popout window
  
  const vidTag = useMemo(() => {
    return <video style={{opacity: popoutWindow ? '0' : '1'}} id={`${cameraName}-player`} className='video-tag' muted autoPlay preload="auto" alt={`${cameraTitle} stream`}></video>;
  }, [cameraName, cameraTitle, popoutWindow])
  
  const drawFrameOnExt = useCallback((window, last_ww, last_wh) => {
    if (vidTag && window && cameraCanvas) {
      // draw it onto the popout window
      
      if (window.innerWidth !== last_ww || window.innerHeight !== last_wh) {
        // if the window is wider than the stream
        if (window.innerHeight / window.innerWidth > aspectRatio) {
          // set the height of the canvas to the height of the window
          cameraCanvas.current.width = Math.floor(window.innerWidth);
          cameraCanvas.current.height = Math.floor(window.innerWidth * aspectRatio);
        } else {
          // set the width of the canvas to the height of the window
          cameraCanvas.current.width = Math.floor(window.innerHeight / aspectRatio);
          cameraCanvas.current.height = Math.floor(window.innerHeight);
        }
      }

      if (hasFrame) {
        let button = window.document.querySelector("#ext-download-button");
        button.removeAttribute('disabled');
      }

      let video = document.querySelector(`#${vidTag.props.id}`);
      cameraContext.current.drawImage(video, 0, 0, cameraCanvas.current.width, cameraCanvas.current.height);
      last_ww = window.innerWidth;
      last_wh = window.innerHeight;
      window.requestAnimationFrame(() => { drawFrameOnExt(window, last_ww, last_wh); });
    }
  }, [vidTag, aspectRatio, hasFrame]);

  const handlePopOut = useCallback(async () => {
    if (popoutWindow) {
      // if the window popout exists
      popoutWindow.close();
      setPopoutWindow(null);
    } else if (vidTag ){
      // if the window popout doesn't exist
      let video = document.getElementById(vidTag.props.id);
      let { popout, canvas, context, aspectRatio } = await createPopOutWindow(cameraTitle, cameraName, () => setPopoutWindow(null), video.videoWidth, video.videoHeight);
      setAspectRatio(aspectRatio);
      setPopoutWindow(popout);
      cameraCanvas.current = canvas;
      cameraContext.current = context;
      popout.requestAnimationFrame(() => { drawFrameOnExt(popout, 0, 0); });
    }
  }, [popoutWindow, cameraTitle, cameraName, drawFrameOnExt, vidTag]);

  const jmuxer = useMemo(() => {
    if (hasRendered && cameraName) {
      return new JMuxer({
        node: `${cameraName}-player`,
        mode: 'video',
        flushingTime: 0,
        maxDelay: 50,
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
          let fps = (oldFps + 1 / ((currentTime - lastFrameTime) / 1000)) / 2;
          if (popoutWindow) {
            popoutWindow.document.querySelector('#ext-fps').innerText = `FPS: ${Math.round(fps)}`;
          }
          return fps;
        });
      }
      setHasFrame(true);
      setAspectRatio(document.querySelector(`#${cameraName}-player`).videoHeight / document.querySelector(`#${cameraName}-player`).videoWidth);
      setLastFrameTime(currentTime); // current time in ms
    }
  }, [cameraName, frameDataArray, popoutWindow]);

  useEffect(() => {
    return () => {
      if (popoutWindow) {
        popoutWindow.close();
      }
    };
  }, [popoutWindow]);
  
  useEffect(() => {
    // this indicates that the site has rendered and the player is able to be modified (specifically the src)
    setHasRendered(true);
  }, []);

  return (
    <div className="camera-stream">
      <h2 className="camera-stream__camera-name">{cameraTitle}</h2>
      <div className="video-container">{ vidTag }</div>
      { popoutWindow ? <h3>Stream In External Window</h3> : (!frameDataArray && <h3>No Stream Available</h3>) }
      <div className='camera-stream-fps'>FPS: {currentFpsAvg && frameDataArray ? Math.round(currentFpsAvg) : 'N/A'}</div>
      <div className='camera-stream-pop-header'>
        <span className='camera-stream-pop-button'
        title={`Open "${cameraTitle}" camera stream in a new window.`}
        onClick={ handlePopOut }>
          { popoutWindow ? 'Merge Window' : 'Pop Out' }
        </span>
      </div>
      <div className='camera-stream-download-header'>
        <button className='camera-stream-download-button'
        title={`Download "${cameraTitle}" camera stream current frame`}
        onClick={() => downloadCurrentFrame(document.querySelector(`#${vidTag.props.id}`), cameraTitle)} disabled={!hasFrame}>
          Download
        </button>
      </div>
    </div>
  );
}

export default CameraStream;
