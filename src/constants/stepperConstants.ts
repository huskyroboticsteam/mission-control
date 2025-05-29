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
    stepperNum: 6,
    hold: true,
  },
  lock: {
    stepperNum: 2,
  },
  lazySusan: {
    stepperNum: 3,
  },
  judges: {
    stepperNum: 5,
  },
  mast: {
    stepperNum: 1,
  },
}
