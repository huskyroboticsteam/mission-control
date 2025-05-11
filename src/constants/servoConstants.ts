export enum ServoNames {
  syringeServo,
  soilBoxServo,
  microscopeServo,
  cuvetteServo,
  filterServo,
  // Spectrometer Servo

  // Plunger Stepper (1):
  // Mixer Stepper
  // Lazy Susan Stepper
  // Spectrometer Lazy Susan Stepper
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
  microscopeServo: {
    servoNum: 0,
    type: ServoType.Continuous,
  },
  syringeServo: {
    servoNum: 1,
    type: ServoType.Positional,
    limits: {
      hi: 120,
      lo: 35,
    },
  },
  cuvetteServo: {
    servoNum: 2,
    type: ServoType.Positional,
    limits: {
      hi: 90,
      lo: 80,
    },
  },
  filterServo: {
    servoNum: 3,
    type: ServoType.Positional,
    limits: {
      hi: 0,
      lo: 180,
    },
  },
  soilBoxServo: {
    servoNum: 4,
    type: ServoType.Positional,
    limits: {
      hi: 110,
      lo: 0,
    },
    // Closed: 0
    // First open: 45
    // Second: 80
    // Third: 80+
  },
}
