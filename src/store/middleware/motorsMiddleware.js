import { motorStatusReportReceived, enableMotors } from "../motorsSlice";
import { messageReceivedFromRover } from "../roverSocketSlice";
import { requestDrive } from "../driveSlice";
import { requestJointPower, selectAllJointNames } from "../jointsSlice";

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
      }
      return result;
    }

    case enableMotors.type: {
      const { enabled } = action.payload;
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
