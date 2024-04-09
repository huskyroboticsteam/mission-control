import { roverConnected, messageRover } from "../roverSocketSlice";
import { requestSwerveDriveMode } from "../swerveDriveModeSlice";

/**
 * Middleware that handles sending messages to the rover to request swerve
 * drive modes.
 */
const swerveDriveModeMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestSwerveDriveMode.type:
    case roverConnected.type: {
      store.dispatch(messageRover({
        message: {
          type: "swerveDriveModeRequest",
          mode: store.getState().swerveDriveMode.mode,
          override: store.getState().swerveDriveMode.override
        }
      }));
      break;
    }

    default: break;
  }

  return result;
}

export default swerveDriveModeMiddleware;