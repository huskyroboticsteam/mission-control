import type {JointNames} from './jointConstants.js'

// Collection of miscellaneous types
export type OpMode = 'teleoperation' | 'autonomous'
export type Peripheral = 'arm' | 'science' | 'none' | null
export type DriveMode = 'normal' | 'tank'
export type DriveAxis = 'straight' | 'steer' | 'left' | 'right'
export type InputAxis = JointNames | DriveAxis
