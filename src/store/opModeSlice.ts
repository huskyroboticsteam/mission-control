import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'
import type {OpMode} from '../constants/types.js'

type OpModeState = {
  readonly mode: OpMode
}

const initialState: OpModeState = {
  mode: 'teleoperation',
}

export const opModeSlice = createSlice({
  name: 'opMode',
  initialState,
  reducers: {
    requestOpMode: (state, action: PayloadAction<{mode: OpMode}>) => {
      state.mode = action.payload.mode
    },
  },
})

export const {requestOpMode} = opModeSlice.actions

export const selectOpMode = (state: RootState) => state.opMode.mode
