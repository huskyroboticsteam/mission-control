export enum ServoNames {
  microscope,
  syringe,
  cuvette,
  filter,
  soilBox,
  // Spectrometer Servo

  // Plunger Stepper (1):
  // Mixer Stepper
  // Lazy Susan Stepper
  // Spectrometer Lazy Susan Stepper
  // Mast Camera Steppers
}

export enum ServoType {
  Continuous,
  Positional,
}

// Microscope calibration servo is the only continuous

export const SERVOS: {
  [S in keyof typeof ServoNames]: {
    servoNum: number
    type: ServoType
    limits?: {hi: number; lo: number}
  }
} = {
  microscope: {
    servoNum: 0,
    type: ServoType.Continuous,
  },
  syringe: {
    servoNum: 1,
    type: ServoType.Positional,
    limits: {
      hi: 120, // redo once lever is fixed
      lo: 65,
    },
  },
  cuvette: {
    servoNum: 2,
    type: ServoType.Positional,
    limits: {
      hi: 160,
      lo: 85,
    },
  },
  filter: {
    servoNum: 3,
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
      hi: 110,
      lo: 40,
    },
    // Closed: 40
    // First open: 65
    // Second: 80
    // Third: 95+ // dbl check after soil sensor is positioned correctly
  },
}
