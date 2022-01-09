import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  driveGamepad: {
    isConnected: false,
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0,
    lB: false,
    rB: false
  },
  armGamepad: {
    isConnected: false,
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0,
    lB: false,
    rB: false
  },
  keyboard: {
    isConnected: true,
    pressedKeys: []
  },
  computed: {
    drive: {
      straight: 0,
      steer: 0
    },
    motorPower: {
      armBase: 0,
      shoulder: 0,
      elbow: 0
    }
  }
};

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
      let { gamepadName, axisName, value } = action.payload;
      // Convert to camelCase.
      axisName = axisName[0].toLowerCase() + axisName.substring(1);
      state[gamepadName][axisName] = value;
      computeInput(state);
    },

    gamepadButtonChanged(state, action) {
      let { gamepadName, buttonName, pressed } = action.payload;
      // Convert to camelCase.
      buttonName = buttonName[0].toLowerCase() + buttonName.substring(1);
      state[gamepadName][buttonName] = pressed;
      computeInput(state);
    },

    keyPressed(state, action) {
      const key = action.payload.key.toUpperCase();
      if (!state.keyboard.pressedKeys.includes(key)) {
        state.keyboard.pressedKeys.push(key);
        computeInput(state);
      }
    },

    keyReleased(state, action) {
      const key = action.payload.key.toUpperCase();
      const index = state.keyboard.pressedKeys.indexOf(key);
      if (index !== -1) {
        state.keyboard.pressedKeys.splice(index, 1);
        computeInput(state);
      }
    }
  }
});

function computeInput(state) {
  const driveGamepad = state.driveGamepad;
  const armGamepad = state.armGamepad;
  const pressedKeys = state.keyboard.pressedKeys;

  const drivePrecisionMultiplier = getPrecisionMultiplier(pressedKeys, driveGamepad);
  state.computed.drive.straight = driveGamepad.leftStickY + getAxisFromKeys(pressedKeys, "ARROWDOWN", "ARROWUP");
  state.computed.drive.straight *= drivePrecisionMultiplier;
  state.computed.drive.steer = driveGamepad.rightStickX + getAxisFromKeys(pressedKeys, "ARROWLEFT", "ARROWRIGHT");
  state.computed.drive.steer *= drivePrecisionMultiplier;

  const armPrecisionMultiplier = getPrecisionMultiplier(pressedKeys, armGamepad);
  state.computed.motorPower.armBase = armGamepad.leftStickX + getAxisFromKeys(pressedKeys, "A", "D");
  state.computed.motorPower.armBase *= armPrecisionMultiplier;
  state.computed.motorPower.shoulder = armGamepad.leftStickY + getAxisFromKeys(pressedKeys, "S", "W");
  state.computed.motorPower.shoulder *= armPrecisionMultiplier;
  state.computed.motorPower.elbow = armGamepad.rightStickY + getAxisFromKeys(pressedKeys, "K", "I");
  state.computed.motorPower.elbow *= armPrecisionMultiplier;
}

function getAxisFromKeys(pressedKeys, negativeKey, positiveKey) {
  let axis = 0;
  if (pressedKeys.includes(negativeKey)) axis--;
  if (pressedKeys.includes(positiveKey)) axis++;
  return axis;
}

function getPrecisionMultiplier(pressedKeys, gamepad) {
  let multiplier = 1;
  if (pressedKeys.includes("SHIFT"))
    multiplier *= 0.2;
  if (gamepad.lB)
    multiplier *= 0.3;
  if (gamepad.rB)
    multiplier *= 0.3;
  return multiplier;
}

export const {
  gamepadConnected,
  gamepadDisconnected,
  gamepadAxisChanged,
  gamepadButtonChanged,
  keyPressed,
  keyReleased
} = inputSlice.actions;

export const selectInputDeviceIsConnected = deviceName => state => state.input[deviceName].isConnected;

export default inputSlice.reducer;
