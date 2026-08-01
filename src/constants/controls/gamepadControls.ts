import type {Axis, Button, InvertibleAxis} from 'react-gamepad'
import {requestAxisMultiplier} from '../../store/inputSlice.js'
import type {RootState, RoverStoreAPI} from '../../store/store.js'
import {JointNames} from '../jointConstants.js'
import type {GamepadNames} from '../gamepadConstants.js'
import type {DriveAxis} from '../types.js'

type GamepadControl = {
  readonly [name in Axis | Button]?: {
    readonly display?: string
    readonly description: string | ((store: RootState) => string)
    readonly onPress?: (store: RoverStoreAPI) => void
    readonly onRelease?: (store: RoverStoreAPI) => void
  }
}

export const DriveGamepadAxisControls: {[axis in DriveAxis]: {axis: InvertibleAxis}} = {
  straight: {
    axis: '-LeftStickY',
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
  [axis in JointNames]: {axis: InvertibleAxis} | {negative: Button; positive: Button}
} = {
  [JointNames.armBase]: {
    axis: '-LeftStickX',
  },
  [JointNames.shoulder]: {
    axis: 'LeftStickY',
  },
  [JointNames.elbow]: {
    axis: 'RightStickY',
  },
  [JointNames.forearm]: {
    axis: '-RightStickX',
  },
  [JointNames.wristPitch]: {
    negative: 'DPadDown',
    positive: 'DPadUp',
  },
  [JointNames.wristRoll]: {
    negative: 'DPadRight',
    positive: 'DPadLeft',
  },
  [JointNames.hand]: {
    negative: 'LT',
    positive: 'RT',
  },
  [JointNames.handActuator]: {
    negative: 'X',
    positive: 'Y',
  },
  // dummy, we don't actually want to axis this
  [JointNames.laser]: {
    negative: 'Start',
    positive: 'Start',
  },
}

export const DriveGamepadControls: GamepadControl = {
  Y: {
    description: (store) => '', //(store.drive.driveMode === 'normal' ? 'Tank' : 'Normal') + ' Drive',
    onPress: (store) => {
      // store.dispatch(
      //   requestDriveMode({mode: store.getState().drive.driveMode === 'normal' ? 'tank' : 'normal'})
      // )
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
    description: (store) => ''//(store.drive.driveMode === 'normal' ? 'Straight Drive' : 'Left Drive'),
  },
  RightStickX: {
    display: 'RStickX',
    description: (store) => ''//(store.drive.driveMode === 'normal' ? 'Turn' : ''),
  },
  RightStickY: {
    display: 'RStickY',
    description: (store) => ''//(store.drive.driveMode === 'normal' ? '' : 'Right Drive'),
  },
}

export const PeripheralGamepadControls: GamepadControl = {
  B: {
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

export const driveGamepadToAxes = Object.entries(DriveGamepadAxisControls).reduce<
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
