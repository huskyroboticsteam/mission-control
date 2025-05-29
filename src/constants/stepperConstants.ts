export enum StepperNames {
  plunger,
  judges,
  mast,
  lock,
  lazySusan,
}

export const STEPPERS: {
  [S in keyof typeof StepperNames]: {
    stepperNum: number
    hold?: boolean
  }
} = {
  plunger: {
    stepperNum: 0,
    hold: true,
  },
  judges: {
    stepperNum: 0,
    hold: false,
  },
  mast: {
    stepperNum: 0,
    hold: false,
  },
  lock: {
    stepperNum: 0,
    hold: false,
  },
  lazySusan: {
    stepperNum: 0,
    hold: false,
  },
}
