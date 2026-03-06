import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import {mountedPeripheralReportReceived} from '../peripheralSlice.js'
import {messageReceivedFromRover, roverDisconnected} from '../roverSocketSlice.js'
import type {RootState, RoverStoreAPI} from '../store.js'

/**
 * Middleware that handles receiving mounted peripheral reports from the rover.
 */
export const peripheralMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (isAnyOf(roverDisconnected, messageReceivedFromRover)(action)) {
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
      }
    }

    return result
  }
