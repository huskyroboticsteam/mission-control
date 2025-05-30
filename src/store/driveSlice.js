import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  straight: 0,
  steer: 0,
  left: 0,
  right: 0,
}

const driveSlice = createSlice({
  name: 'drive',
  initialState,
  reducers: {
    requestDrive(state, action) {
      const {straight, steer} = action.payload
      state.straight = straight
      state.steer = steer
    },

    requestTankDrive(state, action) {
      const {left, right} = action.payload
      state.left = left
      state.right = right
    },
  },
})

export const {requestDrive, requestTankDrive} = driveSlice.actions

export default driveSlice.reducer
