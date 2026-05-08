import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'

type MotorState = {
  readonly motorsEnabled: boolean
}

const initialState: MotorState = {
  motorsEnabled: false,
}

export const motorSlice = createSlice({
  name: 'motor',
  initialState,
  reducers: {
    enableMotors: (state, action: PayloadAction<{enabled: boolean}>) => {
      state.motorsEnabled = action.payload.enabled
    },
  },
})

export const {enableMotors} = motorSlice.actions

export const selectMotorsAreEnabled = (state: RootState) => state.motor.motorsEnabled
