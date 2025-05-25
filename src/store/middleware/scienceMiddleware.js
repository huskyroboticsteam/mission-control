import { selectMountedPeripheral } from "../peripheralsSlice";
import {selectJointCurrentPosition, requestJointPower, requestJointPosition, selectAllJointNames } from "../jointsSlice";
import { /*, selectAllMotorNames*/ } from "../motorsSlice";
import {getPosRequstValidJoints} from "../scienceSlice";
import { Computer, ComputerOutlined } from "@mui/icons-material";

/**
 * Middleware that messages the rover in response to user input.
 */

var delay = 500;
var lastCalled = 0;

const scienceMiddleware = (store) => (next) => (action) => {
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
    // simple arm is going too far
    if (((computedInput.science[field] !== prevComputedInput.science[field]
      || mountedPeripheral !== prevMountedPeripheral || ((field === "fourBarLinkage") && delay <= (Date.now() - lastCalled)))) && Number.isInteger(computedInput.science[field])
      && field != "speed") {
      console.log("update")
      lastCalled = Date.now();
      if(computedInput.science.requestPos) {
          dispatch(requestJointPosition({
            jointName: field,
            position: computedInput.science[field]
          }));
      }
      else if (Object.keys(selectAllJointNames).find(element => field.str === element.str) !== null) {
          dispatch(requestJointPower({
            jointName: field,
            power: (computedInput.science[field] * computedInput.science["speed"])
          }));
      }
    }
  })
}

export default scienceMiddleware;