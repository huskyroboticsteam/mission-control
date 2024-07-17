import { roverPositionReportReceived } from "../telemetrySlice";
import { messageReceivedFromRover } from "../roverSocketSlice";

const telemetryMiddleware = store => next => action => {
  const result = next(action);
  if (action.type === messageReceivedFromRover.type) {
    const { message } = action.payload;
    if (message.type === "roverPositionReport") {
      const { orientW, orientX, orientY, orientZ, lon, lat, alt, recency } = message;
      store.dispatch(roverPositionReportReceived({
        orientW,
        orientX,
        orientY,
        orientZ,
        lon,
        lat,
        alt,
        recency
      }));
    }
  }

  return result;
}

export default telemetryMiddleware;
