import { createSlice } from "@reduxjs/toolkit";

const motorNames = [
  "armBase",
  "shoulder",
  "elbow"
];

const initialState = motorNames.reduce((state, motorName) => ({
  ...state,
  [motorName]: {
    requestedPower: 0,
    reportedPosition: 0
  }
}), {});

const motorSlice = createSlice({
  name: "motors",
  initialState,
  reducers: {
    requestMotorPower(state, action) {
      const { motorName, power } = action.payload;
      state[motorName].requestedPower = power;
    },

    motorStatusReportReceived(state, action) {
      const { motorName, position } = action.payload;
      state[motorName].reportedPosition = position;
    }
  }
});

export const { requestMotorPower, motorStatusReportReceived } = motorSlice.actions;

export const selectRequestedMotorPower = motorName => state => state.motors[motorName].requestedPower;
export const selectReportedMotorPosition = motorName => state => state.motors[motorName].reportedPosition;

export default motorSlice.reducer;
