import { requestDrive, requestTankDrive, requestHolonomicDrive } from "../driveSlice";
import { selectMotorsAreEnabled } from "../motorsSlice";
import { messageRover } from "../roverSocketSlice";

/**
 * Middleware that handles sending drive requests to the rover.
 */
const driveMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestDrive.type: {
      if (selectMotorsAreEnabled(store.getState())) {
        const { straight, steer } = action.payload;
        store.dispatch(messageRover({
          message: {
            type: "driveRequest",
            straight,
            steer
          }
        }));
      }
      break;
    }

    case requestTankDrive.type: {
      if (selectMotorsAreEnabled(store.getState())) {
        const { left, right } = action.payload;
        store.dispatch(messageRover({
          message: {
            type: "tankDriveRequest",
            left,
            right
          }
        }));
      }
      break;
    }

    case requestHolonomicDrive.type: {
      if (selectMotorsAreEnabled(store.getState())) {
        const { straight, left, turnCCW } = action.payload;
        store.dispatch(messageRover({
          message: {
            type: "holonomicDriveRequest",
            straight,
            left,
            turnCCW
          }
        }));
      }
    }

    default: break;
  }

  return result;
};

export default driveMiddleware;
