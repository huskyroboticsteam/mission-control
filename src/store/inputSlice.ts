import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {
  GamepadInitialState,
  GamepadNames,
  type GamepadState,
} from '../constants/gamepadConstants.js'
import type {Axis, Button} from 'react-gamepad'
import {isLinux} from '../util/isLinux.js'
import type {RootState} from './store.js'

// See https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values for pressedKeys strings
type InputState = {
  readonly [G in keyof typeof GamepadNames]: GamepadState
} & {
  readonly pressedKeys: string[]
}

const initialState: InputState = {
  driveGamepad: GamepadInitialState,
  peripheralGamepad: GamepadInitialState,
  pressedKeys: [],
  // computed: {
  //   drive: {
  //     tank: false,
  //     left: 0,
  //     right: 0,
  //   },
  //   arm: {
  //     armBase: 0,
  //     shoulder: 0,
  //     elbow: 0,
  //     forearm: 0,
  //     wristPitch: 0,
  //     wristRoll: 0,
  //     hand: 0,
  //     handActuator: 0,
  //     ikUp: 0,
  //     ikForward: 0,
  //   },
  //   science: {
  //     fourBarLinkage: 0,
  //     requestPos: false,
  //     speed: 1 / 3,
  //     drillMotor: 0,
  //     drillActuator: 0,
  //   },
  // },
  // inverseKinematics: {
  //   enabled: false,
  //   lastSentArmIKState: null,
  // },
  // emergencyStop: false,
  // triggerHeld: false,
}

export const inputSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    gamepadConnected: (state, action: PayloadAction<{gamepadName: keyof typeof GamepadNames}>) => {
      state[action.payload.gamepadName].isConnected = true
    },

    gamepadDisconnected: (
      state,
      action: PayloadAction<{gamepadName: keyof typeof GamepadNames}>
    ) => {
      state[action.payload.gamepadName].isConnected = false
    },

    gamepadAxisChanged: (
      state,
      action: PayloadAction<{
        gamepadName: keyof typeof GamepadNames
        axisName: Axis
        value: number
      }>
    ) => {
      const {gamepadName, axisName, value} = action.payload
      // linux maps dpad to axes, so map them to buttons
      // also rescale triggers from [-1,1] -> [0,1], if necessary
      if (isLinux() && (axisName === 'LeftTrigger' || axisName === 'RightTrigger')) {
        // bug in linux, trigger values keep jumping to 0.
        // Rejecting this is ok, since it'll never be *exactly* zero, since that's halfway-pressed
        if (value !== 0.0) {
          state[gamepadName][axisName] = (value + 1) / 2.0
        }
      } else {
        const scaledValue = value * Math.abs(value)
        state[gamepadName][axisName] = scaledValue
      }
      // computeInput(state, action)
    },

    gamepadButtonChanged: (
      state,
      action: PayloadAction<{
        gamepadName: keyof typeof GamepadNames
        buttonName: Button
        pressed: boolean
      }>
    ) => {
      const {gamepadName, buttonName, pressed} = action.payload

      state[gamepadName][buttonName] = pressed
      // computeInput(state, action)
    },

    keyPressed: (state, action: PayloadAction<{key: string}>) => {
      const key = action.payload.key.toUpperCase()
      if (!state.pressedKeys.includes(key)) {
        state.pressedKeys.push(key)
      }

      // computeInput(state, action)
    },

    keyReleased: (state, action: PayloadAction<{key: string}>) => {
      const key = action.payload.key.toUpperCase()
      const index = state.pressedKeys.indexOf(key)
      if (index !== -1) {
        state.pressedKeys.splice(index, 1)
      }
      // computeInput(state, action)
    },
  },
})

// type InputActions = ReturnType<(typeof inputSlice.actions)[keyof typeof inputSlice.actions]>

