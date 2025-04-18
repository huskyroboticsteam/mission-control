import {PayloadAction, createSlice} from '@reduxjs/toolkit'

interface GamepadState {
  isConnected: boolean
  LeftStickX: number
  LeftStickY: number
  RightStickX: number
  RightStickY: number
  LeftTrigger: number
  RightTrigger: number
  LS: boolean
  RS: boolean
  A: boolean
  B: boolean
  X: boolean
  Y: boolean
  Start: boolean
  Back: boolean
  LB: boolean
  RB: boolean
  DPadUp: boolean
  DPadDown: boolean
  DPadLeft: boolean
  DPadRight: boolean
}

interface KeyboardState {
  isConnected: boolean
  pressedKeys: string[]
}

interface DriveState {
  tank: boolean
  straight: number
  crab: number
  steer: number
  left: number
  right: number
  activeSuspension: number
  type?: string
}

interface ArmState {
  armBase: number
  shoulder: number
  elbow: number
  forearm: number
  wristPitch: number
  wristRoll: number
  hand: number
  handActuator: number
  ikUp: number
  ikForward: number
}

interface ScienceState {
  lazySusanPosition: number
  instrumentationArm: number
  drillOn: boolean
}

interface InverseKinematicsState {
  enabled: boolean
  lastSentArmIKState: boolean | null
}

interface InputState {
  driveGamepad: GamepadState
  peripheralGamepad: GamepadState
  keyboard: KeyboardState
  computed: {
    drive: DriveState
    arm: ArmState
    science: ScienceState
  }
  inverseKinematics: InverseKinematicsState
}

// Payloads
interface GamepadConnectionPayload {
  gamepadName: 'driveGamepad' | 'peripheralGamepad'
}

interface GamepadAxisPayload {
  gamepadName: string
  axisName: string
  value: number
}

interface GamepadButtonPayload {
  gamepadName: string
  buttonName: string
  pressed: boolean
}

interface KeyPayload {
  key: string
}

interface EnableIKPayload {
  enable: boolean
}
/** -=--------------------=--------------------=--------------------=--------------------=-------------------= */

const gamepadTemplate: GamepadState = {
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
  DPadLeft: false,
  DPadRight: false,
}

const initialState: InputState = {
  driveGamepad: {...gamepadTemplate},
  peripheralGamepad: {...gamepadTemplate},
  keyboard: {
    isConnected: true,
    pressedKeys: [],
  },
  computed: {
    drive: {
      tank: false,
      straight: 0,
      crab: 0,
      steer: 0,
      left: 0,
      right: 0,
      activeSuspension: 0,
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
      instrumentationArm: 0,
      drillOn: false,
    },
  },
  inverseKinematics: {
    enabled: false,
    lastSentArmIKState: null,
  },
}

function isLinux(): boolean {
  return navigator.platform.toLowerCase().includes('linux')
}

