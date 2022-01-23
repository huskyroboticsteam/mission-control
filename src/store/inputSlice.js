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
    leftTrigger: 0,
    rightTrigger: 0,
    dPadLeft: false,
    dPadRight: false,
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
      elbow: 0,
      forearm: 0,
      differentialLeft: 0,
      differentialRight: 0,
      hand: 0
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

  state.computed.drive.straight = driveGamepad.leftStickY + getAxisFromKeys(pressedKeys, "ARROWDOWN", "ARROWUP");
  state.computed.drive.steer = driveGamepad.rightStickX + getAxisFromKeys(pressedKeys, "ARROWLEFT", "ARROWRIGHT");

  // Apply precision controls and clamp.
  const drivePrecisionMultiplier = getPrecisionMultiplier(pressedKeys, driveGamepad);
  Object.entries(state.computed.drive).forEach(
    ([direction, value]) => state.computed.drive[direction] = clamp1(drivePrecisionMultiplier * value)
  );

  state.computed.motorPower.armBase = armGamepad.leftStickX + getAxisFromKeys(pressedKeys, "A", "D");
  state.computed.motorPower.shoulder = -armGamepad.leftStickY + getAxisFromKeys(pressedKeys, "W", "S");
  state.computed.motorPower.elbow = -armGamepad.rightStickY + getAxisFromKeys(pressedKeys, "I", "K");
  state.computed.motorPower.forearm = -armGamepad.rightStickX + getAxisFromKeys(pressedKeys, "J", "L");
  state.computed.motorPower.hand = armGamepad.rightTrigger - armGamepad.leftTrigger + getAxisFromKeys(pressedKeys, "O", "P");

  // Differential motors should either have the same power, or opposite power.
  const differentialPitch = getAxisFromButtons(armGamepad, "dPadUp", "dPadDown") + getAxisFromKeys(pressedKeys, "T", "G");
  const differentialRoll = getAxisFromButtons(armGamepad, "dPadLeft", "dPadRight") + getAxisFromKeys(pressedKeys, "F", "H");
  if (Math.abs(differentialPitch) >= Math.abs(differentialRoll)) {
    state.computed.motorPower.differentialLeft = differentialPitch;
    state.computed.motorPower.differentialRight = differentialPitch;
  } else {
    state.computed.motorPower.differentialLeft = differentialRoll;
    state.computed.motorPower.differentialRight = -differentialRoll;
  }

  // Apply precision controls and clamp.
  const armPrecisionMultiplier = getPrecisionMultiplier(pressedKeys, armGamepad);
  Object.entries(state.computed.motorPower).forEach(
    ([motorName, power]) => state.computed.motorPower[motorName] = clamp1(power * armPrecisionMultiplier)
  );
}

function getAxisFromButtons(gamepad, negativeButton, positiveButton) {
  let axis = 0;
  if (gamepad[negativeButton]) axis--;
  if (gamepad[positiveButton]) axis++;
  return axis;
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
  keyReleased
} = inputSlice.actions;

export const selectInputDeviceIsConnected = deviceName => state => state.input[deviceName].isConnected;

export default inputSlice.reducer;
