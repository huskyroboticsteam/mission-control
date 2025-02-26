import { createSlice } from "@reduxjs/toolkit";
import { keyboardMap, gamepadMap } from "../utils/controlMapping";

const gamepadTemplate = {
  isConnected: false,
  LeftStickX: 0,
  LeftStickY: 0,
  RightStickX: 0,
  RightStickY: 0,
  LeftTrigger: 0,
  RightTrigger: 0,
  LS: false,
  RS: false,
  A: false,
  B: false,
  X: false,
  Y: false,
  Start: false,
  Back: false,
  LB: false,
  RB: false,
  DPadUp: false,
  DPadDown: false,
};

const initialState = {
  driveGamepad: { ...gamepadTemplate },
  peripheralGamepad: { ...gamepadTemplate },
  keyboard: {
    isConnected: true,
    pressedKeys: [],
  },
  computed: {
    drive: {
      tank: false,
      left: 0,
      right: 0,
    },
    arm: {
      armBase: 0,
      shoulder: 0,
      elbow: 0,
      forearm: 0,
      wristDiffLeft: 0,
      wristDiffRight: 0,
      hand: 0,
      handActuator: 0,
      ikUp: 0,
      ikForward: 0,
    },
    science: {
      drillMotor: 0,
    },
  },
  inverseKinematics: {
    enabled: false,
    lastSentArmIKState: null,
  },
};

function isLinux() {
  return navigator.platform.toLowerCase().includes("linux");
}

const inputSlice = createSlice({
  name: "input",
  initialState,
  reducers: {
    gamepadConnected(state, action) {
      const { gamepadName } = action.payload;
      state[gamepadName].isConnected = true;
    },

    gamepadDisconnected(state, action) {
      const { gamepadName } = action.payload;
      state[gamepadName].isConnected = false;
    },

    gamepadAxisChanged(state, action) {
      const prevState = JSON.parse(JSON.stringify(state));
      const { gamepadName, axisName, value } = action.payload;
      // linux maps dpad to axes, so map them to buttons
      // also rescale triggers from [-1,1] -> [0,1], if necessary
      if (axisName === "DPadY") {
        state[gamepadName]["DPadDown"] = value < 0;
        state[gamepadName]["DPadUp"] = value > 0;
      } else if (axisName === "DPadX") {
        state[gamepadName]["DPadLeft"] = value < 0;
        state[gamepadName]["DPadRight"] = value > 0;
      } else if (
        isLinux() &&
        (axisName === "LeftTrigger" || axisName === "RightTrigger") &&
        value !== 0.0
      ) {
        // bug in linux, trigger values keep jumping to 0.
        // Rejecting this is ok, since it'll never be *exactly* zero, since that's halfway-pressed
        // TODO: fix this? Why is this happening? Bug in react-gamepad??
        state[gamepadName][axisName] = (value + 1) / 2.0;
      } else {
        let scaledValue = value * Math.abs(value);
        state[gamepadName][axisName] = scaledValue;
      }
      computeInput(prevState, state, action);
    },

    gamepadButtonChanged(state, action) {
      const prevState = JSON.parse(JSON.stringify(state));
      const { gamepadName, buttonName, pressed } = action.payload;
      if (buttonName === "LT" || buttonName === "RT")
        // Treat triggers as axes, not buttons.
        return;
      state[gamepadName][buttonName] = pressed;
      computeInput(prevState, state, action);
    },

    keyPressed(state, action) {
      const prevState = JSON.parse(JSON.stringify(state));
      const key = action.payload.key.toUpperCase();
      if (!state.keyboard.pressedKeys.includes(key)) {
        state.keyboard.pressedKeys.push(key);
      }
      computeInput(prevState, state, action);
    },

    keyReleased(state, action) {
      const prevState = JSON.parse(JSON.stringify(state));
      const key = action.payload.key.toUpperCase();
      const index = state.keyboard.pressedKeys.indexOf(key);
      if (index !== -1) state.keyboard.pressedKeys.splice(index, 1);
      computeInput(prevState, state, action);
    },

    enableIK(state, action) {
      state.inverseKinematics.lastSentArmIKState = action.payload.enable;
    },

    visuallyEnableIK(state, action) {
      const enable = action.payload;
      state.inverseKinematics.enabled = enable;
    },
  },
});

function computeInput(prevState, state, action) {
  computeDriveInput(state, action);
  computePeripheralInput(prevState, state, action);
}

