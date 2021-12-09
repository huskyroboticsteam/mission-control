import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  front: {
    isStreaming: false,
    frameData: null
  }
}

const camerasSlice = createSlice({
  name: "cameras",
  initialState,
  reducers: {
    cameraStreamOpenRequested(state, action) {
      const { cameraName } = action.payload;
      state[cameraName].isStreaming = true;
    },

    cameraStreamCloseRequested(state, action) {
      const { cameraName } = action.payload;
      state[cameraName].isStreaming = false;
    },

    cameraStreamDataReceived(state, action) {
      const { cameraName, frameData } = action.payload;
      state[cameraName].frameData = frameData;
    }
  }
});

export const { cameraStreamOpenRequested, cameraStreamCloseRequested, cameraStreamDataReceived } = camerasSlice.actions;
export const selectCameraIsStreamming = cameraName => state => state.cameras[cameraName].isStreaming;
export const selectCameraStreamFrameData = cameraName => state => state.cameras[cameraName].frameData;
export default camerasSlice.reducer;
