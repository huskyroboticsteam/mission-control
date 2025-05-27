export enum StepperNames {
  plunger,
  cuvetteLock,
  lazySusan,
  judgesSample,
  mastCamera,
}

export const STEPPERS: {
  [S in keyof typeof StepperNames]: {
    stepperNum: number
    hold?: boolean
  }
} = {
  plunger: {
    stepperNum: 6,
    hold: true
  },
  cuvetteLock: {
    stepperNum: 2
  },
  lazySusan: {
    stepperNum: 3
  },
  judgesSample: {
    stepperNum: 5
  },
  mastCamera: {
    stepperNum: 1
  }
}