import type {Axis, Button} from 'react-gamepad'

export enum GamepadNames {
  driveGamepad,
  peripheralGamepad,
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
