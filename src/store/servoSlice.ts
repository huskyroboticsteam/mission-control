import {createSlice} from '@reduxjs/toolkit'
import {SERVOS, ServoNames} from '../constants/servoConstants.js'

const initialState = (Object.keys(SERVOS) as ServoNames).reduce(
  (state, servo) => ({
    ...state,
    [servo]: {
      type: SERVOS[servo as keyof typeof SERVOS].type,
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

    }
  },
})
