import {
  requestJointPower,
  requestJointPosition,
  jointPositionReportReceived
} from "../jointsSlice";
import { selectMotorsAreEnabled } from "../motorsSlice";
import { messageRover, messageReceivedFromRover } from "../roverSocketSlice";

/**
 * Middleware that handles sending and receiving joint data.
 */
const jointsMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestJointPower.type: {
      if (selectMotorsAreEnabled(store.getState())) {
        const { jointName, power } = action.payload;
        store.dispatch(messageRover({
          message: {
            type: "jointPowerRequest",
            joint: jointName,
            power
          }
        }));
      }
      break;
    }

    case requestJointPosition.type: {
      if (selectMotorsAreEnabled(store.getState())) {
        const { jointName, position } = action.payload;
        store.dispatch(messageRover({
          message: {
            type: "jointPositionRequest",
            joint: jointName,
            position
          }
        }));
      }
      break;
    }

    case messageReceivedFromRover.type: {
      const { message } = action.payload;
      if (message.type === "jointPositionReport") {
        const { joint: jointName, position } = message;
        store.dispatch(jointPositionReportReceived({
          jointName,
          position
        }));
      }
      break;
    }

    default: break;
  }

  return result;
}

export default jointsMiddleware;
