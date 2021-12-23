import { requestDrive } from "../driveSlice";
import { messageRover } from "../roverSocketSlice";

/**
 * Middleware that handles sending drive requests to the rover.
 */
const driveMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === requestDrive.type) {
    const { straight, steer } = action.payload;
    store.dispatch(messageRover({
      message: {
        type: "driveRequest",
        straight,
        steer
      }
    }));
  }

  return result;
};

export default driveMiddleware;
