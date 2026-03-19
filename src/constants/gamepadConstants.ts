import type {Axis, Button} from 'react-gamepad'
import {GamepadApiWrapper} from 'virtual-gamepad-lib/GamepadApiWrapper'
import {GamepadEmulator} from 'virtual-gamepad-lib/GamepadEmulator'

export enum GamepadNames {
  driveGamepad = 'driveGamepad',
  peripheralGamepad = 'peripheralGamepad',
}

export const Gamepads: GamepadNames[] = [GamepadNames.driveGamepad, GamepadNames.peripheralGamepad]

export const GamepadIndex: {[G in keyof typeof GamepadNames]: number} = {
  driveGamepad: 0,
  peripheralGamepad: 1,
}

export type GamepadState = {
  readonly isConnected: boolean
} & {
  readonly [B in Button]: boolean
} & {
  readonly [A in Axis]: number
}

export const GamepadInitialState: GamepadState = {
  isConnected: false,
  A: false,
  B: false,
  X: false,
  Y: false,
  Start: false,
  Back: false,
  LT: false,
  RT: false,
  LB: false,
  RB: false,
  LS: false,
  RS: false,
  DPadUp: false,
  DPadDown: false,
  DPadLeft: false,
  DPadRight: false,
  LeftStickX: 0,
  LeftStickY: 0,
  RightStickX: 0,
  RightStickY: 0,
  LeftTrigger: 0,
  RightTrigger: 0,
}

export const gamepadEmulator = new GamepadEmulator(0.1)
export const gamepadApiWrapper = new GamepadApiWrapper({
  buttonConfigs: [],
  updateDelay: 0,
  axisDeadZone: 0.05,
})

export const Axes: Axis[] = [
  'LeftStickX',
  'LeftStickY',
  'RightStickX',
  'RightStickY',
  'LeftTrigger',
  'RightTrigger',
]
export const Buttons: Button[] = [
  'A',
  'B',
  'X',
  'Y',
  'Start',
  'Back',
  'LT',
  'RT',
  'LB',
  'RB',
  'LS',
  'RS',
  'DPadUp',
  'DPadDown',
  'DPadLeft',
  'DPadRight',
]

export const isAxis = (value: string): value is Axis => (Axes as readonly string[]).includes(value)
export const isButton = (value: string): value is Button =>
  (Buttons as readonly string[]).includes(value)
