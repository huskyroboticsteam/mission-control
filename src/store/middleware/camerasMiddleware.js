import {
  openCameraStream,
  closeCameraStream,
  cameraStreamDataReportReceived,
  requestCameraFrame,
} from "../camerasSlice";
import {
  messageReceivedFromRover,
  messageRover,
  roverConnected,
  roverDisconnected
} from "../roverSocketSlice";
import camelCaseToTitle from "../../util/camelCaseToTitle";


/**
 * Middleware that handles requesting and receiving camera streams from the
 * rover.
 */
const camerasMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case openCameraStream.type: {
      store.dispatch(messageRover({
        message: {
          type: "cameraStreamOpenRequest",
          camera: action.payload.cameraName,
          fps: 20,  // default to 20
        }
      }));
      break;
    }

    case closeCameraStream.type: {
      store.dispatch(messageRover({
        message: {
          type: "cameraStreamCloseRequest",
          camera: action.payload.cameraName
        }
      }));
      break;
    }

    case requestCameraFrame.type: {
      store.dispatch(messageRover({
        message: {
          type: "cameraFrameRequest",
          camera: action.payload.cameraName
        }
      }));
      break;
    }

    case roverConnected.type: {
      // Inform the rover of camera streams we would like to receive when we
      // connect.
      const cameras = store.getState().cameras;
      Object.keys(cameras).forEach(cameraName => {
        const camera = cameras[cameraName];
        if (camera.isStreaming) {
          store.dispatch(messageRover({
            message: {
              type: "cameraStreamOpenRequest",
              camera: cameraName,
              fps: 20, // default to 20
            }
          }));
        }
      });
      break;
    }

    case roverDisconnected.type: {
      const cameras = store.getState().cameras;
      Object.keys(cameras).forEach(cameraName => {
        const camera = cameras[cameraName];
        if (camera.isStreaming && camera.frameData !== null) {
          store.dispatch(cameraStreamDataReportReceived({
            cameraName,
            frameData: null
          }));
        }
      });
      break;
    }

    case messageReceivedFromRover.type: {
      const { message } = action.payload;
      if (message.type === "cameraStreamReport") {
        store.dispatch(cameraStreamDataReportReceived({
          cameraName: message.camera,
          frameData: message.data
        }));
      } else if (message.type === "cameraFrameReport" && message.data !== "") {
        let link = document.createElement("a");
        link.href = `data:image/jpg;base64,${message.data}`;
        let time = new Date();
        let timezoneOffset = time.getTimezoneOffset() * 60000;
        let timeString = new Date(time - timezoneOffset).toISOString().replace(":", "_").substring(0, 19);

        link.download = `${camelCaseToTitle(message.camera)}-${timeString}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      break;
    }

    default: break;
  }

  return result;
}

export default camerasMiddleware;
