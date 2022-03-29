import { createSlice } from "@reduxjs/toolkit";

const gamepadTemplate = {
  isConnected: false,
  "LeftStickX": 0,
  "LeftStickY": 0,
  "RightStickX": 0,
  "RightStickY": 0,
  "LeftTrigger": 0,
  "RightTrigger": 0,
  "A": false,
  "B": false,
  "X": false,
  "Y": false,
  "Start": false,
  "Back": false,
  "LB": false,
  "RB": false,
  "DPadUp": false,
  "DPadDown": false,
  "DPadLeft": false,
  "DPadRight": false
};

const initialState = {
  driveGamepad: { ...gamepadTemplate },
  peripheralGamepad: { ...gamepadTemplate },
  keyboard: {
    isConnected: true,
    pressedKeys: []
  },
  computed: {
    drive: {
      tank: false,
      straight: 0,
      steer: 0,
      tankLeft: 0,
      tankRight: 0
    },
    arm: {
      armBase: 0,
      shoulder: 0,
      elbow: 0,
      forearm: 0,
      differentialRoll: 0,
      differentialPitch: 0,
      hand: 0,
    },
    science: {
      drillArm: 0
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
      const { gamepadName, axisName, value } = action.payload;
      state[gamepadName][axisName] = value;
      computeInput(state, action);
    },

    gamepadButtonChanged(state, action) {
      const { gamepadName, buttonName, pressed } = action.payload;
      if (buttonName === "LT" || buttonName === "RT")
        // Treat triggers as axes, not buttons.  
        return;
      state[gamepadName][buttonName] = pressed;
      computeInput(state, action);
    },

    keyPressed(state, action) {
      const key = action.payload.key.toUpperCase();
      if (!state.keyboard.pressedKeys.includes(key)) {
        state.keyboard.pressedKeys.push(key);
      }
      computeInput(state, action);
    },

    keyReleased(state, action) {
      const key = action.payload.key.toUpperCase();
      const index = state.keyboard.pressedKeys.indexOf(key);
      if (index !== -1)
        state.keyboard.pressedKeys.splice(index, 1);
      computeInput(state, action);
    }
  }
});

function computeInput(state, action) {
  computeDriveInput(state, action);
  computePeripheralInput(state);
}

function computeDriveInput(state, action) {
  const driveGamepad = state.driveGamepad;
  const pressedKeys = state.keyboard.pressedKeys;

  const driveInput = state.computed.drive;

  // Spacebar or the Y button toggles tank drive.
  if (action.type === keyPressed.type && action.payload.key === " ") {
    driveInput.tank = !driveInput.tank;
  } else if (
    action.type === gamepadButtonChanged.type &&
    action.payload.gamepadName === "driveGamepad" &&
    action.payload.buttonName === "Y" &&
    action.payload.pressed
  ) {
    driveInput.tank = !driveInput.tank;
  }

  driveInput.straight = driveGamepad["LeftStickY"] + getAxisFromKeys(pressedKeys, "ARROWDOWN", "ARROWUP");
  driveInput.steer = driveGamepad["RightStickX"] + getAxisFromKeys(pressedKeys, "ARROWLEFT", "ARROWRIGHT");
  driveInput.tankLeft = driveGamepad["LeftStickY"] + getAxisFromKeys(pressedKeys, "ARROWDOWN", "ARROWLEFT")
  driveInput.tankRight = driveGamepad["RightStickY"] + getAxisFromKeys(pressedKeys, "ARROWRIGHT", "ARROWUP");

  // Apply precision controls and clamp.
  const drivePrecisionMultiplier = getPrecisionMultiplier(pressedKeys, driveGamepad);
  ["straight", "steer", "tankLeft", "tankRight"].forEach(
    axis => driveInput[axis] = clamp1(drivePrecisionMultiplier * driveInput[axis])
  );
}

function computePeripheralInput(state) {
  computeArmInput(state);
  computeScienceInput(state);
}

function computeArmInput(state) {
  const peripheralGamepad = state.peripheralGamepad;
  const pressedKeys = state.keyboard.pressedKeys;

  const armInput = state.computed.arm;
  armInput.armBase =
    peripheralGamepad["LeftStickX"] +
    getAxisFromKeys(pressedKeys, "A", "D");
  armInput.shoulder =
    peripheralGamepad["LeftStickY"] +
    getAxisFromKeys(pressedKeys, "S", "W");
  armInput.elbow =
    peripheralGamepad["RightStickY"] +
    getAxisFromKeys(pressedKeys, "K", "I");
  armInput.forearm =
    peripheralGamepad["RightStickX"] +
    getAxisFromKeys(pressedKeys, "J", "L");
  armInput.hand =
    peripheralGamepad["LeftTrigger"] -
    peripheralGamepad["RightTrigger"] +
    getAxisFromKeys(pressedKeys, "P", "O");
  armInput.differentialPitch =
    getAxisFromButtons(peripheralGamepad, "DPadDown", "DPadUp") +
    getAxisFromKeys(pressedKeys, "G", "T");
  armInput.differentialRoll =
    getAxisFromButtons(peripheralGamepad, "DPadLeft", "DPadRight") +
    getAxisFromKeys(pressedKeys, "F", "H");

  // Apply precision controls and clamp.
  const armPrecisionMultiplier = getPrecisionMultiplier(pressedKeys, peripheralGamepad);
  Object.entries(armInput).forEach(
    ([jointName, power]) => armInput[jointName] = clamp1(power * armPrecisionMultiplier)
  );
}

function computeScienceInput(state) {
  // TODO
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
  if (gamepad["LB"])
    multiplier *= 0.3;
  if (gamepad["RB"])
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
