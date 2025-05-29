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
    range?: {min: number, dead: number, max: number}
  }
} = {
  microscope: {
    servoNum: 0,
    type: ServoType.Continuous,
    range: {
      min: 60,
      dead: 80,
      max: 100,
    }
  },
  syringe: {
    servoNum: 3,
    type: ServoType.Positional,
    limits: {
      hi: 110,
      lo: 60,
    },
  },
  cuvette: {
    servoNum: 2,
    type: ServoType.Positional,
    limits: {
      hi: 150,
      lo: 75,
    },
  },
  filter: {
    servoNum: 1,
    type: ServoType.Positional,
    limits: {
      // redo once they fix filter servo cxn
      hi: 0,
      lo: 180,
    },
  },
  soilBox: {
    servoNum: 4,
    type: ServoType.Positional,
    limits: {
      hi: 105,
      lo: 40,
    },
    // Closed: 40
    // First open: 65
    // Second: 80
    // Third: 95+ // dbl check after soil sensor is positioned correctly
  },
}
