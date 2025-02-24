import { selectMountedPeripheral } from "../peripheralsSlice";
import { requestDrive, requestTankDrive } from "../driveSlice";
import { requestJointPower } from "../jointsSlice";
import { enableIK, visuallyEnableIK } from "../inputSlice";
import { messageReceivedFromRover, messageRover, roverDisconnected, roverConnected } from "../roverSocketSlice";

/**
 * Middleware that messages the rover in response to user input.
 */
const inputMiddleware = store => next => action => {
  if (action.type.startsWith("input/")) {
    if (action.type === enableIK.type) {
      store.dispatch(messageRover({
        message: {
          type: "requestArmIKEnabled",
          enabled: action.payload.enable
        }
      }));
      return next(action);
    } else {
      const prevComputedInput = store.getState().input.computed;
      const prevMountedPeripheral = selectMountedPeripheral(store.getState());
      const result = next(action);
      const computedInput = store.getState().input.computed;
      const mountedPeripheral = selectMountedPeripheral(store.getState());

      updateDrive(prevComputedInput, computedInput, store);
      updatePeripherals(
        prevComputedInput,
        computedInput,
        prevMountedPeripheral,
        mountedPeripheral,
        store.dispatch
      );
      return result;
    }
  } else {
    switch (action.type) {
      case roverDisconnected.type: case roverConnected.type: {
        store.dispatch(enableIK({ enable: false }));
        break;
      }

      case messageReceivedFromRover.type: {
        const { message } = action.payload;
        if (message.type === "armIKEnabledReport") {
          let lastArmIKState = store.getState().input.inverseKinematics.lastSentArmIKState;
          if (lastArmIKState !== null && lastArmIKState !== message.enabled) {
            alert("Arm IK was unable to be " + (!message.enabled ? "enabled." : "disabled."));
          }
          store.dispatch(visuallyEnableIK(message.enabled));
        }
        break;
      }
      default: break;
    }
    return next(action);
  }
}

function updateDrive(prevComputedInput, computedInput, store) {
  const dispatch = store.dispatch;
  if (computedInput.drive.tank) {
    const { left: prevLeft, right: prevRight } = prevComputedInput.drive;
    const { left, right } = computedInput.drive;
    if (left !== prevLeft || right !== prevRight) {
    dispatch(requestTankDrive({ left, right }));
    }
  } else {
    const { straight: prevStraight, steer: prevSteer } = prevComputedInput.drive;
    const { straight, steer } = computedInput.drive;
    if (straight !== prevStraight || steer !== prevSteer) {
    dispatch(requestDrive({ straight, steer }));
    }
  }
  
  const prevActiveSuspension = prevComputedInput.drive.activeSuspension;
  const activeSuspension = computedInput.drive.activeSuspension;
  if (activeSuspension !== prevActiveSuspension) {
    dispatch(requestJointPower({
      "jointName": "activeSuspension",
      power: activeSuspension
    }));
  }
}

function updatePeripherals(
  prevComputedInput,
  computedInput,
  prevMountedPeripheral,
  mountedPeripheral,
  dispatch
) {
  if (mountedPeripheral === "arm")
    updateArm(
      prevComputedInput,
      computedInput,
      prevMountedPeripheral,
      mountedPeripheral,
      dispatch
    );
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