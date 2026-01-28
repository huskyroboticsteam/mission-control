import {createSlice} from '@reduxjs/toolkit'
import {Cameras} from '../constants/cameraConstants'

const initialState = Object.values(Cameras)
  .filter((c) => isNaN(Number(c)))
  .reduce(
    (state, camera) => ({
      ...state,
      [camera]: {
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
      const {camera} = action.payload
      state[camera].isStreaming = true
    },

    closeCameraStream(state, action) {
      const {camera} = action.payload
      state[camera].isStreaming = false
      state[camera].frameData = null
    },

    // No state needs to be updated here
    requestCameraFrame() {},

    cameraStreamDataReportReceived(state, action) {
      const {camera, frameData} = action.payload
      if (state[camera].isStreaming) state[camera].frameData = frameData
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
export const selectCameraIsStreaming = (camera) => (state) => state.cameras[camera].isStreaming
export const selectCameraStreamFrameData = (camera) => (state) => state.cameras[camera].frameData

export default camerasSlice.reducer
