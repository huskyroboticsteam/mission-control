import { messageReceivedFromRover } from "../roverSocketSlice";
import { lidarReportReceived } from "../lidarSlice";

/**
 * Middleware that handles receiving lidar data.
 */
const lidarMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === messageReceivedFromRover.type) {
    const { message } = action.payload;
    if (message.type === "lidarReport") {
      const { points } = message;
      store.dispatch(lidarReportReceived({
        points
      }));
    }
  }

  return result;
}

export default lidarMiddleware;
