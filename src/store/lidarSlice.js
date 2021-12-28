import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  points: []
};

const lidarSlice = createSlice({
  name: "lidar",
  initialState,
  reducers: {
    lidarReportReceived(state, action) {
      state.points = action.payload.points;
    }
  }
});

export const { lidarReportReceived } = lidarSlice.actions;

export const selectLidarPoints = state => state.lidar.points;

export default lidarSlice.reducer;
