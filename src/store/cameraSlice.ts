import {createAction, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {CameraNames} from '../constants/cameraConstants.js'
import type {RootState} from './store.js'

type CameraState = {
  readonly [C in keyof typeof CameraNames]: {
    readonly isStreaming: boolean
    readonly frameData: number[][] | null
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

export const cameraSlice = createSlice({
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
      action: PayloadAction<{camera: keyof typeof CameraNames; frameData: number[][] | null}>
    ) => {
      const {camera, frameData} = action.payload
      if (state[camera].isStreaming) {
        state[camera].frameData = frameData
      }
    },
  },
})

export const {openCameraStream, closeCameraStream, cameraStreamDataReportReceived} =
  cameraSlice.actions

// Handled by camera middleware.
// Typescript expands the action type to string, so we have to define the name twice
export const requestCameraFrame = createAction<
  {camera: keyof typeof CameraNames},
  'camera/requestCameraFrame'
>('camera/requestCameraFrame')

export const selectAllCameraNames = (state: RootState) => Object.keys(state.camera)
export const selectCameraIsStreaming = (camera: keyof typeof CameraNames) => (state: RootState) =>
  state.camera[camera].isStreaming
export const selectCameraStreamFrameData =
  (camera: keyof typeof CameraNames) => (state: RootState) =>
    state.camera[camera].frameData
