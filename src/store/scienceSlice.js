import { createSlice } from "@reduxjs/toolkit";

const scienceNames = [
  "fourBarLinkage",
  "drillActuator",
  "drillMotor",
  "positionRequest"
];

// List of all joints that are able to request positions
const posRequestValidJoints = [
  "fourBarLinkage"
];

const initialState = scienceNames.reduce((state, scienceName) => ({
  ...state,
  [scienceName]: {
    scienceInput: null,
  }
}), {});

const scienceSlice = createSlice({
  name: "science",
  initialState,
  reducers: {
    requestSciencePower(state, action) {
      const { scienceName, power } = action.payload;
      const science = state[scienceName];
      science.scienceInput = power;
      return state;
    }

  }
});

export const { requestSciencePower, requestSciencePosition, sciencePositionReportReceived } = scienceSlice.actions;

export const selectAllScienceNames = state => Object.keys(state.sciences);
export const selectScienceCurrentPosition = scienceName => state => state.sciences[scienceName].currentPosition;
export const getPosRequstValidJoints = posRequestValidJoints;

export default scienceSlice.reducer;
