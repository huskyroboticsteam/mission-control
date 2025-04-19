import {PayloadAction, createSlice} from '@reduxjs/toolkit'

type DriveState = {
  straight: number
  crab: number
  steer: number
  left: number
  right: number
}

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

const initialState: DriveState = {
  straight: 0,
  crab: 0,
  steer: 0,
  left: 0,
  right: 0,
}

const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {
    requestDrive(state: DriveState, action: PayloadAction<DrivePayload>) {
      const {straight, steer} = action.payload

      state.straight = straight
      state.steer = steer
    },

    requestTankDrive(state: DriveState, action: PayloadAction<TankDrivePayload>) {
      const {left, right} = action.payload
      state.left = left
      state.right = right
    },

    requestTurnInPlaceDrive(state: DriveState, action: PayloadAction<TurnInPlacePayload>) {
      const {steer} = action.payload
      state.steer = steer
    },

    requestCrabDrive(state: DriveState, action: PayloadAction<CrabDrivePayload>) {
      const {crab, steer} = action.payload
      state.crab = crab
      state.steer = steer
    },
  },
})

export const {requestDrive, requestTankDrive, requestTurnInPlaceDrive, requestCrabDrive} =
  driveSlice.actions

export default driveSlice.reducer
