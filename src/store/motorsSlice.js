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
    currentPower: null,
    targetPosition: 0,
    currentPosition: null,
    currentVelocity: null
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

    requestMotorPosition(state, action) {
      const { motorName, position } = action.payload;
      state[motorName].targetPosition = position;
    },

    motorStatusReportReceived(state, action) {
      const { motorName, power, position, velocity } = action.payload;
      const motor = state[motorName];
      motor.currentPower = power;
      motor.currentPosition = position;
      motor.currentVelocity = velocity;
    }
  }
});

export const {
  requestMotorPower,
  requestMotorPosition,
  motorStatusReportReceived
} = motorSlice.actions;

export const selectAllMotorNames = state => Object.keys(state.motors);
export const selectMotorTargetPower = motorName => state => state.motors[motorName].targetPower;
export const selectMotorCurrentPower = motorName => state => state.motors[motorName].currentPower;
export const selectMotorTargetPosition = motorName => state => state.motors[motorName].targetPosition;
export const selectMotorCurrentPosition = motorName => state => state.motors[motorName].currentPosition;
export const selectMotorCurrentVelocity = motorName => state => state.motors[motorName].currentVelocity;

export default motorSlice.reducer;
