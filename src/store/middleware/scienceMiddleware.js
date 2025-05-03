import { selectMountedPeripheral } from "../peripheralsSlice";
import {selectJointCurrentPosition, requestJointPower, selectAllJointNames } from "../jointsSlice";
import { requestMotorPower/*, selectAllMotorNames*/ } from "../motorsSlice";
import { Computer, ComputerOutlined } from "@mui/icons-material";

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
      updateScienceRequests(
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
    if ((computedInput.science[field] !== prevComputedInput.science[field]
      || mountedPeripheral !== prevMountedPeripheral) && Number.isInteger(computedInput.science[field])) {
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

// Upon toggling science positioning request move joint until the
// desired angle is reached. Currently only works with fourbar
function updateScienceRequests(
  prevComputedInput,
  computedInput,
  prevMountedPeripheral,
  mountedPeripheral,
  dispatch
) {
  if(computedInput.science.requestPos) {
    var currAngle = Math.round(selectJointCurrentPosition["fourBarLinkage"]);
    console.log(currAngle);
    if(currAngle != computedInput.science["fourBarLinkage"]
      && currAngle < computedInput.science["fourBarLinkage"]) {
      dispatch(requestJointPower({
        jointName: "fourBarLinkage",
        power: 1
      }));
    }
    else if (currAngle != computedInput.science["fourBarLinkage"]
    && currAngle < computedInput.science["fourBarLinkage"]){
      dispatch(requestJointPower({
        jointName: "fourBarLinkage",
        power: -1
      }));
    }
    console.log("getting pos");
  }
}

export default inputMiddleware;