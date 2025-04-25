import { selectMountedPeripheral } from "../peripheralsSlice";
import { requestJointPower, selectAllJointNames } from "../jointsSlice";
import { requestMotorPower/*, selectAllMotorNames*/ } from "../motorsSlice";

/**
 * Middleware that messages the rover in response to user input.
 */
const inputMiddleware = (store) => (next) => (action) => {
      const prevComputedInput = store.getState().input.computed;
      const prevMountedPeripheral = selectMountedPeripheral(store.getState());
      const result = next(action);
      const computedInput = store.getState().input.computed;
      const mountedPeripheral = selectMountedPeripheral(store.getState());
      updateScience(
        prevComputedInput,
        computedInput,
        prevMountedPeripheral,
        mountedPeripheral,
        store.dispatch
      );
      return result;
    }

function updateScience(
  prevComputedInput,
  computedInput,
  prevMountedPeripheral,
  mountedPeripheral,
  dispatch
) {
  Object.keys(computedInput.science).forEach(field => {
    if (computedInput.science[field] !== prevComputedInput.science[field]
      || mountedPeripheral !== prevMountedPeripheral) {
      if (Object.keys(selectAllJointNames).find(element => field.str === element.str) !== null) {
        dispatch(requestJointPower({
          jointName: field,
          power: computedInput.science[field]
        }));
      } else {
        dispatch(requestMotorPower({
          motorName: field,
          power: computedInput.science[field]
        }));
      }
    }
  })
}

export default inputMiddleware;