import { createSlice } from "@reduxjs/toolkit"

const cameraNames = ["front", "rear", "upperArm"];

const initialState = cameraNames.reduce((state, cameraName) => ({
  ...state,
  [cameraName]: {
    isStreaming: false,
    frameData: null
  }
}), {});

const camerasSlice = createSlice({
  name: "cameras",
  initialState,
  reducers: {
    openCameraStream(state, action) {
      const { cameraName } = action.payload;
      state[cameraName].isStreaming = true;
    },

    closeCameraStream(state, action) {
      const { cameraName } = action.payload;
      state[cameraName].isStreaming = false;
      state[cameraName].frameData = null;
    },

    cameraStreamDataReportReceived(state, action) {
      const { cameraName, frameData } = action.payload;
      if (state[cameraName].isStreaming)
        state[cameraName].frameData = frameData;
    }
  }
});

export const {
  openCameraStream,
  closeCameraStream,
  cameraStreamDataReportReceived
} = camerasSlice.actions;

export const selectCameraIsStreamming = cameraName => state => state.cameras[cameraName].isStreaming;
export const selectCameraStreamFrameData = cameraName => state => state.cameras[cameraName].frameData;

export default camerasSlice.reducer;
