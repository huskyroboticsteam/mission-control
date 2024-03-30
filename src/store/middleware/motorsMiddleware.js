import { motorStatusReportReceived, motorLimitsReceived, enableMotors } from "../motorsSlice";
import { messageReceivedFromRover } from "../roverSocketSlice";
import { requestDrive } from "../driveSlice";
import { requestJointPower, selectAllJointNames } from "../jointsSlice";
import { enableIK } from "../inputSlice";

/**
 * Middleware that handles receiving motor telemetry.
 */
const motorsMiddleware = store => next => action => {
  switch (action.type) {
    case messageReceivedFromRover.type: {
      const result = next(action);
      const { message } = action.payload;
      if (message.type === "motorStatusReport") {
        const { motor: motorName, power, position } = message;
        store.dispatch(motorStatusReportReceived({
          motorName,
          power,
          position
        }));
      } else if(message.type === "motorLimitsReport") {
        const { motor: motorName, limits } = message;
        store.dispatch(motorLimitsReceived({
          motorName,
          limits
        }));
      }
      return result;
    }

    case enableMotors.type: {
      const { enabled } = action.payload;
      // send ik packet with false
      store.dispatch(enableIK({ enable: false }));
      if (!enabled) {
        store.dispatch(requestDrive({
          straight: 0,
          steer: 0
        }));

        const jointNames = selectAllJointNames(store.getState());
        jointNames.forEach(jointName => {
          store.dispatch(requestJointPower({
            jointName,
            power: 0
          }));
        });
      }
      return next(action);
    }

    default: break;
  }

  return next(action);
}

export default motorsMiddleware;
