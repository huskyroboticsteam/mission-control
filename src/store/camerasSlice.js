import {createSlice} from '@reduxjs/toolkit'

const cameraNames = ["mast", "hand", "wrist"];
const cameraNameToID = {"mast": 40, "hand": 20, "wrist": 30};

const initialState = cameraNames.reduce((state, cameraName) => ({
  ...state,
  [cameraNameToID[cameraName]]: {
    isStreaming: false,
    frameData: null
  }
}), {});

const camerasSlice = createSlice({
  name: 'cameras',
  initialState,
  reducers: {
    openCameraStream(state, action) {
      const { cameraID } = action.payload;
      state[cameraID].isStreaming = true;
    },

    closeCameraStream(state, action) {
      const { cameraID } = action.payload;
      state[cameraID].isStreaming = false;
      state[cameraID].frameData = null;
    },

    requestCameraFrame() {},

    cameraStreamDataReportReceived(state, action) {
      const { cameraID, frameData } = action.payload;
      if (state[cameraID].isStreaming)
        state[cameraID].frameData = frameData;
    }
  }
});

export const {
  openCameraStream,
  closeCameraStream,
  cameraStreamDataReportReceived,
  requestCameraFrame,
} = camerasSlice.actions

export const selectAllCameraNames = state => Object.keys(state.cameras);
export const selectCameraIsStreamming = cameraID => state => state.cameras[cameraID].isStreaming;
export const selectCameraStreamFrameData = cameraID => state => state.cameras[cameraID].frameData;

export default camerasSlice.reducer
