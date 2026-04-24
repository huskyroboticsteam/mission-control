import {createAction, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'
import type {ReportMessage, RequestMessage} from '../constants/messages.js'
import { IS_DEV } from '../constants/networkConstants.js'

type RoverSocketState = {
  readonly isConnected: boolean
  readonly roverHost: string
}

const initialState: RoverSocketState = {
  isConnected: false,
  roverHost: IS_DEV ? 'localhost' : 'jetson-1'
}

export const roverSocketSlice = createSlice({
  name: 'roverSocket',
  initialState,
  reducers: {
    roverConnected: (state) => {
      state.isConnected = true
    },

    roverDisconnected: (state) => {
      state.isConnected = false
    },

    requestRoverHost: (state, action: PayloadAction<{host: string}>) => {
      state.roverHost = action.payload.host
    },
  },
})

export const {roverConnected, roverDisconnected, requestRoverHost} = roverSocketSlice.actions
// Actions handled by rover socket middleware.
// Typescript expands the action type to string, so we have to define the name twice
export const connectToRover = createAction<undefined, 'roverSocket/connectToRover'>(
  'roverSocket/connectToRover'
)
export const disconnectFromRover = createAction<undefined, 'roverSocket/disconnect'>(
  'roverSocket/disconnect'
)
export const messageRover = createAction<{message: RequestMessage}, 'roverSocket/sendMessage'>(
  'roverSocket/sendMessage'
)
export const messageReceivedFromRover = createAction<
  {message: ReportMessage},
  'roverSocket/messageReceived'
>('roverSocket/messageReceived')

export const selectRoverIsConnected = (state: RootState) => state.roverSocket.isConnected
export const selectRoverHost = (state: RootState) => state.roverSocket.roverHost

export default roverSocketSlice.reducer
