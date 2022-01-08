import { messageReceivedFromRover, messageRover } from "../roverSocketSlice";
import {
  motorStatusReportReceived,
  requestMotorPower,
  requestMotorPosition
} from "../motorsSlice";

/**
 * Middleware that handles sending and receiving motor data.
 */
const motorsMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case requestMotorPower.type: {
      const { motorName, power } = action.payload;
      store.dispatch(messageRover({
        message: {
          type: "motorPowerRequest",
          motor: motorName,
          power
        }
      }));
      break;
    }

    case requestMotorPosition.type: {
      const { motorName, position } = action.payload;
      store.dispatch(messageRover({
        message: {
          type: "motorPositionRequest",
          motor: motorName,
          position
        }
      }));
      break;
    }

    case messageReceivedFromRover.type: {
      const { message } = action.payload;
      if (message.type === "motorStatusReport") {
        const { motor: motorName, power, position, velocity } = message;
        store.dispatch(motorStatusReportReceived({
          motorName,
          power,
          position,
          velocity
        }));
      }
      break;
    }

    default: break;
  }

  return result;
}

export default motorsMiddleware;
