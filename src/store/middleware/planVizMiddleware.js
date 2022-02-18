import { messageReceivedFromRover } from "../roverSocketSlice";
import {
  plannedPathReportReceived,
  poseConfidenceReportReceived,
  lidarReportReceived
} from "../planVizSlice";

/**
 * Middleware that handles receiving data for the Plan Viz.
 */
const planVizMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === messageReceivedFromRover.type) {
    const { message } = action.payload;
    switch (message.type) {
      case "autonomousPlannedPathReport": {
        const { path } = message;
        store.dispatch(plannedPathReportReceived({
          path
        }));
        break;
      }

      case "poseConfidenceReport": {
        const { radiusX, radiusY, rotation } = message;
        store.dispatch(poseConfidenceReportReceived({
          radiusX,
          radiusY,
          rotation
        }));
        break;
      }

      case "lidarReport": {
        const { points } = message;
        store.dispatch(lidarReportReceived({
          points
        }));
        break;
      }

      default: break;
    }
  }

  return result;
}

export default planVizMiddleware;
