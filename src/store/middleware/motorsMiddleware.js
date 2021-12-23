import {
  messageReceivedFromRover,
  messageRover,
  roverConnected,
  roverDisconnected
} from "../roverSocketSlice";
import { motorStatusReportReceived, requestMotorPower } from "../motorsSlice";

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

    case messageReceivedFromRover.type: {
      const { message } = action.payload;
      if (message.type === "motorStatusReport")
        store.dispatch(motorStatusReportReceived({
          motorName: message.motor,
          position: message.position
        }));
      break;
    }

    case roverConnected.type: {
      // Inform the rover of motor parameters when we connect.
      const motors = store.getState().motors;
      Object.keys(motors).forEach(motorName => {
        const motor = motors[motorName];

      });
      break;
    }

    case roverDisconnected.type: {
      const motors = store.getState().motors;
      Object.keys(motors).forEach(motorName => {
        const motor = motors[motorName];

      });
      break;
    }

    default: break;
  }

  return result;
}

export default motorsMiddleware;
