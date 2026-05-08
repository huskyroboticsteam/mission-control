import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {DriveMode} from '../constants/types.js'
import type {RootState} from './store.js'

type DriveState = {
  readonly driveMode: DriveMode
  readonly straight: number
  readonly steer: number
  readonly left: number
  readonly right: number
}

const initialState: DriveState = {
  driveMode: 'normal',
  straight: 0,
  steer: 0,
  left: 0,
  right: 0,
}

export const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {
    requestDriveMode: (state, action: PayloadAction<{mode: DriveMode}>) => {
      state.driveMode = action.payload.mode
    },

    requestDrive: (state, action: PayloadAction<{straight: number; steer: number}>) => {
      const {straight, steer} = action.payload
      state.straight = straight
      state.steer = steer
    },

    requestTankDrive: (state, action: PayloadAction<{left: number; right: number}>) => {
      const {left, right} = action.payload
      state.left = left
      state.right = right
    },
  },
})

export const {requestDriveMode, requestDrive, requestTankDrive} = driveSlice.actions

export const selectDriveMode = (state: RootState) => state.drive.driveMode
