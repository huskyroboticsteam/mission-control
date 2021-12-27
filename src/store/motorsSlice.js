import { createSlice } from "@reduxjs/toolkit";

const motorNames = [
  "frontLeftWheel",
  "frontRightWheel",
  "rearLeftWheel",
  "rearRightWheel",
  "armBase",
  "shoulder",
  "elbow"
];

const initialState = motorNames.reduce((state, motorName) => ({
  ...state,
  [motorName]: {
    targetPower: 0,
    currentPosition: 0
  }
}), {});

const motorSlice = createSlice({
  name: "motors",
  initialState,
  reducers: {
    requestMotorPower(state, action) {
      const { motorName, power } = action.payload;
      state[motorName].targetPower = power;
    },

    motorStatusReportReceived(state, action) {
      const { motorName, position } = action.payload;
      state[motorName].currentPosition = position;
    }
  }
});

export const { requestMotorPower, motorStatusReportReceived } = motorSlice.actions;

export const selectMotorTargetPower = motorName => state => state.motors[motorName].targetPower;
export const selectMotorCurrentPosition = motorName => state => state.motors[motorName].currentPosition;

export default motorSlice.reducer;