// const computeInput = (state: WritableDraft<InputState>, action: InputActions) => {
//   // Emergency stop
//   if (action.type === keyPressed.type && action.payload.key === ' ') {
//     requestStop({stop: !selectIsStopped(state)})
//   }

//   computeDriveInput(state, action)
//   computePeripheralInput(state, state)
// }

// function computeDriveInput(state, action) {
//   const driveGamepad = state.driveGamepad
//   const pressedKeys = state.keyboard.pressedKeys

//   const driveInput = state.computed.drive

//   // Y key or the Y button toggles tank drive.
//   if (
//     (action.type === keyPressed.type && action.payload.key === 'y') ||
//     (action.type === gamepadButtonChanged.type &&
//       action.payload.gamepadName === 'driveGamepad' &&
//       action.payload.buttonName === 'Y' &&
//       action.payload.pressed)
//   ) {
//     driveInput.tank = !driveInput.tank
//   }

//   driveInput.straight =
//     -driveGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWUP')
//   driveInput.steer =
//     driveGamepad['RightStickX'] + getAxisFromKeys(pressedKeys, 'ARROWLEFT', 'ARROWRIGHT')
//   driveInput.left =
//     -driveGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'ARROWDOWN', 'ARROWLEFT')
//   driveInput.right =
//     -driveGamepad['RightStickY'] + getAxisFromKeys(pressedKeys, 'ARROWRIGHT', 'ARROWUP')
//   }

//   // Apply precision controls and clamp.
//   const drivePrecisionMultiplier = getPrecisionMultiplier(pressedKeys, driveGamepad, true)
//   ;['straight', 'steer', 'left', 'right'].forEach(
//     (axis) => (driveInput[axis] = clamp1(drivePrecisionMultiplier * driveInput[axis]))
//   )
// }

// function computePeripheralInput(prevState, state) {
//   computeArmInput(state)
//   computeScienceInput(prevState, state)
// }

// function computeArmInput(state) {
//   const peripheralGamepad = state.peripheralGamepad
//   const pressedKeys = state.keyboard.pressedKeys
//   const armInput = state.computed.arm

//   armInput.armBase = peripheralGamepad['LeftStickX'] + getAxisFromKeys(pressedKeys, 'A', 'D')
//   if (state.inverseKinematics.enabled) {
//     armInput.ikForward = -peripheralGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'S', 'W')
//     armInput.ikUp = -peripheralGamepad['RightStickY'] + getAxisFromKeys(pressedKeys, 'G', 'T')
//     armInput.shoulder = 0
//     armInput.elbow = 0
//   } else {
//     armInput.shoulder = peripheralGamepad['LeftStickY'] + getAxisFromKeys(pressedKeys, 'S', 'W')
//     armInput.elbow = -peripheralGamepad['RightStickY'] + getAxisFromKeys(pressedKeys, 'T', 'G')
//     armInput.ikUp = 0
//     armInput.ikForward = 0
//   }
//   armInput.forearm = peripheralGamepad['RightStickX'] + getAxisFromKeys(pressedKeys, 'F', 'H')
//   armInput.wristPitch =
//     getAxisFromButtons(peripheralGamepad, 'DPadDown', 'DPadUp') +
//     getAxisFromKeys(pressedKeys, 'K', 'I')
//   armInput.wristRoll =
//     getAxisFromButtons(peripheralGamepad, 'DPadLeft', 'DPadRight') +
//     getAxisFromKeys(pressedKeys, 'U', 'O')
//   armInput.hand =
//     // getAxisFromButtons(peripheralGamepad, 'A', 'B') +
//     peripheralGamepad['LeftTrigger'] -
//     peripheralGamepad['RightTrigger'] +
//     getAxisFromKeys(pressedKeys, 'J', 'L')
//   armInput.handActuator =
//     getAxisFromButtons(peripheralGamepad, 'Y', 'X') + getAxisFromKeys(pressedKeys, ',', '.')

