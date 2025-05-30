import {createSlice} from '@reduxjs/toolkit'

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
}

const initialState = {
  driveGamepad: {...gamepadTemplate},
  peripheralGamepad: {...gamepadTemplate},
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
      wristPitch: 0,
      wristRoll: 0,
      hand: 0,
      handActuator: 0,
      ikUp: 0,
      ikForward: 0,
    },
    science: {
      lazySusanPosition: 0,
      fourBarLinkage: 0,
      requestPos: false,
      speed: 1 / 3,
      drillMotor: 0,
      drillActuator: 0,
    },
  },
  inverseKinematics: {
    enabled: false,
    lastSentArmIKState: null,
  },
  emergencyStop: false,
  triggerHeld: false,
}

function isLinux() {
  return navigator.platform.toLowerCase().includes('linux')
}

const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    gamepadConnected(state, action) {
      const {gamepadName} = action.payload
      state[gamepadName].isConnected = true
    },

    gamepadDisconnected(state, action) {
      const {gamepadName} = action.payload
      state[gamepadName].isConnected = false
    },

    gamepadAxisChanged(state, action) {
      const prevState = JSON.parse(JSON.stringify(state))
      const {gamepadName, axisName, value} = action.payload
      // linux maps dpad to axes, so map them to buttons
      // also rescale triggers from [-1,1] -> [0,1], if necessary
      if (axisName === 'DPadY') {
        state[gamepadName]['DPadDown'] = value < 0
        state[gamepadName]['DPadUp'] = value > 0
      } else if (axisName === 'DPadX') {
        state[gamepadName]['DPadLeft'] = value < 0
        state[gamepadName]['DPadRight'] = value > 0
      } else if (
        isLinux() &&
        (axisName === 'LeftTrigger' || axisName === 'RightTrigger') &&
        value !== 0.0
      ) {
        // bug in linux, trigger values keep jumping to 0.
        // Rejecting this is ok, since it'll never be *exactly* zero, since that's halfway-pressed
        // TODO: fix this? Why is this happening? Bug in react-gamepad??
        state[gamepadName][axisName] = (value + 1) / 2.0
      } else {
        let scaledValue = value * Math.abs(value)
        state[gamepadName][axisName] = scaledValue
      }
      computeInput(prevState, state, action)
    },

    gamepadButtonChanged(state, action) {
      const prevState = JSON.parse(JSON.stringify(state))
      const {gamepadName, buttonName, pressed} = action.payload
      if (buttonName === 'LT' || buttonName === 'RT') {
        state.triggerHeld = pressed
        return
      }
      state[gamepadName][buttonName] = pressed
      computeInput(prevState, state, action)
    },

    toggleDrillMotor(state) {
      state.computed.science.drillMotor = state.computed.science.drillMotor === 1 ? 0 : 1
    },

    keyPressed(state, action) {
      const prevState = JSON.parse(JSON.stringify(state))
      const key = action.payload.key.toUpperCase()
      if (!state.keyboard.pressedKeys.includes(key)) {
        state.keyboard.pressedKeys.push(key)
      }
      if (key === 'B') {
        state.computed.science.drillMotor = state.computed.science.drillMotor === 1 ? 0 : 1
      }
      computeInput(prevState, state, action)
    },

    keyReleased(state, action) {
      const prevState = JSON.parse(JSON.stringify(state))
      const key = action.payload.key.toUpperCase()
      const index = state.keyboard.pressedKeys.indexOf(key)
      if (index !== -1) state.keyboard.pressedKeys.splice(index, 1)
      computeInput(prevState, state, action)
    },

    enableIK(state, action) {
      state.inverseKinematics.lastSentArmIKState = action.payload.enable
    },

    visuallyEnableIK(state, action) {
      const enable = action.payload
      state.inverseKinematics.enabled = enable
    },
  },
})

function computeInput(prevState, state, action) {
  computeDriveInput(state, action)
  computePeripheralInput(prevState, state, action)
}

