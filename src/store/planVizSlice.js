import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plannedPath: [],
  poseConfidenceEllipse: {
    radiusX: 0,
    radiusY: 0,
    rotation: 0
  },
  lidarPoints: []
};

const planVizSlice = createSlice({
  name: "planVizSlice",
  initialState,
  reducers: {
    plannedPathReportReceived(state, action) {
      state.plannedPath = action.payload.path;
    },

    poseConfidenceReportReceived(state, action) {
      const { radiusX, radiusY, rotation } = action.payload;
      state.poseConfidenceEllipse = {
        radiusX,
        radiusY,
        rotation
      };
    },

    lidarReportReceived(state, action) {
      state.lidarPoints = action.payload.points;
    }
  }
});

export const {
  plannedPathReportReceived,
  poseConfidenceReportReceived,
  lidarReportReceived
} = planVizSlice.actions;

export const selectPlannedPath = state => state.planViz.plannedPath;
export const selectPoseConfidenceEllipse = state => state.planViz.poseConfidenceEllipse;
export const selectLidarPoints = state => state.planViz.lidarPoints;

export default planVizSlice.reducer;
