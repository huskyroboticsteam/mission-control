import { messageReceivedFromRover } from "../roverSocketSlice";
import { motorStatusReportReceived } from "../motorsSlice";

/**
 * Middleware that handles receiving motor telemetry.
 */
const motorsMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case messageReceivedFromRover.type: {
      const { message } = action.payload;
      if (message.type === "motorStatusReport") {
        const { motor: motorName, power, position } = message;
        store.dispatch(motorStatusReportReceived({
          motorName,
          power,
          position
        }));
      }
      break;
    }

    default: break;
  }

  return result;
}

export default motorsMiddleware;