function computeDriveInput(state, action) {
  const driveGamepad = state.driveGamepad
  const pressedKeys = state.keyboard.pressedKeys

  const driveInput = state.computed.drive

  // Emergency stop is toggled by the space bar.
  if (action.type === keyPressed.type && action.payload.key === ' ') {
    state.emergencyStop = !state.emergencyStop
  }

  // Y key or the Y button toggles tank drive.
  if (
    (action.type === keyPressed.type && action.payload.key === 'y') ||
    (action.type === gamepadButtonChanged.type &&
      action.payload.gamepadName === 'driveGamepad' &&
      action.payload.buttonName === 'Y' &&
      action.payload.pressed)
  ) {
    driveInput.tank = !driveInput.tank
  }
  if (state.triggerHeld) {
    // Additional function layer binds go here
  } else {
    driveInput.straight =
      -driveGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWUP')
    driveInput.steer =
      driveGamepad['RightStickX'] + getAxisFromKeys(pressedKeys, 'ARROWLEFT', 'ARROWRIGHT')
    driveInput.left =
      driveGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWLEFT')
    driveInput.right =
      driveGamepad['RightStickY'] + getAxisFromKeys(pressedKeys, 'ARROWRIGHT', 'ARROWUP')
    driveInput.crab =
      driveGamepad['LeftStickX'] + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWUP')
  }

  driveInput.activeSuspension =
    getAxisFromButtons(driveGamepad, 'DPadDown', 'DPadUp') + getAxisFromKeys(pressedKeys, 'B', 'M')

  // Apply precision controls and clamp.
  const drivePrecisionMultiplier = getPrecisionMultiplier(pressedKeys, driveGamepad, true)
  ;['straight', 'crab', 'steer', 'left', 'right'].forEach(
    (axis) => (driveInput[axis] = clamp1(drivePrecisionMultiplier * driveInput[axis]))
  )
}

function computePeripheralInput(prevState, state) {
  computeArmInput(state)
  computeScienceInput(prevState, state)
}

function computeArmInput(state) {
  const peripheralGamepad = state.peripheralGamepad
  const pressedKeys = state.keyboard.pressedKeys
  const armInput = state.computed.arm

  armInput.armBase = peripheralGamepad['LeftStickX'] + getAxisFromKeys(pressedKeys, 'A', 'D')
  if (state.inverseKinematics.enabled) {
    armInput.ikForward = -peripheralGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'S', 'W')
    armInput.ikUp = -peripheralGamepad['RightStickY'] + getAxisFromKeys(pressedKeys, 'G', 'T')
    armInput.shoulder = 0
    armInput.elbow = 0
  } else {
    armInput.shoulder = peripheralGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'S', 'W')
    armInput.elbow = -peripheralGamepad['RightStickY'] + getAxisFromKeys(pressedKeys, 'T', 'G')
    armInput.ikUp = 0
    armInput.ikForward = 0
  }
  armInput.forearm = peripheralGamepad['RightStickX'] + getAxisFromKeys(pressedKeys, 'F', 'H')
  armInput.wristPitch =
    -getAxisFromButtons(peripheralGamepad, 'DPadDown', 'DPadUp') +
    getAxisFromKeys(pressedKeys, 'K', 'I')
  armInput.wristRoll =
    getAxisFromButtons(peripheralGamepad, 'DPadLeft', 'DPadRight') +
    getAxisFromKeys(pressedKeys, 'U', 'O')
  armInput.hand =
    peripheralGamepad['LeftTrigger'] -
    peripheralGamepad['RightTrigger'] +
    getAxisFromKeys(pressedKeys, 'J', 'L')
  armInput.handActuator =
    getAxisFromButtons(peripheralGamepad, 'B', 'A') + getAxisFromKeys(pressedKeys, ',', '.')

  // Apply precision controls and clamp.
  const armPrecisionMultiplier = getPrecisionMultiplier(pressedKeys, peripheralGamepad)
  Object.entries(armInput).forEach(
    ([jointName, power]) => (armInput[jointName] = clamp1(power * armPrecisionMultiplier))
  )
}

