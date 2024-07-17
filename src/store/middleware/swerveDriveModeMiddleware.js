import { roverConnected, messageRover } from "../roverSocketSlice";
import { requestSwerveDriveMode } from "../swerveDriveModeSlice";

/**
 * Middleware that handles sending messages to the rover to request swerve
 * drive modes.
 */
const swerveDriveModeMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestSwerveDriveMode.type: {
      store.dispatch(messageRover({
        message: {
          type: "swerveDriveModeRequest",
          mode: action.payload.mode,
          override: action.payload.override
        }
      }));
      break;
    }

    default: break;
  }

  return result;
}

export default swerveDriveModeMiddleware;