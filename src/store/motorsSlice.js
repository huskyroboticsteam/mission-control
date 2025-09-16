import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  motorsEnabled: false,
}

const motorSlice = createSlice({
  name: 'motors',
  initialState,
  reducers: {
    enableMotors(state, action) {
      const {enabled} = action.payload
      state.motorsEnabled = enabled
    },
  },
})

export const {enableMotors} = motorSlice.actions

export const selectMotorsAreEnabled = (state) => state.motors.motorsEnabled

export default motorSlice.reducer
