import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  mode: 'normal',
  override: false,
}

const swerveDriveModeSlice = createSlice({
  name: 'swerveDriveMode',
  initialState,
  reducers: {
    requestSwerveDriveMode(state, action) {
      state.mode = action.payload.mode
      state.override = action.payload.override
    },
  },
})

export const {requestSwerveDriveMode} = swerveDriveModeSlice.actions

export const selectSwerveDriveMode = (state) => state.swerveDriveMode.mode
export const selectSwerveDriveOverride = (state) => state.swerveDriveMode.override

export default swerveDriveModeSlice.reducer
