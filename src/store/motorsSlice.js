import { createSlice } from "@reduxjs/toolkit";

const motorNames = [
  "frontLeftWheel",
  "frontRightWheel",
  "rearLeftWheel",
  "rearRightWheel",
  "armBase",
  "shoulder",
  "elbow",
  "forearm",
  "wristPitch",
  "wristRoll",
  "hand",
];

const initialState = motorNames.reduce((state, motorName) => ({
  ...state,
  [motorName]: {
    currentPower: null,
    currentPosition: null
  }
}), {
  motorsEnabled: false
});

const motorSlice = createSlice({
  name: "motors",
  initialState,
  reducers: {
    motorStatusReportReceived(state, action) {
      const { motorName, power, position } = action.payload;
      const motor = state[motorName];
      motor.currentPower = power;
      motor.currentPosition = position;
      return state;
    },

    enableMotors(state, action) {
      const { enabled } = action.payload;
      state.motorsEnabled = enabled;
    }
  }
});

export const { motorStatusReportReceived, enableMotors } = motorSlice.actions;

export const selectAllMotorNames = state => Object.keys(state.motors);
export const selectMotorsAreEnabled = state => state.motors.motorsEnabled;
export const selectMotorCurrentPower = motorName => state => state.motors[motorName].currentPower;
export const selectMotorCurrentPosition = motorName => state => state.motors[motorName].currentPosition;

export default motorSlice.reducer;
