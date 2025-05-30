import {ROVER_SERVER_URL} from '../../constants/networkConstants'
import {
  connectToRover,
  disconnectFromRover,
  roverConnected,
  roverDisconnected,
  messageRover,
  messageReceivedFromRover,
} from '../roverSocketSlice'

/**
 * Middleware that handles connecting to, disconnecting from, and messaging the
 * rover when related actions are dispatched.
 */
const roverSocketMiddleware = () => {
  let socket = null
  let isConnecting = false

  const onOpen = (store) => () => {
    isConnecting = false
    store.dispatch(roverConnected())
  }

  const onClose = (store) => () => {
    socket = null
    isConnecting = false
    store.dispatch(roverDisconnected())
  }

  const onMessage = (store) => (event) => {
    const message = JSON.parse(event.data)
    store.dispatch(messageReceivedFromRover({message}))
  }

  return (store) => (next) => (action) => {
    const result = next(action)

    switch (action.type) {
      case connectToRover.type: {
        if (!isConnecting) {
          if (socket && socket.readyState !== WebSocket.CLOSED) {
            socket.close()
          }
          isConnecting = true
          socket = new WebSocket(ROVER_SERVER_URL)
          socket.onmessage = onMessage(store)
          socket.onclose = onClose(store)
          socket.onopen = onOpen(store)
        }
        break
      }

      case disconnectFromRover.type: {
        if (socket && socket.readyState !== WebSocket.closed) socket.close()
        break
      }

      case messageRover.type: {
        if (socket && socket.readyState === WebSocket.OPEN)
          socket.send(JSON.stringify(action.payload.message))
        else console.log(JSON.stringify(action.payload.message))
        break
      }

      default:
        break
    }

    return result
  }
}

export default roverSocketMiddleware()
