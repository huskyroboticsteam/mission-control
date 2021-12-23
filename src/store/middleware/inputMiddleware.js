import { requestDrive } from "../driveSlice";
import { requestMotorPower } from "../motorsSlice";

/**
 * Middleware that messages the rover in response to user input.
 */
const inputMiddleware = store => next => action => {
  if (action.type.startsWith("input/")) {
    const prevComputedInput = store.getState().input.computed;
    const result = next(action);
    const computedInput = store.getState().input.computed;

    const { straight: prevStraight, steer: prevSteer } = prevComputedInput.drive;
    const { straight, steer } = computedInput.drive;
    if (straight !== prevStraight || steer !== prevSteer) {
      store.dispatch(requestDrive({
        straight,
        steer
      }));
    }

    Object.keys(computedInput.motorPower).forEach(motorName => {
      if (computedInput.motorPower[motorName] !== prevComputedInput.motorPower[motorName])
        store.dispatch(requestMotorPower({
          motorName,
          power: computedInput.motorPower[motorName]
        }));
    });

    return result;
  } else {
    return next(action);
  }
}

export default inputMiddleware;