function computeScienceInput(prevState, state) {
  const prevPeripheralGamepad = prevState.peripheralGamepad
  const peripheralGamepad = state.peripheralGamepad
  const prevPressedKeys = prevState.keyboard.pressedKeys
  const pressedKeys = state.keyboard.pressedKeys
  const scienceInput = state.computed.science
  const prevLazySusanAxis =
    getAxisFromButtons(prevPeripheralGamepad, 'LB', 'RB') +
    getAxisFromKeys(prevPressedKeys, 'A', 'D')
  const lazySusanAxis =
    getAxisFromButtons(peripheralGamepad, 'LB', 'RB') + getAxisFromKeys(pressedKeys, 'A', 'D')
  if (lazySusanAxis !== prevLazySusanAxis)
    scienceInput.lazySusanPosition =
      (((scienceInput.lazySusanPosition + lazySusanAxis) % 6) + 6) % 6

  // Toggle from setting pos to not toggling pos
  if (pressedKeys.includes('/')) {
    scienceInput.requestPos = !scienceInput.requestPos
  }

  if (!scienceInput.requestPos) {
    scienceInput.fourBarLinkage =
      getAxisFromKeys(pressedKeys, 'C', 'V') *
      getPrecisionMultiplier(pressedKeys, peripheralGamepad)
    if (pressedKeys.includes('1')) {
      // Slow speed
      scienceInput.speed = 1 / 3
    } else if (pressedKeys.includes('2')) {
      // Medium speed
      scienceInput.speed = 2 / 3
    } else if (pressedKeys.includes('3')) {
      // Fast speed
      scienceInput.speed = 1
    }
  } else {
    // get pos to toggle
    if (pressedKeys.includes('1')) {
      // 30 degrees
      scienceInput.fourBarLinkage = 30
    } else if (pressedKeys.includes('2')) {
      // 60 degrees
      scienceInput.fourBarLinkage = 60
    } else if (pressedKeys.includes('3')) {
      // 90 degrees
      scienceInput.fourBarLinkage = 90
    }
  }
  const drillActuatorState = getActuatorStatusFromKeys(pressedKeys, 'N', 'P')
  state.computed.science.drillActuator = drillActuatorState
}

function getActuatorStatusFromKeys(pressedKeys, negative, positive) {
  let status = 0
  if (pressedKeys.includes(negative)) status = -1
  if (pressedKeys.includes(positive)) status = 1
  return status
}

function getAxisFromButtons(gamepad, negativeButton, positiveButton) {
  let axis = 0
  if (gamepad[negativeButton]) axis--
  if (gamepad[positiveButton]) axis++
  return axis
}

function getAxisFromKeys(pressedKeys, negativeKey, positiveKey) {
  let axis = 0
  if (pressedKeys.includes(negativeKey)) axis--
  if (pressedKeys.includes(positiveKey)) axis++
  return axis
}

function toggleKey(prevPressedKeys, pressedKeys, key, currState) {
  if (!prevPressedKeys.includes(key) && pressedKeys.includes(key)) {
    if (currState == 0) return -1
    else return 0
  }
  return currState
}

function getPrecisionMultiplier(pressedKeys, gamepad) {
  let multiplier = 1
  if (pressedKeys.includes('SHIFT')) multiplier *= 0.2
  if (gamepad['LB']) multiplier *= 0.3
  if (gamepad['RB']) multiplier *= 0.3
  return multiplier
}

function clamp1(n) {
  if (n < -1) return -1
  if (n > 1) return 1
  return n
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
  toggleDrillMotor,
} = inputSlice.actions

export const getSpeed = (state) => Math.floor(state.input.computed.science['speed'] * 100)

export const selectInputDeviceIsConnected = (deviceName) => (state) =>
  state.input[deviceName].isConnected
export const selectDriveGamepad = (state) => state.input.driveGamepad
export const selectPeripheralGamepad = (state) => state.input.peripheralGamepad
export const selectInverseKinematicsEnabled = (state) => state.input.inverseKinematics.enabled
export const selectDrillMotor = (state) => state.input.computed.science.drillMotor
export default inputSlice.reducer
