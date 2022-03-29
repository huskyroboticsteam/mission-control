import { requestDrive, requestTankDrive } from "../driveSlice";
import { messageRover } from "../roverSocketSlice";

/**
 * Middleware that handles sending drive requests to the rover.
 */
const driveMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestDrive.type: {
      const { straight, steer } = action.payload;
      store.dispatch(messageRover({
        message: {
          type: "driveRequest",
          straight,
          steer
        }
      }));
      break;
    }

    case requestTankDrive.type: {
      const { left, right } = action.payload;
      store.dispatch(messageRover({
        message: {
          type: "tankDriveRequest",
          left,
          right
        }
      }));
      break;
    }

    default: break;
  }

  return result;
};

export default driveMiddleware;