const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    // not sure if this is correct. don't know why there's state[gamepadName].isconnected
    gamepadConnected(state: InputState, action: PayloadAction<GamepadConnectionPayload>) {
      const {gamepadName}: {gamepadName: string} = action.payload
      if (gamepadName === 'driveGamepad') {
        state.driveGamepad.isConnected = true
      } else if (gamepadName === 'peripheralGamepad') {
        state.peripheralGamepad.isConnected = true
      }
    },

    gamepadDisconnected(state: InputState, action: PayloadAction<GamepadConnectionPayload>) {
      const {gamepadName}: {gamepadName: string} = action.payload
      if (gamepadName === 'driveGamepad') {
        state.driveGamepad.isConnected = false
      } else if (gamepadName === 'peripheralGamepad') {
        state.peripheralGamepad.isConnected = false
      }
    },

    gamepadAxisChanged(state: InputState, action: PayloadAction<GamepadAxisPayload>) {
      const prevState: InputState = JSON.parse(JSON.stringify(state)) // check?
      const {
        gamepadName,
        axisName,
        value,
      }: {
        gamepadName: string
        axisName: string
        value: number
      } = action.payload
      // linux maps dpad to axes, so map them to buttons
      // also rescale triggers from [-1,1] -> [0,1], if necessary
      if (gamepadName === 'driveGamepad' || gamepadName === 'peripheralGamepad') {
        if (axisName === 'DPadY') {
          state[gamepadName].DPadDown = value < 0
          state[gamepadName].DPadUp = value > 0
        } else if (axisName === 'DPadX') {
          state[gamepadName].DPadLeft = value < 0
          state[gamepadName].DPadRight = value > 0
        } else if (
          isLinux() &&
          (axisName === 'LeftTrigger' || axisName === 'RightTrigger') &&
          value !== 0.0
        ) {
          // bug in linux, trigger values keep jumping to 0.
          // Rejecting this is ok, since it'll never be *exactly* zero, since that's halfway-pressed
          // TODO: fix this? Why is this happening? Bug in react-gamepad??
          state[gamepadName][axisName] = (value + 1) / 2.0
        } else if (
          axisName === 'LeftStickX' ||
          axisName === 'LeftStickY' ||
          axisName === 'RightStickX' ||
          axisName === 'RightStickY' ||
          axisName === 'RightTrigger' ||
          axisName === 'LeftTrigger'
        ) {
          let scaledValue = value * Math.abs(value)
          state[gamepadName][axisName] = scaledValue
        }
      }
      computeInput(prevState, state, action)
    },

    gamepadButtonChanged(state: InputState, action: PayloadAction<GamepadButtonPayload>) {
      const prevState: InputState = JSON.parse(JSON.stringify(state))
      const {
        gamepadName,
        buttonName,
        pressed,
      }: {
        gamepadName: string
        buttonName: string
        pressed: boolean
      } = action.payload

      if (buttonName === 'LT' || buttonName === 'RT')
        // Treat triggers as axes, not buttons.
        return
      if (gamepadName === 'driveGamepad' || gamepadName === 'peripheralGamepad') {
        state[gamepadName][buttonName] = pressed
      }
      computeInput(prevState, state, action)
    },

    keyPressed(state: InputState, action: PayloadAction<KeyPayload>) {
      const prevState: InputState = JSON.parse(JSON.stringify(state))
      const key: string = action.payload.key.toUpperCase()

      if (!state.keyboard.pressedKeys.includes(key)) {
        state.keyboard.pressedKeys.push(key)
      }
      computeInput(prevState, state, action)
    },

    keyReleased(state: InputState, action: PayloadAction<KeyPayload>) {
      const prevState: InputState = JSON.parse(JSON.stringify(state))
      const key: string = action.payload.key.toUpperCase()
      const index = state.keyboard.pressedKeys.indexOf(key)

      if (index !== -1) state.keyboard.pressedKeys.splice(index, 1)
      computeInput(prevState, state, action)
    },

    /** Not sure if enableIK & visuallyEnableIK are correct...  */
    enableIK(state: InputState, action: PayloadAction<EnableIKPayload>) {
      state.inverseKinematics.lastSentArmIKState = action.payload.enable
    },

    visuallyEnableIK(state: InputState, action: PayloadAction<boolean>) {
      const enable: boolean = action.payload
      state.inverseKinematics.enabled = enable
    },
  },
})

/** Todo: add action type */
function computeInput(prevState: InputState, state: InputState, action: PayloadAction<any>): void {
  computeDriveInput(state, action)
  computePeripheralInput(prevState, state, action)
}

/** Todo: add action type */
function computeDriveInput(state: InputState, action: PayloadAction<any>): void {
  const driveGamepad = state.driveGamepad
  const pressedKeys = state.keyboard.pressedKeys

  const driveInput = state.computed.drive

  // Spacebar or the Y button toggles tank drive if swerve mode is normal.
  if (
    (action.type === keyPressed.type && action.payload.key === ' ') ||
    (action.type === gamepadButtonChanged.type &&
      action.payload.gamepadName === 'driveGamepad' &&
      action.payload.buttonName === 'Y' &&
      action.payload.pressed)
  ) {
    if (driveInput.type === 'normal') {
      driveInput.tank = !driveInput.tank
    } else {
      alert("Can't switch to tank drive when not on normal driveInput type!")
    }
  }

  driveInput.straight =
    -driveGamepad.LeftStickY + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWUP')
  driveInput.steer =
    driveGamepad.RightStickX + getAxisFromKeys(pressedKeys, 'ARROWLEFT', 'ARROWRIGHT')
  driveInput.left = driveGamepad.LeftStickY + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWLEFT')
  driveInput.right =
    driveGamepad.RightStickY + getAxisFromKeys(pressedKeys, 'ARROWRIGHT', 'ARROWUP')
  driveInput.crab = driveGamepad.LeftStickX + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWUP')

  driveInput.activeSuspension =
    getAxisFromButtons(driveGamepad, 'DPadDown', 'DPadUp') + getAxisFromKeys(pressedKeys, 'B', 'M')

  // Apply precision controls and clamp.
  const drivePrecisionMultiplier = getPrecisionMultiplier(pressedKeys, driveGamepad)
  ;['straight', 'crab', 'steer', 'left', 'right'].forEach(
    (axis) => (driveInput[axis] = clamp1(drivePrecisionMultiplier * driveInput[axis]))
  )
}

/** Todo add action type */
function computePeripheralInput(
  prevState: InputState,
  state: InputState,
  action: PayloadAction<any>
): void {
  computeArmInput(state)
  computeScienceInput(prevState, state)
}

