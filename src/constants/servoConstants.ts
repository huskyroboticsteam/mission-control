export enum ServoNames {
  microscope,
  syringe,
  cuvette,
  filter,
  soilBox,
  // Spectrometer Servo

  // Plunger Stepper (1):
  // Cuvette Lock Stepper
  // Lazy Susan Stepper
  // Judge's Sample Stepper
  // Mast Camera Steppers
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
  microscope: {
    servoNum: 5,
    type: ServoType.Continuous,
    range: {
      min: 60,
      dead: 90,
      max: 120,
    },
  },
  syringe: {
    servoNum: 8,
    type: ServoType.Positional,
    limits: {
      hi: 110,
      lo: 60,
    },
  },
  cuvette: {
    servoNum: 4,
    type: ServoType.Positional,
    limits: {
      hi: 160,
      lo: 82,
    },
  },
  filter: {
    servoNum: 8,
    type: ServoType.Positional,
    limits: {
      // redo once they fix filter servo cxn
      hi: 0,
      lo: 180,
    },
  },
  soilBox: {
    servoNum: 6,
    type: ServoType.Positional,
    limits: {
      hi: 50,
      lo: 0,
    },
    // Closed: 50
    // First open: 35
    // Second: 18
    // Third: 0
  },
}
