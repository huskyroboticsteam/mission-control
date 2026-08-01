import {requestAxisMultiplier} from '../../store/inputSlice.js'
import type {RootState, RoverStoreAPI} from '../../store/store.js'
import {JointNames} from '../jointConstants.js'
import type {InputAxis} from '../types.js'

type KeyboardControl = {
  readonly [key: string]: {
    readonly display?: string
    readonly description: string | ((store: RootState) => string)
    readonly onPress?: (store: RoverStoreAPI) => void
    readonly onRelease?: (store: RoverStoreAPI) => void
  }
}

export const KeyboardAxisControls: {[axis in InputAxis]: {negative: string; positive: string}} = {
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
  [JointNames.laser]: {
    negative: '',
    positive: '',
  },
}

// Mostly for display and button inputs that aren't mapping directly to a joint movement
// See https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values for pressedKeys strings
// Note: We convert all keys to all caps to let us use shift as a modifier
export const KeyboardControls: KeyboardControl = {
  ' ': {
    display: 'Space',
    description: 'Toggle EStop',
    onPress: (store) => {
      // store.dispatch(requestStop({stop: !store.getState().emergencyStop.stopped}))
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
    description: (store) => '', //(store.drive.driveMode === 'normal' ? 'Tank' : 'Normal') + ' Drive',
    onPress: (store) => {
      // store.dispatch(
      //   requestDriveMode({mode: store.getState().drive.driveMode === 'normal' ? 'tank' : 'normal'})
      // )
    },
  },
  ARROWUP: {
    display: 'Up',
    description: (store) => ''
      // store.drive.driveMode === 'normal' ? 'Drive Forward' : 'Right Backward',
  },
  ARROWDOWN: {
    display: 'Down',
    description: (store) => ''
      // store.drive.driveMode === 'normal' ? 'Drive Backward' : 'Left Backward',
  },
  ARROWLEFT: {
    display: 'Left',
    description: (store) => '' //(store.drive.driveMode === 'normal' ? 'Turn Left' : 'Left Forward'),
  },
  ARROWRIGHT: {
    display: 'Right',
    description: (store) => '' //(store.drive.driveMode === 'normal' ? 'Turn Right' : 'Right Forward'),
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
  ';': {
    description: 'Toggle Laser',
    onPress: (store) => {
      // store.dispatch(
      //   requestJointPower({
      //     jointName: 'laser',
      //     power: store.getState().joint.laser.requestedPower === 0 ? 1 : 0,
      //   })
      // )
    },
  },
}

const entries = Object.entries(KeyboardAxisControls) as [
  InputAxis,
  {
    negative: string
    positive: string
  },
][]

// For reverse lookup
export const keyToAxes = entries.reduce<Record<string, InputAxis[]>>(
  (map, [axis, {negative, positive}]) => {
    map[negative] = [...(map[negative] ?? []), axis]
    map[positive] = [...(map[positive] ?? []), axis]
    return map
  },
  {}
)
