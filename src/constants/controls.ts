import type {Axis, Button} from 'react-gamepad'
import {requestDriveMode} from '../store/driveSlice.js'
import {requestStop} from '../store/emergencyStopSlice.js'
import {requestAxisMultiplier} from '../store/inputSlice.js'
import type {RootState, RoverStoreAPI} from '../store/store.js'
import {JointNames} from './jointConstants.js'
import type {GamepadNames} from './gamepadConstants.js'

type KeyboardControl = {
  readonly [key: string]: {
    readonly display?: string
    readonly description: string | ((store: RootState) => string)
    readonly onPress?: (store: RoverStoreAPI) => void
    readonly onRelease?: (store: RoverStoreAPI) => void
  }
}

type GamepadControl = {
  readonly [name in Axis | Button]?: {
    readonly display?: string
    readonly description: string | ((store: RootState) => string)
    readonly onPress?: (store: RoverStoreAPI) => void
    readonly onRelease?: (store: RoverStoreAPI) => void
  }
}

// Mostly for displays and inputs that aren't mapping directly to a joint movement
// See https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values for pressedKeys strings
// Note: We convert all keys to all caps to let us use shift as a modifier
export const KeyboardControls: KeyboardControl = {
  ' ': {
    display: 'Space',
    description: 'Toggle EStop',
    onPress: (store) => {
      store.dispatch(requestStop({stop: !store.getState().emergencyStop.stopped}))
    },
  },
  SHIFT: {
    display: 'Shift',
    description: 'Slow mode',
    onPress: (store) => {
      store.dispatch(requestAxisMultiplier({multiplier: 0.5}))
    },
    onRelease: (store) => {
      store.dispatch(requestAxisMultiplier({multiplier: 1.0}))
    },
  },
  Y: {
    description: (store) => (store.drive.driveMode === 'normal' ? 'Tank' : 'Normal') + ' Drive',
    onPress: (store) => {
      store.dispatch(
        requestDriveMode({mode: store.getState().drive.driveMode === 'normal' ? 'tank' : 'normal'})
      )
    },
  },
  ARROWUP: {
    display: 'Up',
    description: (store) =>
      store.drive.driveMode === 'normal' ? 'Drive Forward' : 'Right Backward',
  },
  ARROWDOWN: {
    display: 'Down',
    description: (store) =>
      store.drive.driveMode === 'normal' ? 'Drive Backward' : 'Left Backward',
  },
  ARROWLEFT: {
    display: 'Left',
    description: (store) => (store.drive.driveMode === 'normal' ? 'Turn Left' : 'Left Forward'),
  },
  ARROWRIGHT: {
    display: 'Right',
    description: (store) => (store.drive.driveMode === 'normal' ? 'Turn Right' : 'Right Forward'),
  },
  A: {description: 'Arm Base Left'},
  D: {description: 'Arm Base Right'},
  W: {description: 'Shoulder Forwards'},
  S: {description: 'Shoulder Backwards'},
  T: {description: 'Elbow Up'},
  G: {description: 'Elbow Down'},
  F: {description: 'Forearm Left'},
  H: {description: 'Forearm Right'},
  I: {description: 'Wrist Pitch Up'},
  K: {description: 'Wrist Pitch Down'},
  J: {description: 'Wrist Roll Left'},
  L: {description: 'Wrist Roll Right'},
  U: {description: 'Hand Close'},
  O: {description: 'Hand Open'},
  '.': {description: 'Actuator Out'},
}

export const DriveGamepadControls: GamepadControl = {
  Y: {
    description: (store) => (store.drive.driveMode === 'normal' ? 'Tank' : 'Normal') + ' Drive',
    onPress: (store) => {
      store.dispatch(
        requestDriveMode({mode: store.getState().drive.driveMode === 'normal' ? 'tank' : 'normal'})
      )
    },
  },
  LB: {
    display: 'LBumper',
    description: 'Slow Mode',
    onPress: (store) => {
      store.dispatch(requestAxisMultiplier({multiplier: 0.5}))
    },
    onRelease: (store) => {
      store.dispatch(requestAxisMultiplier({multiplier: 1.0}))
    },
  },
  LeftStickY: {
    display: 'LStickY',
    description: (store) => (store.drive.driveMode === 'normal' ? 'Straight Drive' : 'Left Drive'),
  },
  RightStickX: {
    display: 'RStickX',
    description: (store) => (store.drive.driveMode === 'normal' ? 'Turn' : ''),
  },
  RightStickY: {
    display: 'RStickY',
    description: (store) => (store.drive.driveMode === 'normal' ? '' : 'Right Drive'),
  },
}

