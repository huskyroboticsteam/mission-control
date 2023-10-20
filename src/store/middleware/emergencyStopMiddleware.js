import { roverConnected, messageRover } from "../roverSocketSlice";
import { requestStop } from "../emergencyStopSlice";
import { enableIK } from "../inputSlice";

/**
 * Middleware that handles sending messages to the rover to request emergency
 * stops.
 */
const emergencyStopMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestStop.type:
    case roverConnected.type: {
      store.dispatch(messageRover({
        message: {
          type: "emergencyStopRequest",
          stop: store.getState().emergencyStop.stopped
        }
      }));
      break;
    }

    default: break;
  }

  return result;
}

export default emergencyStopMiddleware;
