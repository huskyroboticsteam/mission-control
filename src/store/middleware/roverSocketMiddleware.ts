import type {Middleware, MiddlewareAPI} from '@reduxjs/toolkit'
import {ROVER_SERVER_URL} from '../../constants/networkConstants.js'
import {
  connectToRover,
  disconnectFromRover,
  roverConnected,
  roverDisconnected,
  messageRover,
  messageReceivedFromRover,
} from '../roverSocketSlice.js'
import type {RootState} from '../store.js'

/**
 * Middleware that handles connecting to, disconnecting from, and messaging the
 * rover when related actions are dispatched.
 */
export const roverSocketMiddleware = (): Middleware<{}, RootState> => {
  let socket: WebSocket | null = null

  const onOpen = (store: MiddlewareAPI) => () => {
    store.dispatch(roverConnected())
  }

  const onClose = (store: MiddlewareAPI) => () => {
    socket = null
    store.dispatch(roverDisconnected())
  }

  const onMessage = (store: MiddlewareAPI) => (event: MessageEvent) => {
    const message = JSON.parse(event.data)
    store.dispatch(messageReceivedFromRover({message}))
  }

  return (store) => (next) => (action) => {
    const result = next(action)

    switch (action.type) {
      case connectToRover.type:
        if (store.getState().roverSocket.isConnected) {
          store.dispatch(roverConnected())
          break
        }

        socket = new WebSocket(ROVER_SERVER_URL)
        socket.onmessage = onMessage(store)
        socket.onclose = onClose(store)
        socket.onopen = onOpen(store)
        break

      case disconnectFromRover.type:
        if (socket && socket.readyState !== WebSocket.CLOSED) {
          socket.close()
        }
        break

      case messageRover.type:
        if (socket && socket.readyState === WebSocket.OPEN)
          socket.send(JSON.stringify(action.payload.message))
        else console.log(JSON.stringify(action.payload.message))
        break

      default:
        break
    }

    return result
  }
}
