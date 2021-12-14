import { emergencyStopRequested, roverConnected, messageRover } from "../roverSlice";

/**
 * Middleware that handles sending messages to the rover to request emergency
 * stops.
 */
const emergencyStopMiddleware = store => next => action => {
  next(action);

  switch (action.type) {
    case emergencyStopRequested.type:
    case roverConnected.type: {
      store.dispatch(messageRover({
        message: {
          type: "emergencyStopRequest",
          stop: store.getState().rover.emergencyStopEngaged
        }
      }));
      break;
    }

    default: break;
  }
}

export default emergencyStopMiddleware;
