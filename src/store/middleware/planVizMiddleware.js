import { messageReceivedFromRover } from "../roverSocketSlice";
import { plannedPathReportReceived, lidarReportReceived } from "../planVizSlice";

/**
 * Middleware that handles receiving data for the Plan Viz.
 */
const planVizMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === messageReceivedFromRover.type) {
    const { message } = action.payload;
    switch (message.type) {
      case "lidarReport": {
        const { points } = message;
        store.dispatch(lidarReportReceived({
          points
        }));
        break;
      }

      case "autonomousPlannedPathReport": {
        const { path } = message;
        store.dispatch(plannedPathReportReceived({
          path
        }));
        break;
      }

      default: break;
    }
  }

  return result;
}

export default planVizMiddleware;
