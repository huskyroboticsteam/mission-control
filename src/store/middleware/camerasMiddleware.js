import { CAMERA_STREAM_FPS, CAMERA_STREAM_WIDTH, CAMERA_STREAM_HEIGHT } from "../../constants/cameraConstants";
import { cameraStreamOpenRequested, cameraStreamCloseRequested, cameraStreamDataReceived } from "../camerasSlice";
import { messageReceivedFromRover, messageRover, roverConnected } from "../roverSlice";

/**
 * Middleware that handles requesting and receiving camera streams from the
 * rover.
 */
const camerasMiddleware = store => next => action => {
  next(action);
  
  switch (action.type) {
    case cameraStreamOpenRequested.type:
      store.dispatch(messageRover({
        message: {
          type: "cameraStreamOpenRequest",
          camera: action.payload.cameraName,
          fps: CAMERA_STREAM_FPS,
          width: CAMERA_STREAM_WIDTH,
          height: CAMERA_STREAM_HEIGHT
        }
      }));
      break;

    case cameraStreamCloseRequested.type:
      store.dispatch(messageRover({
        message: {
          type: "cameraStreamCloseRequest",
          camera: action.payload.cameraName
        }
      }));
      break;

    case roverConnected.type:
      // Inform the rover of camera streams we would like to receive when we
      // connect.
      const cameras = store.getState().cameras;
      Object.keys(cameras).forEach(cameraName => {
        if (cameras[cameraName].isStreaming) {
          store.dispatch(messageRover({
            message: {
              type: "cameraStreamOpenRequest",
              camera: cameraName,
              fps: CAMERA_STREAM_FPS,
              width: CAMERA_STREAM_WIDTH,
              height: CAMERA_STREAM_HEIGHT
            }
          }));
        }
      });
      break;

    case messageReceivedFromRover.type:
      const { message } = action.payload;
      store.dispatch(cameraStreamDataReceived({
        cameraName: message.camera,
        frameData: message.data
      }));
      break;

    default:
      break;
  }
}

export default camerasMiddleware;
