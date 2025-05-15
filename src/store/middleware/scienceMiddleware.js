import { selectMountedPeripheral } from "../peripheralsSlice";
import {selectJointCurrentPosition, requestJointPower, requestJointPosition, selectAllJointNames } from "../jointsSlice";
import { /*, selectAllMotorNames*/ } from "../motorsSlice";
import {getPosRequstValidJoints} from "../scienceSlice";
import { Computer, ComputerOutlined } from "@mui/icons-material";

/**
 * Middleware that messages the rover in response to user input.
 */
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
      // updateScienceRequests(
      //   prevComputedInput,
      //   computedInput,
      //   prevMountedPeripheral,
      //   mountedPeripheral,
      //   store.dispatch
      // );
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
      if(computedInput.science.requestPos) {
        console.log(computedInput.science[field]);
          dispatch(requestJointPosition({
            jointName: field,
            position: computedInput.science[field]
          }));
      }
      else if (Object.keys(selectAllJointNames).find(element => field.str === element.str) !== null) {
          dispatch(requestJointPower({
            jointName: field,
            power: computedInput.science[field]
          }));
      }
    }
  })
}

// Upon toggling science positioning request move joint until the
// desired angle is reached. Currently only works with fourbar
// function updateScienceRequests(
//   prevComputedInput,
//   computedInput,
//   prevMountedPeripheral,
//   mountedPeripheral,
//   dispatch
// ) {
//   Object.keys(computedInput.science).forEach(field => {
//     if(computedInput.science.requestPos && 
//       getPosRequstValidJoints.includes(field)) {
//       console.log(field);
//       var currAngle = Math.round(selectJointCurrentPosition[field]);
//       console.log(currAngle);
//       if(currAngle != computedInput.science[field]
//         && currAngle < computedInput.science[field]) {
//         dispatch(requestJointPower({
//           jointName: field,
//           power: 1
//         }));
//       }
//       else if (currAngle != computedInput.science[field]
//       && currAngle < computedInput.science[field]){
//         dispatch(requestJointPower({
//           jointName: field,
//           power: -1
//         }));
//       }
//     }
//   })
// }

export default scienceMiddleware;