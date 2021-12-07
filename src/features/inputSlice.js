import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  driveGamepad: {
    isConnected: false,
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0
  },
  armGamepad: {
    isConnected: false,
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0
  },
  keyboard: {
    isConnected: true,
    pressedKeys: []
  },
  computed: {
    driveStraight: 0,
    driveSteer: 0,
    armBasePower: 0,
    shoulderPower: 0,
    elbowPower: 0
  }
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
      const { gamepadName, axisName, value } = action.payload;
      state[gamepadName][axisName] = value;
      computeInput(state);
    },

    gamepadButtonChanged(state, action) {
      const { gamepadName, button, down } = action.payload;
      state[gamepadName][button] = down;
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
  state.computed = {
    driveStraight: driveGamepad.leftStickY + getAxisFromKeys(pressedKeys, "ARROWDOWN", "ARROWUP"),
    driveSteer: driveGamepad.rightStickX + getAxisFromKeys(pressedKeys, "ARROWLEFT", "ARROWRIGHT"),
    armBasePower: armGamepad.leftStickX + getAxisFromKeys(pressedKeys, "A", "Q"),
    shoulderPower: armGamepad.leftStickY + getAxisFromKeys(pressedKeys, "S", "W"),
    elbowPower: armGamepad.rightStickY + getAxisFromKeys(pressedKeys, "D", "E")
  };
}

function getAxisFromKeys(pressedKeys, negativeKey, positiveKey) {
  let axis = 0;
  if (pressedKeys.includes(negativeKey)) axis--;
  if (pressedKeys.includes(positiveKey)) axis++;
  return axis;
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
