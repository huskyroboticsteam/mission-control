import {isAnyOf, type Middleware, type MiddlewareAPI} from '@reduxjs/toolkit'
import {ROVER_SERVER_URL} from '../../constants/networkConstants.js'
import {
  connectToRover,
  disconnectFromRover,
  roverConnected,
  roverDisconnected,
  messageRover,
  messageReceivedFromRover,
  roverSocketSlice,
} from '../roverSocketSlice.js'
import type {RootState, RoverStoreAPI} from '../store.js'

/**
 * Middleware that handles connecting to, disconnecting from, and messaging the
 * rover when related actions are dispatched.
 */
export const roverSocketMiddleware: Middleware<{}, RootState> = (store: RoverStoreAPI) => {
  let socket: WebSocket | null = null

  const onOpen = (store: RoverStoreAPI) => () => {
    store.dispatch(roverConnected())
  }

  const onClose = (store: RoverStoreAPI) => () => {
    socket = null
    store.dispatch(roverDisconnected())
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
          if (!store.getState().roverSocket.isConnected) {
            socket = new WebSocket(ROVER_SERVER_URL)
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
