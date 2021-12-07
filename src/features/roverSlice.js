import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  emergencyStopEngaged: false
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
    }
  }
});

export const { roverConnected, roverDisconnected, emergencyStopRequested } = roverSlice.actions;
export const connectToRover = createAction("rover/connect");
export const disconnectFromRover = createAction("rover/disconnect");
export const selectRoverIsConnected = state => state.rover.isConnected;
export const selectEmergencyStopEngaged = state => state.rover.emergencyStopEngaged;
export default roverSlice.reducer;
