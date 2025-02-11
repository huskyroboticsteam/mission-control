import { createSlice } from "@reduxjs/toolkit"

const cameraNames = ["mast", "hand", "wrist", "pano", "drill"];

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

    requestCameraFrame(state, action) {
      const { cameraName } = action.payload;
      const video = document.querySelector(`#${cameraName}-player`);

      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      let link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 1);
      let time = new Date().toISOString().replaceAll(':', '_').substring(0, 19);
      link.download = `${cameraName}-${time}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
  cameraStreamDataReportReceived,
  requestCameraFrame
} = camerasSlice.actions;

export const selectAllCameraNames = state => Object.keys(state.cameras);
export const selectCameraIsStreamming = cameraName => state => state.cameras[cameraName].isStreaming;
export const selectCameraStreamFrameData = cameraName => state => state.cameras[cameraName].frameData;

export default camerasSlice.reducer;
