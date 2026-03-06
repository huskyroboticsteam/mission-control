import {createAction, createSlice} from '@reduxjs/toolkit'
import type {RootState} from './store.js'
import { ROVER_SERVER_URL } from '../constants/networkConstants.js'

type RoverSocketState = {
  // readonly socket: WebSocket | null
  readonly isConnected: boolean
  readonly isConnecting: boolean
}

const initialState: RoverSocketState = {
  // socket: null
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

    connectToRover: (state) => {
      state.isConnecting = true
      // Connecting via WebSocket is handled in middleware.
    },
  },
})

export const {roverConnected, roverDisconnected, connectToRover} = roverSocketSlice.actions
// Actions handled by rover socket middleware.
export const disconnectFromRover = createAction('roverSocket/disconnect')
// TODO: Do we want to specify every type of message?
export const messageRover = createAction<any>('roverSocket/sendMessage')
export const messageReceivedFromRover = createAction<any>('roverSocket/messageReceived')

export const selectRoverIsConnected = (state: RootState) => state.roverSocket.isConnected
export const selectRoverIsConnecting = (state: RootState) => state.roverSocket.isConnecting

export default roverSocketSlice.reducer
