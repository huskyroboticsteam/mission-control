import { messageReceivedFromRover } from "../roverSocketSlice";
import { logEntryReportReceived } from "../loggingSlice";

/**
 * Middleware that handles receiving log entries from the rover.
 */
const loggingMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === messageReceivedFromRover.type) {
    if (action.payload.message.type === "logEntryReport") {
      const { logLevel, message, timestamp } = action.payload.message;
      store.dispatch(logEntryReportReceived({
        logEntry: {
          logLevel,
          message,
          timestamp
        }
      }));
    }
  }

  return result;
}

export default loggingMiddleware;
