import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'

type EmergencyStopState = {
  readonly stopped: boolean
}

const initialState: EmergencyStopState = {
  stopped: false,
}

export const emergencyStopSlice = createSlice({
  name: 'emergencyStop',
  initialState,
  reducers: {
    requestStop: (state, action: PayloadAction<{stop: boolean}>) => {
      state.stopped = action.payload.stop
    },
  },
})

export const {requestStop} = emergencyStopSlice.actions

export const selectIsStopped = (state: RootState) => state.emergencyStop.stopped
