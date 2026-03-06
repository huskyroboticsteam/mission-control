import type {Middleware} from '@reduxjs/toolkit'
import {mountedPeripheralReportReceived} from '../peripheralSlice.js'
import {messageReceivedFromRover, roverDisconnected} from '../roverSocketSlice.js'
import type {RootState} from '../store.js'

/**
 * Middleware that handles receiving mounted peripheral reports from the rover.
 */
export const peripheralMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
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