export const PeripheralGamepadControls: GamepadControl = {
  Y: {description: 'Actuator Out'},
  LT: {
    display: 'LTrigger',
    description: 'Hand Close',
  },
  RT: {
    display: 'RTrigger',
    description: 'Hand Open',
  },
  LeftStickX: {
    display: 'LStickX',
    description: 'Arm Base',
  },
  LeftStickY: {
    display: 'LStickY',
    description: 'Shoulder',
  },
  RightStickY: {
    display: 'RStickY',
    description: 'Elbow',
  },
  RightStickX: {
    display: 'RStickX',
    description: 'Forearm',
  },
  DPadUp: {description: 'Wrist Pitch Up'},
  DPadDown: {description: 'Wrist Pitch Down'},
  DPadLeft: {description: 'Wrist Roll Left'},
  DPadRight: {description: 'Wrist Roll Right'},
}

export const GamepadControls: {[G in GamepadNames]: GamepadControl} = {
  driveGamepad: DriveGamepadControls,
  peripheralGamepad: PeripheralGamepadControls,
}

export type DriveAxis = 'straight' | 'steer' | 'left' | 'right'
export type InputAxis = JointNames | DriveAxis

// Axis mappings
export const AxisKeyboardControls: {[axis in InputAxis]: {negative: string; positive: string}} = {
  straight: {
    negative: 'ARROWDOWN',
    positive: 'ARROWUP',
  },
  steer: {
    negative: 'ARROWLEFT',
    positive: 'ARROWRIGHT',
  },
  left: {
    negative: 'ARROWDOWN',
    positive: 'ARROWLEFT',
  },
  right: {
    negative: 'ARROWUP',
    positive: 'ARROWRIGHT',
  },
  [JointNames.armBase]: {
    negative: 'D',
    positive: 'A',
  },
  [JointNames.shoulder]: {
    negative: 'S',
    positive: 'W',
  },
  [JointNames.elbow]: {
    negative: 'G',
    positive: 'T',
  },
  [JointNames.forearm]: {
    negative: 'F',
    positive: 'H',
  },
  [JointNames.wristPitch]: {
    negative: 'K',
    positive: 'I',
  },
  [JointNames.wristRoll]: {
    negative: 'J',
    positive: 'L',
  },
  [JointNames.hand]: {
    negative: 'U',
    positive: 'O',
  },
  [JointNames.handActuator]: {
    negative: ',',
    positive: '.',
  },
  // [JointNames.ikUp]: {
  //   negative: '',
  //   positive: '',
  // },
  // [JointNames.ikForward]: {
  //   negative: '',
  //   positive: '',
  // },
}

export const AxisDriveGamepadControls: {[axis in DriveAxis]: {axis: Axis}} = {
  straight: {
    axis: 'LeftStickY',
  },
  steer: {
    axis: 'RightStickX',
  },
  left: {
    axis: 'LeftStickY',
  },
  right: {
    axis: 'RightStickY',
  },
}

export const AxisPeripheralGamepadControls: {
  [axis in JointNames]: {axis: Axis} | {negative: Button; positive: Button}
} = {
  [JointNames.armBase]: {
    axis: 'LeftStickX',
  },
  [JointNames.shoulder]: {
    axis: 'LeftStickY',
  },
  [JointNames.elbow]: {
    axis: 'RightStickY',
  },
  [JointNames.forearm]: {
    axis: 'RightStickX',
  },
  [JointNames.wristPitch]: {
    negative: 'DPadDown',
    positive: 'DPadUp',
  },
  [JointNames.wristRoll]: {
    negative: 'DPadLeft',
    positive: 'DPadRight',
  },
  [JointNames.hand]: {
    negative: 'LT',
    positive: 'RT',
  },
  [JointNames.handActuator]: {
    negative: 'X',
    positive: 'Y',
  },
  // [JointNames.ikUp]: {
  //   axis: 'RightStickY',
  // },
  // [JointNames.ikForward]: {
  //   axis: 'LeftStickY',
  // },
}

// For reverse lookup
export const keyToAxes = Object.entries(AxisKeyboardControls).reduce<Record<string, string[]>>(
  (map, [axis, {negative, positive}]) => {
    map[negative] = [...(map[negative] ?? []), axis]
    map[positive] = [...(map[positive] ?? []), axis]
    return map
  },
  {}
)

export const driveGamepadToAxes = Object.entries(AxisDriveGamepadControls).reduce<
  Record<string, string[]>
>((map, [axis, {axis: gamepadAxis}]) => {
  map[gamepadAxis] = [...(map[gamepadAxis] ?? []), axis]
  return map
}, {})

export const peripheralGamepadToAxes = Object.entries(AxisPeripheralGamepadControls).reduce<
  Record<string, string[]>
>((map, [axis, value]) => {
  if ('axis' in value) {
    map[value.axis] = [...(map[value.axis] ?? []), axis]
  } else {
    map[value.negative] = [...(map[value.negative] ?? []), axis]
    map[value.positive] = [...(map[value.positive] ?? []), axis]
  }
  return map
}, {})
