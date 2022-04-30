import { selectMountedPeripheral } from "../peripheralsSlice";
import { requestDrive, requestTankDrive } from "../driveSlice";
import { requestLazySusanPosition, requestLidPosition, requestSyringePosition } from "../scienceSlice";
import { requestJointPower } from "../jointsSlice";

/**
 * Middleware that messages the rover in response to user input.
 */
const inputMiddleware = store => next => action => {
  if (action.type.startsWith("input/")) {
    const prevComputedInput = store.getState().input.computed;
    const prevMountedPeripheral = selectMountedPeripheral(store.getState());
    const result = next(action);
    const computedInput = store.getState().input.computed;
    const mountedPeripheral = selectMountedPeripheral(store.getState());

    updateDrive(prevComputedInput, computedInput, store.dispatch);
    updatePeripherals(
      prevComputedInput,
      computedInput,
      prevMountedPeripheral,
      mountedPeripheral,
      store.dispatch
    );

    return result;
  } else {
    return next(action);
  }
}

function updateDrive(prevComputedInput, computedInput, dispatch) {
  if (computedInput.drive.tank) {
    const { tankLeft: prevTankLeft, tankRight: prevTankRight } = prevComputedInput.drive;
    const { tankLeft, tankRight } = computedInput.drive;
    if (tankLeft !== prevTankLeft || tankRight !== prevTankRight)
      dispatch(requestTankDrive({ left: tankLeft, right: tankRight }));
  } else {
    const { straight: prevStraight, steer: prevSteer } = prevComputedInput.drive;
    const { straight, steer } = computedInput.drive;
    if (straight !== prevStraight || steer !== prevSteer) {
      dispatch(requestDrive({ straight, steer }));
    }
  }
}

function updatePeripherals(
  prevComputedInput,
  computedInput,
  prevMountedPeripheral,
  mountedPeripheral,
  dispatch
) {
  if (mountedPeripheral === "scienceStation")
    updateScienceStation(
      prevComputedInput,
      computedInput,
      prevMountedPeripheral,
      mountedPeripheral,
      dispatch
    );
  else if (mountedPeripheral === "arm")
    updateArm(
      prevComputedInput,
      computedInput,
      prevMountedPeripheral,
      mountedPeripheral,
      dispatch
    );
}

function updateScienceStation(
  prevComputedInput,
  computedInput,
  prevMountedPeripheral,
  mountedPeripheral,
  dispatch
) {
  const scienceInput = computedInput.science;
  const prevScienceInput = prevComputedInput.science;
  if (scienceInput.lazySusanPosition !== prevScienceInput.lazySusanPosition || true)
    dispatch(requestLazySusanPosition({
      position: computedInput.science.lazySusanPosition
    }));
  if(scienceInput.lidClosed !== prevScienceInput.lidClosed || true)
    dispatch(requestLidPosition({
      closed: computedInput.science.lidClosed
  }));
  if(scienceInput.syringeDepth !== prevScienceInput.syringeDepth || true) 
    dispatch(requestSyringePosition({
      depth: computedInput.science.syringeDepth
  }));
    
}

function updateArm(
  prevComputedInput,
  computedInput,
  prevMountedPeripheral,
  mountedPeripheral,
  dispatch
) {
  Object.keys(computedInput.arm).forEach(jointName => {
    if (computedInput.arm[jointName] !== prevComputedInput.arm[jointName]
      || mountedPeripheral !== prevMountedPeripheral)
      dispatch(requestJointPower({
        jointName,
        power: computedInput.arm[jointName]
      }));
  });
}

export default inputMiddleware;