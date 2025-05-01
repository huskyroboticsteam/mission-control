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
          camera: Number(action.payload.cameraID),
          fps: 20,  // default to 20
        }
      }));
      break;
    }

    case closeCameraStream.type: {
      store.dispatch(messageRover({
        message: {
          type: "cameraStreamCloseRequest",
          camera: Number(action.payload.cameraID)
        }
      }));
      break;
    }

    case roverConnected.type: {
      // Inform the rover of camera streams we would like to receive when we
      // connect.
      const cameras = store.getState().cameras;
      Object.keys(cameras).forEach(cameraID => {
        const camera = cameras[cameraID];
        if (camera.isStreaming) {
          store.dispatch(messageRover({
            message: {
              type: "cameraStreamOpenRequest",
              camera: Number(cameraID),
              fps: 20, // default to 20
            }
          }));
        }
      });
      break;
    }

    case roverDisconnected.type: {
      const cameras = store.getState().cameras;
      Object.keys(cameras).forEach(cameraID => {
        const camera = cameras[cameraID];
        if (camera.isStreaming && camera.frameData !== null) {
          store.dispatch(cameraStreamDataReportReceived({
            cameraName: cameraID,
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
          cameraID: message.camera,
          frameData: message.data
        }));
      break;
    }

    default: break;
  }

  return result;
}

export default camerasMiddleware;
