import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {Servos, ServoType, ServoNames} from '../constants/servoConstants.js'
import type {RootState} from './store.js'

type ServoState = {
  readonly [S in keyof typeof ServoNames]: {
    readonly requestedPosition: number | null
    readonly currentPosition: number | null
  }
}

const initialState: ServoState = Object.keys(Servos).reduce<ServoState>(
  (state, servo) => ({
    ...state,
    [servo]: {
      requestedPosition: null,
      currentPosition: null,
    },
  }),
  {} as ServoState
)

export const servoSlice = createSlice({
  name: 'servo',
  initialState,
  reducers: {
    requestServoPosition: (
      state,
      action: PayloadAction<{servoName: keyof typeof ServoNames; position: number}>
    ) => {
      const {servoName, position} = action.payload
      if (Servos[servoName].type !== ServoType.Positional) {
        throw Error('requestServoPosition on a non-positional Servo!')
      }

      const limits = Servos[servoName].limits!
      const clampedPos = Math.min(Math.max(position, limits.lo), limits.hi)
      state[servoName].requestedPosition = clampedPos
    },

    servoPositionReportReceived: (
      state,
      action: PayloadAction<{servoName: keyof typeof ServoNames; position: number}>
    ) => {
      const {servoName, position} = action.payload
      state[servoName].currentPosition = position
    },
  },
})

export const {requestServoPosition, servoPositionReportReceived} = servoSlice.actions

export const selectServoCurrentPosition =
  (servoName: keyof typeof ServoNames) => (state: RootState) =>
    state.servo[servoName].currentPosition
