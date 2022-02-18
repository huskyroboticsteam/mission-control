import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plannedPath: [
    { x: 0, y: 0, heading: 0 },
    { x: 1, y: 1, heading: Math.PI / 4 },
    { x: 2, y: 3, heading: Math.PI / 2 },
    { x: 5, y: 4, heading: Math.PI }
  ],
  lidarPoints: [
    { x: 3, y: 1 }
  ]
};

const planVizSlice = createSlice({
  name: "planVizSlice",
  initialState,
  reducers: {
    plannedPathReportReceived(state, action) {
      state.plannedPath = action.payload.points
    },

    lidarReportReceived(state, action) {
      state.lidarPoints = action.payload.points;
    }
  }
});

export const {
  lidarReportReceived,
  plannedPathReportReceived
} = planVizSlice.actions;

export const selectPlannedPath = state => state.planViz.plannedPath;
export const selectLidarPoints = state => state.planViz.lidarPoints;

export default planVizSlice.reducer;
