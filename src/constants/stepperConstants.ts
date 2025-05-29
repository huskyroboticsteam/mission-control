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
    stepperNum: 4,
    hold: true,
  },
  lock: {
    stepperNum: 1,
  },
  lazySusan: {
    stepperNum: 6,
  },
  judges: {
    stepperNum: 5,
  },
  mast: {
    stepperNum: 2,
  },
}
