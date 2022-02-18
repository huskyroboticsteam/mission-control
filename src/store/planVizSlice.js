import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plannedPath: [],
  lidarPoints: []
};

const planVizSlice = createSlice({
  name: "planVizSlice",
  initialState,
  reducers: {
    plannedPathReportReceived(state, action) {
      state.plannedPath = action.payload.path
    },

    lidarReportReceived(state, action) {
      state.lidarPoints = action.payload.points;
    }
  }
});

export const {
  plannedPathReportReceived,
  lidarReportReceived
} = planVizSlice.actions;

export const selectPlannedPath = state => state.planViz.plannedPath;
export const selectLidarPoints = state => state.planViz.lidarPoints;

export default planVizSlice.reducer;