function computeArmInput(state: InputState): void {
  const peripheralGamepad = state.peripheralGamepad
  const pressedKeys = state.keyboard.pressedKeys

  const armInput = state.computed.arm
  armInput.armBase = peripheralGamepad.LeftStickX + getAxisFromKeys(pressedKeys, 'A', 'D')
  if (state.inverseKinematics.enabled) {
    armInput.ikForward = -peripheralGamepad.LeftStickY + getAxisFromKeys(pressedKeys, 'S', 'W')
    armInput.ikUp = -peripheralGamepad.RightStickY + getAxisFromKeys(pressedKeys, 'G', 'T')
    armInput.shoulder = 0
    armInput.elbow = 0
  } else {
    armInput.shoulder = peripheralGamepad.LeftStickY + getAxisFromKeys(pressedKeys, 'S', 'W')
    armInput.elbow = -peripheralGamepad.RightStickY + getAxisFromKeys(pressedKeys, 'T', 'G')
    armInput.ikUp = 0
    armInput.ikForward = 0
  }
  armInput.forearm = peripheralGamepad.RightStickX + getAxisFromKeys(pressedKeys, 'F', 'H')
  armInput.wristPitch =
    -getAxisFromButtons(peripheralGamepad, 'DPadDown', 'DPadUp') +
    getAxisFromKeys(pressedKeys, 'K', 'I')
  armInput.wristRoll =
    getAxisFromButtons(peripheralGamepad, 'DPadLeft', 'DPadRight') +
    getAxisFromKeys(pressedKeys, 'U', 'O')
  armInput.hand =
    peripheralGamepad.LeftTrigger -
    peripheralGamepad.RightTrigger +
    getAxisFromKeys(pressedKeys, 'J', 'L')
  armInput.handActuator =
    getAxisFromButtons(peripheralGamepad, 'B', 'A') + getAxisFromKeys(pressedKeys, ',', '.')

  // Apply precision controls and clamp.
  const armPrecisionMultiplier = getPrecisionMultiplier(pressedKeys, peripheralGamepad)
  Object.entries(armInput).forEach(
    ([jointName, power]) => (armInput[jointName] = clamp1(power * armPrecisionMultiplier))
  )
}

/** figure out what to deal with action */
function computeScienceInput(prevState: InputState, state: InputState): void {
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
  scienceInput.instrumentationArm = getAxisFromKeys(prevPressedKeys, 'C', 'V')
  scienceInput.drillOn = toggleKey(prevPressedKeys, pressedKeys, 'B', scienceInput.drillOn)
}

/**
 * Maps axis output from two button inputs
 *
 * @param gamepad current GamepadState
 * @param negativeButton state of negative button
 * @param positiveButton state of positive button
 * @returns number represeting buttons mapped to axis
 */
function getAxisFromButtons(
  gamepad: GamepadState,
  negativeButton: string,
  positiveButton: string
): number {
  let axis = 0
  if (gamepad[negativeButton]) axis--
  if (gamepad[positiveButton]) axis++
  return axis
}

function getAxisFromKeys(pressedKeys: string[], negativeKey: string, positiveKey: string): number {
  let axis = 0
  if (pressedKeys.includes(negativeKey)) axis--
  if (pressedKeys.includes(positiveKey)) axis++
  return axis
}

function toggleKey(
  prevPressedKeys: string[],
  pressedKeys: string[],
  key: string,
  currState: boolean
): boolean {
  if (!prevPressedKeys.includes(key) && pressedKeys.includes(key)) {
    return !currState
  }
  return currState
}

/** todo pressedKeys */
function getPrecisionMultiplier(pressedKeys: string[], gamepad: GamepadState): number {
  let multiplier = 1
  if (pressedKeys.includes('SHIFT')) multiplier *= 0.2
  if (gamepad.LB) multiplier *= 0.3
  if (gamepad.RB) multiplier *= 0.3
  return multiplier
}

/**
 * Clamps input to [-1, 1]
 *
 * @param n input
 * @returns clamped input to [-1, 1]
 */
function clamp1(n: number): number {
  return Math.max(-1, Math.min(1, n))
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
} = inputSlice.actions

export const selectInputDeviceIsConnected = (deviceName: string) => (state: {input: InputState}) =>
  state.input[deviceName].isConnected
export const selectDriveGamepad = (state: {input: InputState}) => state.input.driveGamepad
export const selectPeripheralGamepad = (state: {input: InputState}) => state.input.peripheralGamepad
export const selectInverseKinematicsEnabled = (state: {input: InputState}) =>
  state.input.inverseKinematics.enabled
export default inputSlice.reducer
