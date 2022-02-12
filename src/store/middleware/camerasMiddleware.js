import {
  openCameraStream,
  closeCameraStream,
  cameraStreamDataReportReceived,
} from "../camerasSlice";
import {
  messageReceivedFromRover,
  messageRover,
  roverConnected,
  roverDisconnected
} from "../roverSocketSlice";

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
          camera: action.payload.cameraName
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
              camera: cameraName
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
      if (message.type === "cameraStreamReport")
        store.dispatch(cameraStreamDataReportReceived({
          cameraName: message.camera,
          frameData: message.data
        }));
      break;
    }

    default: break;
  }

  return result;
}

export default camerasMiddleware;
