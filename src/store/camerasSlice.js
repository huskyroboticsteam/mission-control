import {createSlice} from '@reduxjs/toolkit'
import {CAMERAS} from '../constants/cameraConstants'

const initialState = Object.values(CAMERAS).reduce(
  (state, cam) => ({
    ...state,
    [cam.id]: {
      isStreaming: false,
      frameData: null,
    },
  }),
  {}
)

const camerasSlice = createSlice({
  name: 'cameras',
  initialState,
  reducers: {
    openCameraStream(state, action) {
      const {cameraID} = action.payload
      state[cameraID].isStreaming = true
    },

    closeCameraStream(state, action) {
      const {cameraID} = action.payload
      state[cameraID].isStreaming = false
      state[cameraID].frameData = null
    },

    // No state needs to be updated here
    requestCameraFrame() {},

    cameraStreamDataReportReceived(state, action) {
      const {cameraID, frameData} = action.payload
      if (state[cameraID].isStreaming) state[cameraID].frameData = frameData
    },
  },
})

export const {
  openCameraStream,
  closeCameraStream,
  cameraStreamDataReportReceived,
  requestCameraFrame,
} = camerasSlice.actions

export const selectAllCameraNames = (state) => Object.keys(state.cameras)
export const selectCameraIsStreaming = (cameraID) => (state) => state.cameras[cameraID].isStreaming
export const selectCameraStreamFrameData = (cameraID) => (state) =>
  state.cameras[cameraID].frameData

export default camerasSlice.reducer
