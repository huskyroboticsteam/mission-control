import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  isConnecting: false,
  messageLog: [],
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
    },

    logMessage: (state, action) => {
      state.messageLog = [
        ...state.messageLog,
        {
          timestamp: new Date().toISOString(),
          ...action.payload,
        },
      ].slice(-100);
    },
  },
});

export const { roverConnected, roverDisconnected, connectToRover, logMessage } =
  roverSocketSlice.actions;
export const disconnectFromRover = createAction("roverSocket/disconnect");
export const messageRover = createAction("roverSocket/sendMessage");
export const messageReceivedFromRover = createAction(
  "roverSocket/messageReceived"
);

export const selectRoverIsConnected = (state) => state.roverSocket.isConnected;
export const selectRoverIsConnecting = (state) =>
  state.roverSocket.isConnecting;
export const selectMessageLog = (state) => state.roverSocket.messageLog;

export default roverSocketSlice.reducer;
