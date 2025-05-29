import {createSlice} from '@reduxjs/toolkit'
import {STEPPERS} from '../constants/stepperConstants.js'

const initialState = Object.keys(STEPPERS).reduce(
  (state, stepperName) => ({
    ...state,
    [stepperName]: {
      angle: null,
    },
  }),
  {}
)

const stepperSlice = createSlice({
  name: 'tepper',
  initialState,
  reducers: {
    requestStepperTurnAngle(state, action) {
      const {stepperName, angle} = action.payload
      state[stepperName].angle = angle
    },
  },
})

export const {requestStepperTurnAngle} = stepperSlice.actions

export const selectAllStepperNames = (state) => Object.keys(state.servo)

export default stepperSlice.reducer
