import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  stopped: false
}

const emergencyStopSlice = createSlice({
  name: "emergencyStop",
  initialState,
  reducers: {
    requestStop(state, action) {
      const { stop } = action.payload;
      state.stopped = stop;
    }
  }
});

export const { requestStop } = emergencyStopSlice.actions;

export const selectIsStopped = state => state.emergencyStop.stopped;

export default emergencyStopSlice.reducer;
