import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import {
  connectToRover,
  disconnectFromRover,
  roverConnected,
  roverDisconnected,
  messageRover,
  messageReceivedFromRover,
} from '../roverSocketSlice.js'
import type {RootState, RoverStoreAPI} from '../store.js'
import { enableMotors } from '../motorSlice.js'

/**
 * Middleware that handles connecting to, disconnecting from, and messaging the
 * rover when related actions are dispatched.
 */
export const roverSocketMiddleware: Middleware<{}, RootState> = (store: RoverStoreAPI) => {
  let socket: WebSocket | null = null
  // Flag to restrict websocket access
  let isConnecting = false

  const onOpen = (store: RoverStoreAPI) => () => {
    isConnecting = false
    store.dispatch(roverConnected())
  }

  const onClose = (store: RoverStoreAPI) => () => {
    socket = null
    isConnecting = false
    store.dispatch(roverDisconnected())
    store.dispatch(enableMotors({enabled: false}))
  }

  const onMessage = (store: RoverStoreAPI) => (event: MessageEvent) => {
    const message = JSON.parse(event.data)
    store.dispatch(messageReceivedFromRover({message}))
  }

  return (next) => (action) => {
    const result = next(action)

    if (isAnyOf(connectToRover, disconnectFromRover, messageRover)(action)) {
      switch (action.type) {
        case connectToRover.type: {
          const state = store.getState()
          if (!state.roverSocket.isConnected && !isConnecting) {
            if (socket?.readyState !== WebSocket.CLOSED) {
              // Close the socket if there is a lingering connection, rover will reject otherwise
              socket?.close()
            }
            isConnecting = true

            socket = new WebSocket(`ws://${state.roverSocket.roverHost}:3001/mission-control`)
            socket.onmessage = onMessage(store)
            socket.onclose = onClose(store)
            socket.onopen = onOpen(store)
          }
          break
        }

        case disconnectFromRover.type: {
          if (socket && socket.readyState !== WebSocket.CLOSED) {
            socket.close()
          }
          break
        }

        case messageRover.type: {
          if (socket && socket.readyState === WebSocket.OPEN)
            socket.send(JSON.stringify(action.payload.message))
          else console.log(JSON.stringify(action.payload.message))
          break
        }
      }

      return result
    }
  }
}
