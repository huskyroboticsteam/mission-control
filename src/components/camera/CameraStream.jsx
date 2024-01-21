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
 *    unloadCallback, a callback that is ran before the window is fully unloaded
 * Returns a JSON object with keys: window, canvas, context, aspectRatio
 */
function createPopOutWindow(cameraTitle, cameraName, unloadCallback) {
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

  canvas.width = aspectRatio * 400;
  canvas.height = 400;
  context.fillStyle = "black";
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

// returns an imagedata object
function getLatestFrameFromVideo(video) {
  if (!video || !(video.videoWidth && video.videoHeight)) return null;
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  canvas.width = video.videoHeight;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

// takes an ImageData object
function isImageBlack(image) {
  for (let i = image.data.length / 2; i < image.data.length; i += 4) {
    if (image.data[i + 0] + image.data[i + 1] + image.data[i + 2] != 0) {
      return false;
    }
  }
  for (let i = image.data.length / 2; i >= 0; i -= 4) {
    if (image.data[i + 0] + image.data[i + 1] + image.data[i + 2] != 0) {
      return false;
    }
  }
  return true;
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

  const [lastFrameTime, setLastFrameTime] = useState(0.0);
  const [currentFpsAvg, setCurrentFpsAvg] = useState(20);
  const [popoutWindow, setPopoutWindow] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  let cameraCanvas = useRef(null);  // used for popout window
  
  const vidTag = useMemo(() => {
    return <video style={{opacity: popoutWindow ? '0' : '1'}} id={`${cameraName}-player`} className='video-tag' muted autoPlay preload="auto" alt={`${cameraTitle} stream`}></video>;
  }, [cameraName, cameraTitle, popoutWindow])
  
  const drawFrameOnExt = useCallback((window) => {
    if (vidTag && window && cameraCanvas) {
      // draw it onto the popout window

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

      let video = document.querySelector(`#${vidTag.props.id}`);
      let image = getLatestFrameFromVideo(video);
      if (!isImageBlack(image)) {
        cameraCanvas.current.getContext('2d').drawImage(video, 0, 0, cameraCanvas.current.width, cameraCanvas.current.height);
      }
      window.requestAnimationFrame(() => { drawFrameOnExt(window); });
    }
  }, [vidTag, aspectRatio]);

  const handlePopOut = useCallback(() => {
    if (popoutWindow) {
      // if the window popout exists
      popoutWindow.close();
      setPopoutWindow(null);
    } else {
      // if the window popout doesn't exist
      let { popout, canvas, aspectRatio } = createPopOutWindow(cameraTitle, cameraName, () => setPopoutWindow(null));
      setAspectRatio(aspectRatio);
      setPopoutWindow(popout);
      cameraCanvas.current = canvas;
      popout.requestAnimationFrame(() => { drawFrameOnExt(popout); });
    }
  }, [popoutWindow, cameraTitle, cameraName, drawFrameOnExt]);

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
