export enum ServoNames {
  syringeServo,
  soilBoxServo,
  microscopeServo,
  cuvetteServo
  // Plunger Stepper
  // Mixer Stepper
  // Lazy Susan Stepper
  // Spectrometer Lazy Susan Stepper
}

export enum ServoType {
  Continuous,
  Positional
}

// Microscope calibration servo is the only continuous

export const SERVOS: {[S in keyof typeof ServoNames]: {type: ServoType}} = {
  syringeServo: {
    type: ServoType.Positional
  }
}