export enum ServoNames {
  mast
}

export enum ServoType {
  Continuous,
  Positional,
}

export const SERVOS: {
  [S in keyof typeof ServoNames]: {
    servoNum: number
    type: ServoType
    limits?: {hi: number; lo: number}
    range?: {min: number; dead: number; max: number}
  }
} = {
  mast: {
    servoNum: 0,
    type: ServoType.Continuous,
  }
}