function computeDriveInput(state, action) {
  const driveGamepad = state.driveGamepad;
  const pressedKeys = state.keyboard.pressedKeys;
  const driveInput = state.computed.drive;

  ["straight", "steer", "left", "right"].forEach(
    (axis) => (driveInput[axis] = 0)
  );

  pressedKeys.forEach((key) => {
    if (key === keyboardMap.drive.special.toggleTankDrive.control) {
      driveInput.tank = !driveInput.tank;
    } else {
      Object.entries(keyboardMap.drive.joints).forEach(([joint, config]) => {
        const controls = config.controls;
        if (controls[key]) {
          driveInput[joint] += controls[key] === "+" ? 1 : -1;
        }
      });
    }
  });

  const mode = driveInput.tank ? "tank" : "normal";
  Object.entries(gamepadMap.drive.joints).forEach(([joint, config]) => {
    if (config[mode]) {
      Object.entries(config[mode]).forEach(([axis, direction]) => {
        const value = driveGamepad[axis];
        driveInput[joint] += direction === "+" ? value : -value;
      });
    }
  });

  const drivePrecisionMultiplier = getPrecisionMultiplier(
    pressedKeys,
    driveGamepad
  );
  ["straight", "steer", "left", "right"].forEach(
    (axis) =>
      (driveInput[axis] = clamp1(drivePrecisionMultiplier * driveInput[axis]))
  );
}

function computePeripheralInput(prevState, state, action) {
  computeArmInput(state);
  computeScienceInput(prevState, state, action);
}

function computeArmInput(state) {
  const peripheralGamepad = state.peripheralGamepad;
  const pressedKeys = state.keyboard.pressedKeys;
  const armInput = state.computed.arm;
  const isIKEnabled = state.inverseKinematics.enabled;

  Object.keys(armInput).forEach((key) => (armInput[key] = 0));

  pressedKeys.forEach((key) => {
    Object.entries(keyboardMap.arm.joints).forEach(([joint, config]) => {
      const controls = config.controls;
      if (controls[key]) {
        armInput[joint] += controls[key] === "+" ? 1 : -1;
      }
    });
  });

  Object.entries(gamepadMap.peripheral.joints).forEach(([joint, config]) => {
    if (config.axes) {
      Object.entries(config.axes).forEach(([axis, direction]) => {
        const value = peripheralGamepad[axis];
        armInput[joint] += direction === "+" ? value : -value;
      });
    }

    const mode = isIKEnabled ? "ik" : "normal";
    if (config[mode]) {
      Object.entries(config[mode]).forEach(([input, direction]) => {
        const value = peripheralGamepad[input];
        armInput[joint] += direction === "+" ? value : -value;
      });
    }

    if (config.buttons) {
      Object.entries(config.buttons).forEach(([button, direction]) => {
        if (peripheralGamepad[button]) {
          armInput[joint] += direction === "+" ? 1 : -1;
        }
      });
    }
  });

  const armPrecisionMultiplier = getPrecisionMultiplier(
    pressedKeys,
    peripheralGamepad
  );
  Object.entries(armInput).forEach(
    ([jointName, power]) =>
      (armInput[jointName] = clamp1(power * armPrecisionMultiplier))
  );
}

function computeScienceInput(prevState, state, action) {
  const prevPressedKeys = prevState.keyboard.pressedKeys;
  const pressedKeys = state.keyboard.pressedKeys;
  const scienceInput = state.computed.science;

  if (
    pressedKeys.includes(keyboardMap.science.special.toggleDrillMotor.control) &&
    !prevPressedKeys.includes(keyboardMap.science.special.toggleDrillMotor.control)
  ) {
    scienceInput.drillMotor = !scienceInput.drillMotor;
  }
}

function getPrecisionMultiplier(pressedKeys, gamepad) {
  let multiplier = 1;
  Object.values(keyboardMap.drive.special).forEach((config) => {
    if (pressedKeys.includes(config.control)) {
      multiplier *= 0.2;
    }
  });

  Object.entries(gamepadMap.drive.special).forEach(([joint, config]) => {
    if (config.precision) {
      if (gamepad[joint]) multiplier *= 0.3;
    }
  });
  return multiplier;
}

function clamp1(n) {
  if (n < -1) return -1;
  if (n > 1) return 1;
  return n;
}

export const {
  gamepadConnected,
  gamepadDisconnected,
  gamepadAxisChanged,
  gamepadButtonChanged,
  keyPressed,
  keyReleased,
  enableIK,
  visuallyEnableIK,
} = inputSlice.actions;

export const selectInputDeviceIsConnected = (deviceName) => (state) =>
  state.input[deviceName].isConnected;
export const selectDriveGamepad = (state) => state.input.driveGamepad;
export const selectPeripheralGamepad = (state) => state.input.peripheralGamepad;
export const selectInverseKinematicsEnabled = (state) =>
  state.input.inverseKinematics.enabled;
export default inputSlice.reducer;
