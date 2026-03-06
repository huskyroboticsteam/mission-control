import {createAction, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {CameraNames} from '../constants/cameraConstants.js'
import type {RootState} from './store.js'

type CameraState = {
  readonly [C in keyof typeof CameraNames]: {
    readonly isStreaming: boolean
    readonly frameData: string | null
  }
}

const initialState: CameraState = Object.keys(CameraNames).reduce<CameraState>(
  (state, camera) => ({
    ...state,
    [camera]: {
      isStreaming: false,
      frameData: null,
    },
  }),
  {} as CameraState
)

export const camerasSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    openCameraStream: (state, action: PayloadAction<{camera: keyof typeof CameraNames}>) => {
      state[action.payload.camera].isStreaming = true
    },

    closeCameraStream: (state, action: PayloadAction<{camera: keyof typeof CameraNames}>) => {
      const {camera} = action.payload
      state[camera].isStreaming = false
      state[camera].frameData = null
    },

    cameraStreamDataReportReceived: (
      state,
      action: PayloadAction<{camera: keyof typeof CameraNames; frameData: string}>
    ) => {
      const {camera, frameData} = action.payload
      if (state[camera].isStreaming) {
        state[camera].frameData = frameData
      }
    },
  },
})

export const {openCameraStream, closeCameraStream, cameraStreamDataReportReceived} =
  camerasSlice.actions

// Handled by camera middleware.
export const requestCameraFrame = createAction('camera/requestCameraFrame')

export const selectAllCameraNames = (state: RootState) => Object.keys(state.camera)
export const selectCameraIsStreaming = (camera: keyof typeof CameraNames) => (state: RootState) =>
  state.camera[camera].isStreaming
export const selectCameraStreamFrameData =
  (camera: keyof typeof CameraNames) => (state: RootState) =>
    state.camera[camera].frameData
