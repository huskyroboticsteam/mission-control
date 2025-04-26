import {PayloadAction, createSlice} from '@reduxjs/toolkit'
import { DriveInputState } from './inputSlice.js'

type DrivePayload = {
  straight: number
  steer: number
}

type TankDrivePayload = {
  left: number
  right: number
}

type TurnInPlacePayload = {
  steer: number
}

type CrabDrivePayload = {
  crab: number
  steer: number
}

const initialState: DriveInputState = {
  straight: 0,
  steer: 0,
  left: 0,
  right: 0,
}

const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {
    requestDrive(state: DriveInputState, action: PayloadAction<DrivePayload>) {
      const {straight, steer} = action.payload

      state.straight = straight
      state.steer = steer
    },

    requestTankDrive(state: DriveInputState, action: PayloadAction<TankDrivePayload>) {
      const {left, right} = action.payload
      state.left = left
      state.right = right
    },

    requestTurnInPlaceDrive(state: DriveInputState, action: PayloadAction<TurnInPlacePayload>) {
      const {steer} = action.payload
      state.steer = steer
    },
  },
})

export const {requestDrive, requestTankDrive, requestTurnInPlaceDrive} = driveSlice.actions

export default driveSlice.reducer
