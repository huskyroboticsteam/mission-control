import {mountedPeripheralReportReceived} from '../peripheralsSlice'
import {messageReceivedFromRover, roverDisconnected} from '../roverSocketSlice'

/**
 * Middleware that handles receiving mounted peripheral reports from the rover.
 */
const peripheralsMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case roverDisconnected.type: {
      store.dispatch(
        mountedPeripheralReportReceived({
          peripheral: null,
        })
      )
      break
    }

    case messageReceivedFromRover.type: {
      const {message} = action.payload
      if (message.type === 'mountedPeripheralReport')
        store.dispatch(
          mountedPeripheralReportReceived({
            peripheral: message.peripheral,
          })
        )
      break
    }

    default:
      break
  }

  return result
}

export default peripheralsMiddleware
