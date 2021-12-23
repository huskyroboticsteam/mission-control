import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  isConnecting: false
};

const roverSocketSlice = createSlice({
  name: "roverSocket",
  initialState,
  reducers: {
    roverConnected(state) {
      state.isConnected = true;
      state.isConnecting = false;
    },

    roverDisconnected(state) {
      state.isConnected = false;
      state.isConnecting = false;
    },

    connectToRover(state) {
      state.isConnecting = true;
      // Connecting via WebSocket is handled in middleware.
    }
  }
});

export const {
  roverConnected,
  roverDisconnected,
  connectToRover
} = roverSocketSlice.actions;
// Actions handled by rover socket middleware.
export const disconnectFromRover = createAction("roverSocket/disconnect");
export const messageRover = createAction("roverSocket/sendMessage");
export const messageReceivedFromRover = createAction("roverSocket/messageReceived");

export const selectRoverIsConnected = state => state.roverSocket.isConnected;
export const selectRoverIsConnecting = state => state.roverSocket.isConnecting;

export default roverSocketSlice.reducer;