//   // Apply precision controls and clamp.
//   const armPrecisionMultiplier = getPrecisionMultiplier(pressedKeys, peripheralGamepad)
//   Object.entries(armInput).forEach(
//     ([jointName, power]) => (armInput[jointName] = clamp1(power * armPrecisionMultiplier))
//   )
// }

// function computeScienceInput(prevState, state) {
//   const prevPeripheralGamepad = prevState.peripheralGamepad
//   const peripheralGamepad = state.peripheralGamepad
//   const prevPressedKeys = prevState.keyboard.pressedKeys
//   const pressedKeys = state.keyboard.pressedKeys
//   const scienceInput = state.computed.science

//   // Toggle from setting pos to not toggling pos
//   if (pressedKeys.includes('/')) {
//     scienceInput.requestPos = !scienceInput.requestPos
//   }

//   if (!scienceInput.requestPos) {
//     scienceInput.fourBarLinkage =
//       getAxisFromKeys(pressedKeys, 'C', 'V') *
//       getPrecisionMultiplier(pressedKeys, peripheralGamepad)
//     if (pressedKeys.includes('1')) {
//       // Slow speed
//       scienceInput.speed = 1 / 3
//     } else if (pressedKeys.includes('2')) {
//       // Medium speed
//       scienceInput.speed = 2 / 3
//     } else if (pressedKeys.includes('3')) {
//       // Fast speed
//       scienceInput.speed = 1
//     }
//   } else {
//     // get pos to toggle
//     if (pressedKeys.includes('1')) {
//       // 30 degrees
//       scienceInput.fourBarLinkage = 30
//     } else if (pressedKeys.includes('2')) {
//       // 60 degrees
//       scienceInput.fourBarLinkage = 60
//     } else if (pressedKeys.includes('3')) {
//       // 90 degrees
//       scienceInput.fourBarLinkage = 90
//     }
//   }

//   state.computed.science.drillMotor = toggleKey(
//     prevPressedKeys,
//     pressedKeys,
//     'B',
//     state.computed.science.drillMotor
//   )
//   state.computed.science.drillActuator = getAxisFromKeys(pressedKeys, 'N', 'P')
// }

// function getAxisFromButtons(gamepad, negativeButton, positiveButton) {
//   let axis = 0
//   if (gamepad[negativeButton]) axis--
//   if (gamepad[positiveButton]) axis++
//   return axis
// }

// function getAxisFromKeys(pressedKeys, negativeKey, positiveKey) {
//   let axis = 0
//   if (pressedKeys.includes(negativeKey)) axis--
//   if (pressedKeys.includes(positiveKey)) axis++
//   return axis
// }

// function toggleKey(prevPressedKeys, pressedKeys, key, currState) {
//   if (!prevPressedKeys.includes(key) && pressedKeys.includes(key)) {
//     if (currState == 0) return -1
//     else return 0
//   }
//   return currState
// }

// function getPrecisionMultiplier(pressedKeys, gamepad) {
//   let multiplier = 1
//   if (pressedKeys.includes('SHIFT')) multiplier *= 0.2
//   if (gamepad['LB']) multiplier *= 0.3
//   if (gamepad['RB']) multiplier *= 0.3
//   return multiplier
// }

// function clamp1(n) {
//   if (n < -1) return -1
//   if (n > 1) return 1
//   return n
// }

export const {
  gamepadConnected,
  gamepadDisconnected,
  gamepadAxisChanged,
  gamepadButtonChanged,
  keyPressed,
  keyReleased,
} = inputSlice.actions

export const selectInputDeviceIsConnected =
  (deviceName: keyof typeof GamepadNames) => (state: RootState) =>
    state.input[deviceName].isConnected
// export const selectDriveGamepad = (state) => state.input.driveGamepad
// export const selectPeripheralGamepad = (state) => state.input.peripheralGamepad
// export const selectInverseKinematicsEnabled = (state) => state.input.inverseKinematics.enabled
// export const selectDrillMotor = (state) => state.input.computed.science.drillMotor
