import {createSlice, type Draft, type PayloadAction} from '@reduxjs/toolkit'
import {
  GamepadInitialState,
  GamepadNames,
  isAxis,
  isButton,
  type GamepadState,
} from '../constants/gamepadConstants.js'
import type {Axis, Button} from 'react-gamepad'
import {isLinux} from '../util/isLinux.js'
import type {RootState} from './store.js'
import {
  AxisKeyboardControls,
  AxisPeripheralGamepadControls,
  driveGamepadToAxes,
  keyToAxes,
  peripheralGamepadToAxes,
  type InputAxis,
} from '../constants/controls.js'
import type {JointNames} from '../constants/jointConstants.js'

// See https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values for pressedKeys strings
type InputState = {
  readonly [G in keyof typeof GamepadNames]: GamepadState
} & {
  readonly pressedKeys: string[]
  readonly axes: {
    readonly [axis in InputAxis]: number
  }
  readonly axisMultiplier: number
}

const initialState: InputState = {
  driveGamepad: GamepadInitialState,
  peripheralGamepad: GamepadInitialState,
  pressedKeys: [],
  // We are keeping axes calculations here for the conversion between keys to power.
  // This is to keep functionality of holding two keys at the same time and to clamp power.
  axes: {
    straight: 0,
    steer: 0,
    left: 0,
    right: 0,
    armBase: 0,
    shoulder: 0,
    elbow: 0,
    forearm: 0,
    wristPitch: 0,
    wristRoll: 0,
    hand: 0,
    handActuator: 0,
    laser: 0,
    // ikUp: 0,
    // ikForward: 0,
  },
  axisMultiplier: 1.0,
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
      let scaledValue = value
      // linux maps dpad to axes, so map them to buttons
      // also rescale triggers from [-1,1] -> [0,1], if necessary
      if (isLinux() && (axisName === 'LeftTrigger' || axisName === 'RightTrigger')) {
        // bug in linux, trigger values keep jumping to 0.
        // Rejecting this is ok, since it'll never be *exactly* zero, since that's halfway-pressed
        if (value !== 0.0) {
          scaledValue = (value + 1) / 2.0
        }
      } else {
        // Analog stick input squaring
        scaledValue = value * Math.abs(value)
      }

      // Invert Y axes so that forward = positive, backward = negative
      if (gamepadName === 'driveGamepad' && axisName === 'LeftStickY') {
        scaledValue = -scaledValue
      }
      if (gamepadName === 'peripheralGamepad' && (axisName === 'LeftStickX' || axisName === 'RightStickX')) {
        scaledValue = -scaledValue
      }

      if (Math.abs(scaledValue) < 0.05) { scaledValue = 0 }
      if (Math.abs(scaledValue) > 0.95) { scaledValue = Math.round(scaledValue) }

      if (Math.abs(state[gamepadName][axisName] - scaledValue) < 0.05) {
        return state;
      }

      state[gamepadName][axisName] = scaledValue

      if (gamepadName === 'driveGamepad') {
        updateDriveAxesFromGamepad(state, axisName, scaledValue)
      }
      if (gamepadName === 'peripheralGamepad') {
        updatePeripheralAxesFromGamepad(state, axisName, scaledValue)
      }
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

      if (gamepadName === 'peripheralGamepad') {
        updatePeripheralAxesFromGamepad(state, buttonName)
      }
    },

    keyPressed: (state, action: PayloadAction<{key: string}>) => {
      const key = action.payload.key.toUpperCase()
      if (!state.pressedKeys.includes(key)) {
        state.pressedKeys.push(key)
        updateAxesFromKeyboard(state, key)
      }
    },

    keyReleased: (state, action: PayloadAction<{key: string}>) => {
      const key = action.payload.key.toUpperCase()
      const index = state.pressedKeys.indexOf(key)
      if (index !== -1) {
        state.pressedKeys.splice(index, 1)
        updateAxesFromKeyboard(state, key)
      }
    },

    requestAxisMultiplier: (state, action: PayloadAction<{multiplier: number}>) => {
      state.axisMultiplier = action.payload.multiplier
    },
  },
})

const updateDriveAxesFromGamepad = (state: Draft<InputState>, gamepadAxis: Axis, value: number) => {
  driveGamepadToAxes[gamepadAxis]?.forEach((axis) => {
    state.axes[axis as InputAxis] = value * state.axisMultiplier
  })
}

const updatePeripheralAxesFromGamepad = (
  state: Draft<InputState>,
  name: Axis | Button,
  value?: number
) => {
  peripheralGamepadToAxes[name]?.forEach((axis) => {
    if (isAxis(name)) {
      state.axes[axis as InputAxis] = value!
    } else if (isButton(name)) {
      const {negative, positive} = AxisPeripheralGamepadControls[axis as JointNames] as {
        negative: Button
        positive: Button
      }
      state.axes[axis as InputAxis] =
        getAxisFromButtons(state.peripheralGamepad, negative, positive) * state.axisMultiplier
    }
  })
}

const updateAxesFromKeyboard = (state: Draft<InputState>, key: string) => {
  keyToAxes[key]?.forEach((axis) => {
    const {negative, positive} = AxisKeyboardControls[axis as InputAxis]
    state.axes[axis as InputAxis] =
      getAxisFromKeys(state.pressedKeys, negative, positive) * state.axisMultiplier
  })
}

const getAxisFromButtons = (state: GamepadState, negative: Button, positive: Button) => {
  let axis = 0

  if (state[negative]) {
    axis--
  }
  if (state[positive]) {
    axis++
  }

  return axis
}

const getAxisFromKeys = (pressedKeys: string[], negative: string, positive: string) => {
  let axis = 0

  if (pressedKeys.includes(negative)) {
    axis--
  }
  if (pressedKeys.includes(positive)) {
    axis++
  }

  return axis
}

export const {
  gamepadConnected,
  gamepadDisconnected,
  gamepadAxisChanged,
  gamepadButtonChanged,
  keyPressed,
  keyReleased,
  requestAxisMultiplier,
} = inputSlice.actions

export const selectInputDeviceIsConnected =
  (deviceName: keyof typeof GamepadNames) => (state: RootState) =>
    state.input[deviceName].isConnected
export const selectPressedKeys = (state: RootState) => state.input.pressedKeys
export const selectGamepad = (gamepadName: keyof typeof GamepadNames) => (state: RootState) =>
  state.input[gamepadName]
