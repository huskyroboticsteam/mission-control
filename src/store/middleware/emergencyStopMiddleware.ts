import {roverConnected, messageRover} from '../roverSocketSlice.js'
import {requestStop} from '../emergencyStopSlice.js'
import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverStoreAPI} from '../store.js'

/**
 * Middleware that handles sending messages to the rover to request emergency
 * stops.
 */
export const emergencyStopMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (isAnyOf(requestStop, roverConnected)(action)) {
      store.dispatch(
        messageRover({
          message: {
            type: 'emergencyStopRequest',
            stop: store.getState().emergencyStop.stopped,
          },
        })
      )
    }

    return result
  }
