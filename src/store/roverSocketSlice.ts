import {createAction, createSlice} from '@reduxjs/toolkit'
import type {RootState} from './store.js'

type RoverSocketState = {
  readonly isConnected: boolean
  readonly isConnecting: boolean
}

const initialState: RoverSocketState = {
  isConnected: false,
  isConnecting: false,
}

export const roverSocketSlice = createSlice({
  name: 'roverSocket',
  initialState,
  reducers: {
    roverConnected: (state) => {
      state.isConnected = true
      state.isConnecting = false
    },

    roverDisconnected: (state) => {
      state.isConnected = false
      state.isConnecting = false
    },

    connectToRover(state) {
      state.isConnecting = true
      // Connecting via WebSocket is handled in middleware.
    },
  },
})

export const {roverConnected, roverDisconnected, connectToRover} = roverSocketSlice.actions
// Actions handled by rover socket middleware.
export const disconnectFromRover = createAction('roverSocket/disconnect')
export const messageRover = createAction<JSON>('roverSocket/sendMessage')
export const messageReceivedFromRover = createAction('roverSocket/messageReceived')

export const selectRoverIsConnected = (state: RootState) => state.roverSocket.isConnected
export const selectRoverIsConnecting = (state: RootState) => state.roverSocket.isConnecting

export default roverSocketSlice.reducer
