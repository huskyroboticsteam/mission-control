import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  emergencyStopEngaged: false,
  operationMode: "teleoperation"
}

const roverSlice = createSlice({
  name: "rover",
  initialState,
  reducers: {
    roverConnected(state) {
      state.isConnected = true;
    },

    roverDisconnected(state) {
      state.isConnected = false;
    },

    emergencyStopRequested(state, action) {
      const { stop } = action.payload;
      state.emergencyStopEngaged = stop;
    },

    operationModeRequested(state, action) {
      const { operationMode } = action.payload;
      state.operationMode = operationMode;
    }
  }
});

export const { roverConnected, roverDisconnected, emergencyStopRequested } = roverSlice.actions;

// Actions handled by rover socket middleware.
export const connectToRover = createAction("rover/connect");
export const disconnectFromRover = createAction("rover/disconnect");
export const messageRover = createAction("rover/sendMessage");
export const messageReceivedFromRover = createAction("rover/messageReceived");

export const selectRoverIsConnected = state => state.rover.isConnected;
export const selectEmergencyStopEngaged = state => state.rover.emergencyStopEngaged;
export default roverSlice.reducer;
