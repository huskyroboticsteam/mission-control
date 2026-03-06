export enum ServoNames {
  mast,
}

export enum ServoType {
  Continuous,
  Positional,
}

export const Servos: {
  [S in keyof typeof ServoNames]: {
    servoNum: number
    type: ServoType
    limits?: {hi: number; lo: number}
    range?: {min: number; dead: number; max: number}
  }
} = {
  mast: {
    servoNum: 1,
    type: ServoType.Positional,
    range: {
      min: 60,
      dead: 90,
      max: 120,
    },
  },
}
