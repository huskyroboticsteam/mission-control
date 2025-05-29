import {createSlice} from '@reduxjs/toolkit'
import {SERVOS, ServoType} from '../constants/servoConstants.js'

const initialState = Object.keys(SERVOS).reduce(
  (state, servoName) => ({
    ...state,
    [servoName]: {
      requestedPosition: null,
      currentPosition: null,
    },
  }),
  {}
)

const servoSlice = createSlice({
  name: 'servo',
  initialState,
  reducers: {
    requestServoPosition(state, action) {
      const {servoName, position} = action.payload
      if (SERVOS[servoName].type !== ServoType.Positional) {
        // throw Error("requestServoPosition on a non-positional Servo!")
      }

      let clampedPos = position
      if (SERVOS[servoName].limits) {
        const limits = SERVOS[servoName].limits!
        clampedPos = Math.min(Math.max(position, limits.lo), limits.hi)
      }
      const servo = state[servoName]
      servo.requestedPosition = clampedPos
    },

    servoPositionReportReceived(state, action) {
      const {servoName, position} = action.payload
      const servo = state[servoName]
      servo.currentPosition = position
      return state
    },
  },
})

export const {requestServoPosition, servoPositionReportReceived} = servoSlice.actions

export const selectAllServoNames = (state) => Object.keys(state.servo)
export const selectServoCurrentPosition = (servoName) => (state) =>
  state.servo[servoName].currentPosition

export default servoSlice.reducer
